import { Plus, LinkSimple } from "@phosphor-icons/react/dist/ssr";

interface Props {
  joinCode: string;
  setJoinCode: (code: string) => void;
  onStart: () => void;
  onJoin: () => void;
}

export function ConnectionPanel({ joinCode, setJoinCode, onStart, onJoin }: Props) {
  return (
    <div className="max-w-2xl mx-auto w-full px-6 flex flex-col md:flex-row gap-6 mt-8">
      
      {/* Start Fresh Card */}
      <div className="flex-1 bg-white p-8 rounded-3xl shadow-sm border border-stone-100 flex flex-col items-center text-center">
        <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-fox mb-4">
          <Plus weight="bold" size={24} />
        </div>
        <h2 className="text-xl font-bold text-stone-900 mb-2">Start sharing</h2>
        <p className="text-stone-500 mb-6 text-sm">
          Create a new secure link to share files from this device.
        </p>
        <button
          onClick={onStart}
          className="w-full bg-stone-900 hover:bg-black text-white font-medium py-3.5 px-6 rounded-xl transition-all active:scale-[0.98]"
        >
          Create New Link
        </button>
      </div>

      {/* Connect to Existing Card */}
      <div className="flex-1 bg-white p-8 rounded-3xl shadow-sm border border-stone-100 flex flex-col items-center text-center">
        <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center text-stone-700 mb-4">
          <LinkSimple weight="bold" size={24} />
        </div>
        <h2 className="text-xl font-bold text-stone-900 mb-2">Have a code?</h2>
        <p className="text-stone-500 mb-6 text-sm">
          Enter a connection code from another device to pair them.
        </p>
        <div className="w-full flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.trim())}
            placeholder="e.g. xyz123"
            className="flex-1 bg-stone-50 border border-stone-200 text-stone-900 font-medium px-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-fox/20 focus:border-fox transition-all"
            onKeyDown={(e) => e.key === "Enter" && onJoin()}
          />
          <button
            onClick={onJoin}
            disabled={!joinCode}
            className="bg-fox hover:bg-[#E64A2E] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-6 py-3.5 rounded-xl transition-all active:scale-[0.98] whitespace-nowrap"
          >
            Connect
          </button>
        </div>
      </div>
      
    </div>
  );
}
