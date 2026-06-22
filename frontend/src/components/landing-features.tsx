import { GithubLogo } from "@phosphor-icons/react/dist/ssr";
import { memo } from "react";

export const LandingFeatures = memo(function LandingFeatures() {
  return (
    <div className="border-t border-stone-300/50 bg-stone-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 w-full flex flex-col">
        <div className="flex flex-col md:flex-row justify-between gap-12 md:gap-16 mb-24">
          <div className="flex-1 relative pt-12">
            <div className="absolute top-0 right-0 text-[10rem] md:text-[14rem] font-display font-black text-accent/10 leading-none select-none z-0">1</div>
            <div className="relative z-10">
              <h3 className="text-3xl font-bold text-stone-900 mb-4">Open</h3>
              <p className="text-stone-600 text-lg leading-relaxed">Launch SnapFox on your primary device. No accounts or downloads required.</p>
            </div>
          </div>
          <div className="flex-1 relative pt-12">
            <div className="absolute top-0 right-0 text-[10rem] md:text-[14rem] font-display font-black text-accent/10 leading-none select-none z-0">2</div>
            <div className="relative z-10">
              <h3 className="text-3xl font-bold text-stone-900 mb-4">Scan</h3>
              <p className="text-stone-600 text-lg leading-relaxed">Scan the QR code, or enter the 6-character connection code.</p>
            </div>
          </div>
          <div className="flex-1 relative pt-12">
            <div className="absolute top-0 right-0 text-[10rem] md:text-[14rem] font-display font-black text-accent/10 leading-none select-none z-0">3</div>
            <div className="relative z-10">
              <h3 className="text-3xl font-bold text-stone-900 mb-4">Share</h3>
              <p className="text-stone-600 text-lg leading-relaxed">Instantly send text, links, and high-res files back and forth with zero latency.</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-12 md:gap-16 mb-16 md:mb-32 mt-8 md:mt-12">
          <div className="flex-1 space-y-4">
            <div className="text-accent font-bold tracking-widest text-sm uppercase">Speed</div>
            <h3 className="text-2xl font-bold text-stone-900">Blazing Fast Transfers</h3>
            <p className="text-stone-600 text-lg leading-relaxed">Because SnapFox connects devices over your local network, speeds are bound only by your WiFi, completely bypassing slow cloud uploads.</p>
          </div>

          <div className="flex-1 space-y-4">
            <div className="text-accent font-bold tracking-widest text-sm uppercase">Privacy</div>
            <h3 className="text-2xl font-bold text-stone-900">End-to-End Secure</h3>
            <p className="text-stone-600 text-lg leading-relaxed">Your files never touch a server. WebRTC enforces a secure, encrypted peer-to-peer connection so your data remains strictly yours.</p>
          </div>
        </div>

        <div className="bg-stone-900 rounded-4xl md:rounded-4xl p-8 md:p-16 flex flex-col md:flex-row items-center justify-between text-white shadow-xl">
          <div className="max-w-lg mb-8 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Open Source.</h2>
            <p className="text-stone-400 text-lg">SnapFox is entirely open-source. Inspect the code, host it yourself, or contribute to make local sharing even better.</p>
          </div>

          <a
            href="https://github.com/ryanm/snapfox"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-stone-900 rounded-full font-bold hover:bg-stone-100 transition-colors shadow-sm shrink-0"
          >
            <GithubLogo size={24} weight="fill" />
            <span>View Source on GitHub</span>
          </a>
        </div>
      </div>
    </div>
  );
});
