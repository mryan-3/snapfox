import { TransferZone } from "./transfer-zone";
import { DownloadSimple, Copy } from "@phosphor-icons/react/dist/ssr";

interface Props {
  roomId: string;
  messages: string[];
  rxFile: { url: string; name: string } | null;
  rxProgress: number;
  onSendText: (m: string) => void;
  onSendFile: (f: File) => void;
  txProgress: number;
  remoteDevice?: string;
}

export function ActiveSharing({ roomId, messages, rxFile, rxProgress, onSendText, onSendFile, txProgress, remoteDevice }: Props) {
  return (
    <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 flex flex-col gap-6 md:gap-8 mt-6 md:mt-12 mb-12 md:mb-24">

      {/* Brand Header */}
      <div className="flex items-center justify-center gap-4">
        <img src="/logo.png" alt="SnapFox Logo" className="w-16 h-16 object-contain mix-blend-multiply" />
        <h1 className="text-4xl font-display font-extrabold text-stone-900 tracking-tight">SnapFox</h1>
      </div>

      {/* Header Panel */}
      <div className="bg-white/90 backdrop-blur-md px-6 sm:px-8 py-4 rounded-2xl border border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex flex-col justify-center">
            <h2 className="text-lg font-display font-semibold text-stone-900 tracking-tight leading-tight truncate">
              Connected to {remoteDevice || 'remote device'}
            </h2>
          </div>
        </div>
        <div className="flex items-center sm:justify-end gap-3 pt-4 sm:pt-0 border-t sm:border-0 border-stone-100 mt-2 sm:mt-0">
          <p className="text-xs font-bold tracking-widest text-stone-400 uppercase">Code:</p>
          <p className="text-xl font-display font-bold text-stone-900 tracking-wider">
            {roomId}
          </p>
        </div>
      </div>

      {/* Input Zone */}
      <TransferZone onSendText={onSendText} onSendFile={onSendFile} txProgress={txProgress} />

      {/* History Area */}
      {(messages.length > 0 || rxProgress > 0 || rxFile) && (
        <div className="bg-white p-8 md:p-10 rounded-2xl border border-stone-100/50">
          <div className="space-y-6">
            {rxProgress > 0 && rxProgress < 100 && (
              <div className="w-full bg-stone-100 p-6 rounded-2xl">
                <div className="flex justify-between text-sm font-bold tracking-widest text-accent uppercase mb-3">
                  <span>Receiving File</span>
                  <span>{rxProgress}%</span>
                </div>
                <div className="h-1.5 w-full bg-stone-200 rounded-full overflow-hidden">
                  <div className="h-full bg-accent transition-all duration-300" style={{ width: `${rxProgress}%` }} />
                </div>
              </div>
            )}

            {rxFile && (
              <div className="flex flex-row items-center justify-between p-6 rounded-2xl bg-[#FFF8F6] border border-orange-100 group transition-all gap-4">
                <span className="text-lg font-display font-bold text-stone-800 truncate pr-4">{rxFile.name}</span>
                <a
                  href={rxFile.url}
                  download={rxFile.name}
                  title="Download file"
                  className="w-12 h-12 bg-stone-900 text-white hover:bg-accent transition-colors rounded-full flex items-center justify-center shrink-0 shadow-sm"
                >
                  <DownloadSimple size={22} weight="bold" />
                </a>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className="relative p-6 rounded-2xl bg-stone-100 text-stone-800 font-medium text-lg leading-relaxed whitespace-pre-wrap pr-16">
                {m}
                <button
                  onClick={() => navigator.clipboard.writeText(m)}
                  className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-900 bg-white hover:bg-stone-50 rounded-xl shadow-sm transition-all"
                  title="Copy to clipboard"
                >
                  <Copy size={20} weight="bold" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
