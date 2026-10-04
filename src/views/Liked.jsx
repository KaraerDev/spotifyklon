import { useState } from 'react';
import { usePlayer } from '../context/PlayerContext.jsx';
import { songs } from '../data/songs.js';
import { SongRow } from '../components/SongRow.jsx';
import { SongMenu } from '../components/SongMenu.jsx';

export function Liked() {
  const player = usePlayer?.() ?? {};
  const [menu, setMenu] = useState(null);
  const handleMenu = (song, e) => {
    const r = e?.currentTarget?.getBoundingClientRect?.();
    setMenu({ song, rect: r });
  };
  const likedIds = player?.likedIds ?? [];
  const list = (songs ?? []).filter((s) => likedIds?.includes?.(s?.id));

  return (
    <div>
      <div className="bg-gradient-to-b from-[#5038a8] to-[#121212] p-6 flex items-end gap-6">
        <div className="w-52 h-52 rounded shadow-2xl bg-gradient-to-br from-[#5038a8] to-[#282828] flex items-center justify-center text-6xl shrink-0">
          💚
        </div>
        <div>
          <p className="text-sm">Çalma listesi</p>
          <h1 className="text-4xl font-bold mt-1">Beğenilen Şarkılar</h1>
          <p className="text-sm text-neutral-300 mt-2">{list.length} şarkı</p>
        </div>
      </div>

      <div className="p-6">
        {list.length === 0 ? (
          <p className="text-neutral-400">
            Beğendiğin şarkılar burada görünecek. Kalbe dokunarak kaydet.
          </p>
        ) : (
          <>
            <button
              onClick={() => list.length && player?.playPlaylist?.(list.map((s) => s?.id))}
              className="w-14 h-14 rounded-full bg-[#1DB954] text-black text-2xl font-bold flex items-center justify-center hover:scale-105 transition mb-6"
              aria-label="Oynat"
            >
              ▶
            </button>
            <div className="flex flex-col">
              {list.map((s) => (
                <SongRow key={s?.id} song={s} onMenu={handleMenu} />
              ))}
            </div>
          </>
        )}
      </div>
      {menu && (
        <SongMenu
          song={menu.song}
          anchorRect={menu.rect}
          onClose={() => setMenu(null)}
          onAddToQueue={(s) => {
            player?.addToQueue?.(s);
            setMenu(null);
          }}
          onAddToPlaylist={(pid, s) => {
            player?.togglePlaylistSong?.(pid, s?.id ?? s);
            setMenu(null);
          }}
          onToggleLike={(s) => player?.toggleLike?.(s?.id ?? s)}
          isLiked={player?.isLiked?.(menu.song.id)}
          playlists={[...(player?.playlists ?? []), ...(player?.userPlaylists ?? [])]}
          onGoArtist={(artistName) => {
            setMenu(null);
            player?.setSearchQuery?.(artistName);
            (player?.navigate ?? player?.setView)?.({ type: 'search' });
          }}
        />
      )}
    </div>
  );
}
