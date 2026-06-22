import { TransferZone } from "./transfer-zone";
import { DownloadSimple } from "@phosphor-icons/react/dist/ssr";

interface Props {
  roomId: string;
  messages: string[];
  rxFile: { url: string; name: string } | null;
  rxProgress: number;
  inputMsg: string;
  setInputMsg: (m: string) => void;
  onSendText: () => void;
  onSendFile: (f: File) => void;
  txProgress: number;
  remoteDevice?: string;
}

export function ActiveSharing({ roomId, messages, rxFile, rxProgress, inputMsg, setInputMsg, onSendText, onSendFile, txProgress, remoteDevice }: Props) {
  return (
    <div className="max-w-4xl mx-auto w-full px-6 flex flex-col gap-8 mt-12 mb-24">
      
      {/* Brand Header */}
      <div className="flex items-center justify-center gap-4">
        <img src="/logo.png" alt="SnapFox Logo" className="w-16 h-16 object-contain mix-blend-multiply" />
        <h1 className="text-4xl font-display font-extrabold text-stone-900 tracking-tight">SnapFox</h1>
      </div>

      {/* Header Panel */}
      <div className="bg-white/90 backdrop-blur-md px-8 py-4 rounded-2xl border border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-3 h-3 rounded-full bg-accent animate-pulse" />
          <div className="flex flex-col">
            <h2 className="text-lg font-display font-bold text-stone-900 tracking-tight leading-tight">
              Ready to Share
            </h2>
            <p className="text-xs text-stone-500 font-medium">Connected to {remoteDevice || 'remote device'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 sm:text-right">
          <p className="text-xs font-bold tracking-widest text-stone-400 uppercase">Code:</p>
          <p className="text-xl font-display font-bold text-stone-900 tracking-wider">
            {roomId}
          </p>
        </div>
      </div>

      {/* Input Zone */}
      <TransferZone inputMsg={inputMsg} setInputMsg={setInputMsg} onSendText={onSendText} onSendFile={onSendFile} txProgress={txProgress} />

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
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 rounded-2xl bg-[#FFF8F6] border border-orange-100 group transition-all">
                <span className="text-lg font-display font-bold text-stone-800 truncate pr-4 mb-4 sm:mb-0 max-w-full sm:max-w-[70%]">{rxFile.name}</span>
                <a 
                  href={rxFile.url} 
                  download={rxFile.name} 
                  className="px-6 py-2.5 bg-stone-900 text-white font-medium text-sm tracking-wider uppercase hover:bg-accent transition-colors rounded-full flex items-center gap-2 shrink-0"
                >
                  <DownloadSimple size={18} weight="bold" /> Download
                </a>
              </div>
            )}
            
            {messages.map((m, i) => (
              <div key={i} className="p-6 rounded-2xl bg-stone-100 text-stone-800 font-medium text-lg leading-relaxed whitespace-pre-wrap">
                {m}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
