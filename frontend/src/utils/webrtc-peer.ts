import { encryptRaw, decryptRaw } from "./crypto-helper";

export class WebrtcPeer {
  pc = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });
  dc: RTCDataChannel | null = null;
  private ws: WebSocket;
  private rxChunks: Uint8Array[] = [];
  private rxBytes = 0;
  private meta: { name: string; size: number; type: string } | null = null;

  constructor(
    wsUrl: string, private roomId: string, private peerId: string,
    private isInitiator: boolean, private key: CryptoKey,
    private onStatus: (status: string) => void, private onMessage: (msg: string) => void,
    private onFile: (blob: Blob, name: string) => void, private onProgress?: (rx: number, total: number) => void
  ) {
    this.ws = new WebSocket(wsUrl);
    this.ws.onopen = () => this.ws.send(JSON.stringify({ type: "join", roomId, peerId }));
    this.ws.onmessage = (e) => this.handleSignaling(JSON.parse(e.data));
    this.pc.onicecandidate = (e) => e.candidate && this.sendSignal({ candidate: e.candidate });
    this.pc.onconnectionstatechange = () => this.onStatus(this.pc.connectionState);
    if (this.isInitiator) this.setupDc(this.pc.createDataChannel("data-channel"));
    else this.pc.ondatachannel = (e) => this.setupDc(e.channel);
  }

  encryptRaw(data: Uint8Array) { return encryptRaw(data, this.key); }

  private setupDc(dc: RTCDataChannel) {
    this.dc = dc;
    dc.binaryType = "arraybuffer";
    dc.onopen = () => this.onStatus("connected");
    dc.onclose = () => this.onStatus("disconnected");
    dc.onmessage = (e) => this.handleData(new Uint8Array(e.data));
  }

  private async handleData(data: Uint8Array) {
    const type = data[0];
    const payload = data.slice(1);
    if (type === 0x01) {
      this.onMessage(new TextDecoder().decode(await decryptRaw(payload, this.key)));
    } else if (type === 0x02) {
      this.meta = JSON.parse(new TextDecoder().decode(await decryptRaw(payload, this.key)));
      this.rxChunks = []; this.rxBytes = 0;
    } else if (type === 0x03 && this.meta) {
      const decrypted = await decryptRaw(payload, this.key);
      this.rxChunks.push(decrypted);
      this.rxBytes += decrypted.length;
      this.onProgress?.(this.rxBytes, this.meta.size);
    } else if (type === 0x04 && this.meta) {
      this.onFile(new Blob(this.rxChunks as any, { type: this.meta.type }), this.meta.name);
    }
  }

  async sendText(text: string) {
    if (this.dc?.readyState !== "open") return;
    const encrypted = await encryptRaw(new TextEncoder().encode(text), this.key);
    const msg = new Uint8Array(1 + encrypted.length);
    msg[0] = 0x01; msg.set(encrypted, 1);
    this.dc.send(msg);
  }

  private async handleSignaling(data: any) {
    if (data.type === "peer-joined" && this.isInitiator) {
      const offer = await this.pc.createOffer();
      await this.pc.setLocalDescription(offer);
      this.sendSignal({ sdp: this.pc.localDescription });
    } else if (data.type === "signal") {
      const { signal } = data;
      if (signal.sdp) {
        await this.pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
        if (signal.sdp.type === "offer") {
          const answer = await this.pc.createAnswer();
          await this.pc.setLocalDescription(answer);
          this.sendSignal({ sdp: this.pc.localDescription });
        }
      } else if (signal.candidate) {
        await this.pc.addIceCandidate(new RTCIceCandidate(signal.candidate));
      }
    }
  }

  private sendSignal(signal: any) {
    if (this.ws.readyState === WebSocket.OPEN) this.ws.send(JSON.stringify({ type: "signal", signal }));
  }

  close() { this.ws.close(); this.pc.close(); }
}
