"use client";

import { useEffect, useState, useRef } from "react";
import { WebrtcPeer } from "@/utils/webrtc-peer";
import { generateKey, exportKey, importKey } from "@/utils/crypto-helper";

export default function Home() {
  const [roomId, setRoomId] = useState("");
  const [peer, setPeer] = useState<WebrtcPeer | null>(null);
  const [status, setStatus] = useState("disconnected");
  const [messages, setMessages] = useState<string[]>([]);
  const [inputMsg, setInputMsg] = useState("");
  const [isInitiator, setIsInitiator] = useState(false);
  const peerIdRef = useRef(Math.random().toString(36).substring(7));

  useEffect(() => {
    const rId = new URLSearchParams(window.location.search).get("room");
    if (rId) { setRoomId(rId); setIsInitiator(false); }
  }, []);

  const connect = (rId: string, init: boolean, key: CryptoKey) => {
    setPeer(new WebrtcPeer(
      "ws://localhost:8080", rId, peerIdRef.current, init, key,
      (s) => setStatus(s),
      (m) => setMessages((prev) => [...prev, `Received: ${m}`])
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
    if (roomId && keyStr) {
      connect(roomId, false, await importKey(keyStr));
    }
  };

  const handleSend = () => {
    if (peer && inputMsg) {
      peer.send(inputMsg);
      setMessages((prev) => [...prev, `Sent: ${inputMsg}`]);
      setInputMsg("");
    }
  };

  return (
    <div className="p-8 font-sans max-w-md mx-auto space-y-4">
      <h1 className="text-xl font-bold">SnapFox E2E Cryptography Test</h1>
      <div>Status: <span className="font-semibold text-blue-600">{status}</span></div>
      {!peer ? (
        <div className="space-y-2">
          <button onClick={createRoom} className="w-full bg-emerald-600 text-white py-2 rounded">
            Create Room
          </button>
          <div className="flex gap-2">
            <input value={roomId} onChange={(e) => setRoomId(e.target.value)} placeholder="Room ID" className="border p-2 flex-1 rounded text-black" />
            <button onClick={joinRoom} className="bg-zinc-800 text-white px-4 rounded">Join</button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div>Room: <span className="font-mono">{roomId}</span> ({isInitiator ? "Host" : "Guest"})</div>
          <div className="border p-2 h-40 overflow-y-auto bg-zinc-900 rounded text-sm text-zinc-300">
            {messages.map((m, i) => <div key={i}>{m}</div>)}
          </div>
          <div className="flex gap-2">
            <input value={inputMsg} onChange={(e) => setInputMsg(e.target.value)} placeholder="Message..." className="border p-2 flex-1 rounded text-black" />
            <button onClick={handleSend} className="bg-emerald-600 text-white px-4 rounded">Send</button>
          </div>
        </div>
      )}
    </div>
  );
}
