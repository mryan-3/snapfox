"use client";

import { useEffect, useState, useRef } from "react";
import { WebrtcPeer } from "@/utils/webrtc-peer";
import { sendFileInChunks } from "@/utils/file-transfer";
import { PairingScreen } from "@/components/pairing-screen";
import { ActiveSharing } from "@/components/active-sharing";
import { LandingFeatures } from "@/components/landing-features";

export default function Home() {
  const [roomId, setRoomId] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [peer, setPeer] = useState<WebrtcPeer | null>(null);
  const [status, setStatus] = useState("disconnected");
  const [messages, setMessages] = useState<string[]>([]);
  const [txProgress, setTxProgress] = useState(0);
  const [rxProgress, setRxProgress] = useState(0);
  const [rxFile, setRxFile] = useState<{ url: string; name: string } | null>(null);
  const [remoteDevice, setRemoteDevice] = useState("remote device");

  const peerIdRef = useRef(Math.random().toString(36).substring(7));
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const rId = new URLSearchParams(window.location.search).get("room");
    if (rId) {
      setRoomId(rId);
      setJoinCode(rId);
      connect(rId, false);
    } else {
      const newRoomId = Math.random().toString(36).substring(7).toUpperCase();
      setRoomId(newRoomId);
      window.history.replaceState({}, "", `?room=${newRoomId}`);
      connect(newRoomId, true);
    }
  }, []);

  const connect = (rId: string, init: boolean) => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsPort = process.env.NEXT_PUBLIC_WS_PORT || "8080";
    const defaultWsUrl = `${protocol}//${window.location.hostname}:${wsPort}`;
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || defaultWsUrl;
    
    setPeer(new WebrtcPeer(
      wsUrl, rId, peerIdRef.current, init,
      (s) => setStatus(s),
      (m) => setMessages((prev) => [m, ...prev]),
      (blob, name) => setRxFile({ url: URL.createObjectURL(blob), name }),
      (rx, total) => setRxProgress(Math.round((rx / total) * 100)),
      (name) => setRemoteDevice(name)
    ));
  };

  const handleManualJoin = () => {
    if (joinCode && joinCode !== roomId) {
      if (peer) peer.close();
      setRoomId(joinCode);
      window.history.pushState({}, "", `?room=${joinCode}`);
      connect(joinCode, false);
    }
  };

  const handleSendText = (msg: string) => {
    if (peer && msg) { peer.sendText(msg); }
  };

  const handleSendFile = async (file: File) => {
    if (peer) {
      setTxProgress(0);
      await sendFileInChunks(peer, file, (sent) => setTxProgress(Math.round((sent / file.size) * 100)));
    }
  };

  return (
    <main className="w-full flex flex-col">
      {status !== "connected" ? (
        <>
          <PairingScreen roomId={roomId} joinCode={joinCode} setJoinCode={setJoinCode} onJoin={handleManualJoin} />
          <LandingFeatures />
        </>
      ) : (
        <ActiveSharing 
          roomId={roomId} messages={messages} rxFile={rxFile} rxProgress={rxProgress} 
          onSendText={handleSendText} onSendFile={handleSendFile} 
          txProgress={txProgress} remoteDevice={remoteDevice}
        />
      )}
    </main>
  );
}
