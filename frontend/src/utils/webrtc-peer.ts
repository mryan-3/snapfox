export class WebrtcPeer {
  pc = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });
  dc: RTCDataChannel | null = null;
  private ws: WebSocket;

  constructor(
    wsUrl: string,
    private roomId: string,
    private peerId: string,
    private isInitiator: boolean,
    private onStatus: (status: string) => void,
    private onMessage: (msg: string) => void
  ) {
    this.ws = new WebSocket(wsUrl);
    this.ws.onopen = () => this.ws.send(JSON.stringify({ type: "join", roomId, peerId }));
    this.ws.onmessage = (e) => this.handleSignaling(JSON.parse(e.data));
    
    this.pc.onicecandidate = (e) => e.candidate && this.sendSignal({ candidate: e.candidate });
    this.pc.onconnectionstatechange = () => this.onStatus(this.pc.connectionState);

    if (this.isInitiator) {
      this.dc = this.pc.createDataChannel("data-channel");
      this.setupDataChannel(this.dc);
    } else {
      this.pc.ondatachannel = (e) => {
        this.dc = e.channel;
        this.setupDataChannel(this.dc);
      };
    }
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

  private setupDataChannel(dc: RTCDataChannel) {
    dc.onopen = () => this.onStatus("connected");
    dc.onclose = () => this.onStatus("disconnected");
    dc.onmessage = (e) => this.onMessage(e.data);
  }

  send(data: string) {
    if (this.dc?.readyState === "open") this.dc.send(data);
  }

  private sendSignal(signal: any) {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: "signal", signal }));
    }
  }

  close() {
    this.ws.close();
    this.pc.close();
  }
}
