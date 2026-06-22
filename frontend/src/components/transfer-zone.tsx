import { PaperPlaneRight, FileArrowUp } from "@phosphor-icons/react/dist/ssr";
import { useRef, useEffect } from "react";

interface Props {
  inputMsg: string;
  setInputMsg: (m: string) => void;
  onSendText: () => void;
  onSendFile: (f: File) => void;
  txProgress: number;
}

export function TransferZone({ inputMsg, setInputMsg, onSendText, onSendFile, txProgress }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) onSendFile(e.target.files[0]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSendText();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [inputMsg]);

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full">
      <div className="flex-1 bg-white p-6 md:p-8 rounded-2xl border border-stone-100/80 flex flex-col focus-within:border-stone-300 transition-all duration-300">
        <textarea
          ref={textareaRef}
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
          placeholder="Type a message..."
          className="w-full bg-transparent resize-none outline-none text-stone-800 text-lg flex-1 min-h-[120px] max-h-[300px] overflow-y-auto leading-relaxed"
          onKeyDown={handleKeyDown}
        />
        <div className="flex justify-between items-end mt-4">
          <p className="text-xs text-stone-400 font-medium tracking-wide hidden sm:block">Press Enter to send, Shift+Enter for new line</p>
          <button
            onClick={onSendText}
            disabled={!inputMsg.trim()}
            className="ml-auto px-6 py-2.5 bg-stone-900 hover:bg-accent disabled:bg-stone-100 disabled:text-stone-400 text-white font-bold tracking-wider uppercase text-sm transition-colors rounded-full flex items-center gap-2"
          >
            Send <PaperPlaneRight size={18} weight="bold" />
          </button>
        </div>
      </div>

      <div
        onClick={() => fileRef.current?.click()}
        className="md:w-80 bg-white hover:bg-[#FFF8F6] hover:border-accent group rounded-2xl border-2 border-dashed border-stone-200 p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 relative overflow-hidden"
      >
        <div className="w-16 h-16 rounded-full bg-stone-100 group-hover:bg-accent group-hover:text-white flex items-center justify-center mb-5 transition-colors duration-300 text-stone-600">
          <FileArrowUp size={32} weight="duotone" />
        </div>
        <h3 className="font-display font-bold text-2xl tracking-tight mb-2 text-stone-800">Share File</h3>
        <p className="text-sm font-medium text-stone-500 text-center">Click to browse your device</p>

        {txProgress > 0 && txProgress < 100 && (
          <div className="absolute bottom-0 left-0 w-full p-4 bg-white/95 backdrop-blur-sm border-t border-stone-100">
            <div className="flex justify-between text-xs font-bold tracking-widest text-accent uppercase mb-2">
              <span>Sending</span>
              <span>{txProgress}%</span>
            </div>
            <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
              <div className="h-full bg-accent transition-all duration-300" style={{ width: `${txProgress}%` }} />
            </div>
          </div>
        )}
        <input type="file" className="hidden" ref={fileRef} onChange={handleFileChange} />
      </div>
    </div>
  );
}
