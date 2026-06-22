export function HeroHeader() {
  return (
    <div className="flex flex-col items-center text-center space-y-6 pt-16 pb-12 px-6">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 text-fox mb-2">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          className="w-8 h-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      </div>
      
      <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-stone-900 leading-tight">
        Share instantly.<br className="hidden md:block" />
        <span className="text-stone-400">Zero servers in between.</span>
      </h1>
      
      <p className="text-lg md:text-xl text-stone-600 max-w-xl mx-auto leading-relaxed">
        SnapFox connects your devices directly. Send photos, videos, and text notes 
        at blazing local speeds without ever uploading them to the cloud.
      </p>
    </div>
  );
}
