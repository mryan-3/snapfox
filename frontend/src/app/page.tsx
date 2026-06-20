"use client";

import { useEffect, useState, useRef } from "react";
import { WebrtcPeer } from "@/utils/webrtc-peer";
import { generateKey, exportKey, importKey } from "@/utils/crypto-helper";
import { sendFileInChunks } from "@/utils/file-transfer";

export default function Home() {
  const [roomId, setRoomId] = useState("");
  const [peer, setPeer] = useState<WebrtcPeer | null>(null);
  const [status, setStatus] = useState("disconnected");
  const [messages, setMessages] = useState<string[]>([]);
  const [inputMsg, setInputMsg] = useState("");
  const [isInitiator, setIsInitiator] = useState(false);
  const [txProgress, setTxProgress] = useState(0);
  const [rxProgress, setRxProgress] = useState(0);
  const [rxFile, setRxFile] = useState<{ url: string; name: string } | null>(null);
  
  const peerIdRef = useRef(Math.random().toString(36).substring(7));
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const rId = new URLSearchParams(window.location.search).get("room");
    if (rId) { setRoomId(rId); setIsInitiator(false); }
  }, []);

  const connect = (rId: string, init: boolean, key: CryptoKey) => {
    setPeer(new WebrtcPeer(
      "ws://localhost:8080", rId, peerIdRef.current, init, key,
      (s) => setStatus(s),
      (m) => setMessages((prev) => [...prev, `Received: ${m}`]),
      (blob, name) => setRxFile({ url: URL.createObjectURL(blob), name }),
      (rx, total) => setRxProgress(Math.round((rx / total) * 100))
    ));
  };

  const createRoom = async () => {
    const rId = Math.random().toString(36).substring(7);
    const key = await generateKey();
    const keyStr = await exportKey(key);
    setRoomId(rId);
    setIsInitiator(true);
    window.history.pushState({}, "", `?room=${rId}#key=${keyStr}`);
    connect(rId, true, key);
  };

  const joinRoom = async () => {
    const keyStr = window.location.hash.match(/#key=(.+)/)?.[1];
    if (roomId && keyStr) connect(roomId, false, await importKey(keyStr));
  };

  const handleSendText = () => {
    if (peer && inputMsg) {
      peer.sendText(inputMsg);
      setMessages((prev) => [...prev, `Sent: ${inputMsg}`]);
      setInputMsg("");
    }
  };

  const handleSendFile = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (peer && file) {
      setTxProgress(0);
      await sendFileInChunks(peer, file, (sent) => setTxProgress(Math.round((sent / file.size) * 100)));
    }
  };

  return (
    <div className="p-8 font-sans max-w-md mx-auto space-y-4">
      <h1 className="text-xl font-bold">SnapFox Phase 4 File Test</h1>
      <div>Status: <span className="font-semibold text-blue-600">{status}</span></div>
      {!peer ? (
        <div className="space-y-2">
          <button onClick={createRoom} className="w-full bg-emerald-600 text-white py-2 rounded">Create Room</button>
          <div className="flex gap-2">
            <input value={roomId} onChange={(e) => setRoomId(e.target.value)} placeholder="Room ID" className="border p-2 flex-1 rounded text-black" />
            <button onClick={joinRoom} className="bg-zinc-800 text-white px-4 rounded">Join</button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>Room: <span className="font-mono">{roomId}</span> ({isInitiator ? "Host" : "Guest"})</div>
          <div className="flex gap-2">
            <input value={inputMsg} onChange={(e) => setInputMsg(e.target.value)} placeholder="Message..." className="border p-2 flex-1 rounded text-black" />
            <button onClick={handleSendText} className="bg-emerald-600 text-white px-4 rounded">Send</button>
          </div>
          <div className="border p-2 rounded space-y-2">
            <input type="file" ref={fileInputRef} className="text-sm" />
            <button onClick={handleSendFile} className="w-full bg-blue-600 text-white py-2 rounded">Send File</button>
            {txProgress > 0 && <div>Sending: {txProgress}%</div>}
          </div>
          {rxProgress > 0 && <div>Receiving: {rxProgress}%</div>}
          {rxFile && <a href={rxFile.url} download={rxFile.name} className="block text-emerald-600 underline font-semibold">Download {rxFile.name}</a>}
        </div>
      )}
    </div>
  );
}
