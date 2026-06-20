import { WebrtcPeer } from "./webrtc-peer";

const CHUNK_SIZE = 64 * 1024; // 64KB chunks
const BUFFER_THRESHOLD = 512 * 1024; // 512KB buffer threshold

export async function sendFileInChunks(
  peer: WebrtcPeer,
  file: File,
  onProgress: (sent: number) => void
) {
  const dc = peer.dc;
  if (!dc || dc.readyState !== "open") return;

  // Send metadata: type (0x02) + JSON: { name, size, type }
  const meta = new TextEncoder().encode(JSON.stringify({ name: file.name, size: file.size, type: file.type }));
  const encryptedMeta = await peer.encryptRaw(meta);
  const metaMsg = new Uint8Array(1 + encryptedMeta.length);
  metaMsg[0] = 0x02;
  metaMsg.set(encryptedMeta, 1);
  dc.send(metaMsg);

  let offset = 0;
  dc.bufferedAmountLowThreshold = BUFFER_THRESHOLD / 2;

  const sendNextChunk = async () => {
    while (offset < file.size) {
      if (dc.bufferedAmount > BUFFER_THRESHOLD) {
        dc.onbufferedamountlow = () => {
          dc.onbufferedamountlow = null;
          sendNextChunk();
        };
        return;
      }

      const slice = file.slice(offset, offset + CHUNK_SIZE);
      const buffer = await slice.arrayBuffer();
      const encryptedChunk = await peer.encryptRaw(new Uint8Array(buffer));
      
      const chunkMsg = new Uint8Array(1 + encryptedChunk.length);
      chunkMsg[0] = 0x03;
      chunkMsg.set(encryptedChunk, 1);
      dc.send(chunkMsg);

      offset += slice.size;
      onProgress(offset);
    }

    // Send complete message: type (0x04)
    const endMsg = new Uint8Array([0x04]);
    dc.send(endMsg);
  };

  sendNextChunk();
}
