import QRCode from "react-qr-code";

interface Props {
  url: string;
  roomId: string;
}

export function QrTicket({ url, roomId }: Props) {
  return (
    <div className="relative bg-white p-8 pb-10 rounded-2xl border border-stone-100/50 max-w-sm mx-auto flex flex-col items-center">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-1.5 bg-stone-100 rounded-b-full" />
      
      <div className="bg-white p-4 rounded-xl border border-stone-50 mb-8">
        <QRCode 
          value={url} 
          size={220} 
          fgColor="#1C1917" 
          bgColor="#FFFFFF"
          level="L"
        />
      </div>

      <div className="w-full border-t-2 border-dashed border-stone-300 relative mb-8">
        <div className="absolute -left-10 -top-4 w-8 h-8 bg-stone-200 rounded-full" />
        <div className="absolute -right-10 -top-4 w-8 h-8 bg-stone-200 rounded-full" />
      </div>

      <div className="text-center w-full">
        <p className="text-sm text-stone-500 font-medium mb-1 uppercase tracking-widest">Connection Code</p>
        <p className="text-3xl font-display font-bold text-stone-900 tracking-wider">
          {roomId}
        </p>
      </div>
    </div>
  );
}
