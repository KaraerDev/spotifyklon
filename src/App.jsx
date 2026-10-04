import { useEffect, useState } from 'react';
import { PlayerProvider, usePlayer } from './context/PlayerContext.jsx';
import { Sidebar } from './components/Sidebar.jsx';
import { Topbar } from './components/Topbar.jsx';
import { Player } from './components/Player.jsx';
import { FullPlayer } from './components/FullPlayer.jsx';
import { QueuePanel } from './components/QueuePanel.jsx';
import { useKeyboard } from './hooks/useKeyboard.js';
import { Home } from './views/Home.jsx';
import { Search } from './views/Search.jsx';
import { PlaylistDetail } from './views/PlaylistDetail.jsx';
import { Liked } from './views/Liked.jsx';
import { ArtistDetail } from './views/ArtistDetail.jsx';
import './index.css';

function AppInner() {
  const player = usePlayer?.() ?? {};
  const view = player?.view ?? { type: 'home' };
  const go = (v) => (player?.navigate ?? player?.setView)?.(v);
  const [showFull, setShowFull] = useState(false);
  const [showQueue, setShowQueue] = useState(false);

  try {
    useKeyboard({ onOpenFull: () => setShowFull(true) });
  } catch {
    /* keyboard hook yoksa atla */
  }

  useEffect(() => {
    const open = () => setShowFull(true);
    const openQueue = () => setShowQueue(true);
    window.addEventListener('spotiklon:open-full', open);
    window.addEventListener('spotiklon:open-queue', openQueue);
    return () => {
      window.removeEventListener('spotiklon:open-full', open);
      window.removeEventListener('spotiklon:open-queue', openQueue);
    };
  }, []);

  return (
    <div className="h-screen bg-[#121212] text-white flex flex-col overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar onOpenQueue={() => setShowQueue((v) => !v)} onOpenFull={() => setShowFull(true)} />
          <main className="flex-1 overflow-y-auto pb-[150px] lg:pb-0">
            {view?.type === 'search' ? (
              <Search />
            ) : view?.type === 'playlist' ? (
              <PlaylistDetail playlistId={view?.playlistId} />
            ) : view?.type === 'liked' ? (
              <Liked />
            ) : view?.type === 'artist' ? (
              <ArtistDetail artistId={view?.artistId} />
            ) : (
              <Home onOpenPlaylist={(id) => go({ type: 'playlist', playlistId: id })} />
            )}
          </main>
        </div>
      </div>

      <Player />

      {showFull ? <FullPlayer onClose={() => setShowFull(false)} /> : null}

      {showQueue ? (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-30"
            onClick={() => setShowQueue(false)}
            aria-hidden="true"
          />
          <div className="fixed right-0 top-0 bottom-[90px] w-full sm:w-80 bg-[#181818] z-40 p-4 overflow-y-auto animate-fadeIn">
          <button
            onClick={() => setShowQueue(false)}
            className="mb-3 px-3 py-1.5 rounded-full bg-white/10 text-white text-sm hover:bg-white/20 transition"
            aria-label="Kuyruğu kapat"
          >
            ✕ Kapat
          </button>
          <QueuePanel />
          </div>
        </>
      ) : null}

      <nav className="lg:hidden fixed bottom-[90px] left-0 right-0 flex justify-around bg-[#181818] border-t border-white/10 py-2 z-40">
        <button onClick={() => go({ type: 'home' })} className="text-xs font-semibold px-4 py-2">
          Ana Sayfa
        </button>
        <button onClick={() => go({ type: 'search' })} className="text-xs font-semibold px-4 py-2">
          Ara
        </button>
        <button onClick={() => go({ type: 'liked' })} className="text-xs font-semibold px-4 py-2">
          Beğenilen
        </button>
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <PlayerProvider>
      <AppInner />
    </PlayerProvider>
  );
}
