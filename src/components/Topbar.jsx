import { useState } from 'react';
import { usePlayer } from '../context/PlayerContext.jsx';
import { ShortcutsHelp } from './ShortcutsHelp.jsx';

export function Topbar({ showSearch, onOpenQueue, onOpenFull }) {
  const [showHelp, setShowHelp] = useState(false);
  const player = usePlayer();
  const searchQuery = player?.searchQuery ?? '';
  const setSearchQuery = player?.setSearchQuery;
  const visibleSearch = showSearch ?? player?.view?.type === 'search';

  return (
    <header className="sticky top-0 bg-black/60 backdrop-blur z-10 flex items-center gap-4 px-4 py-3 border-b border-white/5">
      <div className="flex items-center gap-2">
        <button
          onClick={() => player?.goBack?.()}
          className="w-8 h-8 rounded-full bg-[#181818] text-[#B3B3B3] hover:text-white flex items-center justify-center"
          aria-label="Geri"
        >
          ‹
        </button>
        <button
          onClick={() => player?.goForward?.()}
          className="w-8 h-8 rounded-full bg-[#181818] text-[#B3B3B3] hover:text-white flex items-center justify-center"
          aria-label="İleri"
        >
          ›
        </button>
      </div>

      {visibleSearch ? (
        <div className="flex-1 max-w-md">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery?.(e.target.value)}
            placeholder="Şarkı, sanatçı veya albüm ara..."
            aria-label="Ara"
            className="w-full bg-[#282828] text-white text-sm rounded-full px-4 py-2 outline-none placeholder:text-[#B3B3B3] focus:ring-1 focus:ring-white"
          />
        </div>
      ) : (
        <div className="flex-1" />
      )}

      <div className="flex items-center gap-2">
        <button
          onClick={onOpenQueue}
          aria-label="Kuyruk"
          title="Sıradakiler"
          className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 hover:ring-1 hover:ring-white/20 flex items-center justify-center transition hover:scale-105"
        >
          📋
        </button>
        <button
          onClick={onOpenFull}
          aria-label="Tam ekran"
          title="Tam ekran aç"
          className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 hover:ring-1 hover:ring-white/20 flex items-center justify-center transition hover:scale-105"
        >
          ⛶
        </button>
        <button
          onClick={() => setShowHelp(true)}
          aria-label="Klavye kısayolları"
          title="Kısayollar"
          className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
        >
          ?
        </button>
        <div className="flex items-center gap-2 bg-white/5 hover:bg-white/10 rounded-full pl-1 pr-3 py-1 cursor-pointer transition">
          <div className="w-8 h-8 rounded-full bg-[#1DB954] flex items-center justify-center text-black font-bold">
            E
          </div>
          <span className="hidden sm:block text-white text-sm font-semibold">Efe Karaer</span>
        </div>
      </div>
      {showHelp && <ShortcutsHelp onClose={() => setShowHelp(false)} />}
    </header>
  );
}
