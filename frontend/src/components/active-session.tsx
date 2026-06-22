import QRCode from "react-qr-code";
import { TransferZone } from "./transfer-zone";
import { CheckCircle, ShieldCheck, DownloadSimple } from "@phosphor-icons/react/dist/ssr";

interface Props {
  roomId: string;
  isInitiator: boolean;
  status: string;
  messages: string[];
  rxFile: { url: string; name: string } | null;
  rxProgress: number;
  inputMsg: string;
  setInputMsg: (m: string) => void;
  onSendText: () => void;
  onSendFile: (f: File) => void;
  txProgress: number;
}

export function ActiveSession({ roomId, isInitiator, status, messages, rxFile, rxProgress, inputMsg, setInputMsg, onSendText, onSendFile, txProgress }: Props) {
  const isConnected = status === "connected";

  return (
    <div className="max-w-2xl mx-auto w-full px-6 flex flex-col gap-6 mt-8">
      {/* Status Header */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-stone-100">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
          <span className="font-medium text-stone-900">
            {isConnected ? "Ready to share" : "Waiting for connection..."}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg">
          <ShieldCheck size={16} weight="fill" />
          End-to-End Encrypted
        </div>
      </div>

      {!isConnected && isInitiator && (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100 flex flex-col items-center text-center">
          <h2 className="text-xl font-bold text-stone-900 mb-2">Scan to connect</h2>
          <p className="text-stone-500 mb-6 text-sm">Point a camera at this code to instantly pair.</p>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-100 inline-block mb-6">
            <QRCode value={`http://localhost:3000/?room=${roomId}`} size={160} />
          </div>
          <div className="text-sm text-stone-500">
            Or use code: <span className="font-bold text-stone-900 tracking-wider bg-stone-100 px-2 py-1 rounded">{roomId}</span>
          </div>
        </div>
      )}

      {isConnected && (
        <div className="flex flex-col gap-6">
          <TransferZone inputMsg={inputMsg} setInputMsg={setInputMsg} onSendText={onSendText} onSendFile={onSendFile} txProgress={txProgress} />

          {/* History Area */}
          {(messages.length > 0 || rxProgress > 0 || rxFile) && (
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100">
              <h3 className="font-bold text-stone-900 mb-4 flex items-center gap-2">
                <CheckCircle className="text-emerald-500" weight="fill" size={20} /> Received Items
              </h3>
              
              <div className="space-y-3">
                {rxProgress > 0 && rxProgress < 100 && (
                  <div className="text-sm text-stone-600 font-medium">Receiving file... {rxProgress}%</div>
                )}
                {rxFile && (
                  <a href={rxFile.url} download={rxFile.name} className="flex items-center gap-3 p-3 bg-stone-50 hover:bg-stone-100 rounded-xl transition-colors group">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-stone-700 shadow-sm group-hover:text-fox transition-colors">
                      <DownloadSimple size={20} weight="bold" />
                    </div>
                    <span className="font-medium text-stone-900 truncate">{rxFile.name}</span>
                  </a>
                )}
                {messages.map((m, i) => (
                  <div key={i} className="p-3 bg-stone-50 rounded-xl text-stone-700 text-sm">
                    {m}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
