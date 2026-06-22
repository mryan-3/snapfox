import dynamic from "next/dynamic";
const QrTicket = dynamic(() => import("./qr-ticket").then(mod => mod.QrTicket), { ssr: false });
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { useState, useEffect } from "react";

interface Props {
  roomId: string;
  joinCode: string;
  setJoinCode: (c: string) => void;
  onJoin: () => void;
}

export function PairingHero({ roomId, joinCode, setJoinCode, onJoin }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  const url = mounted ? `${window.location.origin}/?room=${roomId}` : "";

  return (
    <div className="flex flex-col px-4 sm:px-6 pt-8 pb-12 md:pb-24 max-w-6xl mx-auto w-full">
      <div className="w-full flex justify-center items-center gap-4 mb-6 md:mb-8">
        <img src="/logo.png" alt="SnapFox Logo" className="w-20 h-20 md:w-16 md:h-16 object-contain mix-blend-multiply" />
        <h1 className="hidden md:block text-4xl font-display font-extrabold text-stone-900 tracking-tight">SnapFox</h1>
      </div>

      <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16">
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-5xl lg:text-7xl font-display font-extrabold text-stone-900 leading-[1.1] tracking-tight mb-6">
            Share <br /> Instantly.
          </h1>
          <p className="text-lg text-stone-600 max-w-md mx-auto lg:mx-0 mb-10 leading-relaxed">
            SnapFox connects your devices directly over the local network. No servers. No limits.
          </p>

          <div className="bg-white p-2 rounded-xl border border-stone-200/60 flex items-center max-w-md mx-auto lg:mx-0">
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.trim().toUpperCase())}
              placeholder="Enter a connection code..."
              className="flex-1 bg-transparent px-4 py-3 text-stone-900 font-medium placeholder:font-normal focus:outline-none"
              onKeyDown={(e) => e.key === "Enter" && onJoin()}
            />
            <button
              onClick={onJoin}
              disabled={!joinCode || joinCode === roomId}
              className="bg-accent hover:opacity-90 disabled:bg-stone-200 disabled:text-stone-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-medium transition-all"
            >
              <ArrowRight weight="bold" size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 w-full max-w-md">
          <div className="text-center mb-4 lg:hidden">
            <p className="text-sm font-bold tracking-widest text-stone-400 uppercase">Or scan to pair</p>
          </div>
          {mounted ? (
            <QrTicket url={url} roomId={roomId} />
          ) : (
            <div className="w-full max-w-sm h-[380px] bg-white rounded-2xl border border-stone-100/50 animate-pulse mx-auto" />
          )}
        </div>
      </div>
    </div>
  );
}

