"use client";

import { useEffect, useState, useRef } from "react";
import { WebrtcPeer } from "@/utils/webrtc-peer";

export default function Home() {
  const [roomId, setRoomId] = useState("");
  const [peer, setPeer] = useState<WebrtcPeer | null>(null);
  const [status, setStatus] = useState("disconnected");
  const [messages, setMessages] = useState<string[]>([]);
  const [inputMsg, setInputMsg] = useState("");
  const [isInitiator, setIsInitiator] = useState(false);
  const peerIdRef = useRef(Math.random().toString(36).substring(7));

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const rId = params.get("room");
    if (rId) {
      setRoomId(rId);
      setIsInitiator(false);
    }
  }, []);

  const startConnection = (rId: string, init: boolean) => {
    const wsUrl = "ws://localhost:8080";
    const p = new WebrtcPeer(
      wsUrl,
      rId,
      peerIdRef.current,
      init,
      (s) => setStatus(s),
      (msg) => setMessages((prev) => [...prev, `Received: ${msg}`])
    );
    setPeer(p);
  };

  const createRoom = () => {
    const rId = Math.random().toString(36).substring(7);
    setRoomId(rId);
    setIsInitiator(true);
    window.history.pushState({}, "", `?room=${rId}`);
    startConnection(rId, true);
  };

  const joinRoom = () => {
    if (roomId) startConnection(roomId, false);
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
      <h1 className="text-xl font-bold">SnapFox Phase 2 Test</h1>
      <div>Status: <span className="font-semibold text-blue-600">{status}</span></div>
      {!peer ? (
        <div className="space-y-2">
          <button onClick={createRoom} className="w-full bg-emerald-600 text-white py-2 rounded">
            Create Room
          </button>
          <div className="flex gap-2">
            <input
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Room ID"
              className="border p-2 flex-1 rounded text-black"
            />
            <button onClick={joinRoom} className="bg-zinc-800 text-white px-4 rounded">
              Join
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div>Room ID: <span className="font-mono">{roomId}</span> ({isInitiator ? "Host" : "Guest"})</div>
          <div className="border p-2 h-40 overflow-y-auto bg-zinc-900 rounded space-y-1 text-sm text-zinc-300">
            {messages.map((m, i) => <div key={i}>{m}</div>)}
          </div>
          <div className="flex gap-2">
            <input
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder="Message..."
              className="border p-2 flex-1 rounded text-black"
            />
            <button onClick={handleSend} className="bg-emerald-600 text-white px-4 rounded">
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
