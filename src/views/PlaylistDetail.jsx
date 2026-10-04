import { useState } from 'react';
import { usePlayer } from '../context/PlayerContext.jsx';
import { songs, playlists } from '../data/songs.js';
import { SongRow } from '../components/SongRow.jsx';
import { SongMenu } from '../components/SongMenu.jsx';

function formatTotal(seconds) {
  const total = Math.max(0, Math.round(Number(seconds) || 0));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function PlaylistDetail({ playlistId }) {
  const player = usePlayer?.() ?? {};
  const [menu, setMenu] = useState(null);
  const handleMenu = (song, e) => {
    const r = e?.currentTarget?.getBoundingClientRect?.();
    setMenu({ song, rect: r });
  };
  const allSongs = songs ?? [];
  const allPlaylists = [...(playlists ?? []), ...(player?.userPlaylists ?? [])];
  const playlist = (allPlaylists ?? []).find((p) => p?.id === playlistId);

  if (!playlist) {
    return <div className="p-6 text-neutral-400">Çalma listesi bulunamadı.</div>;
  }

  const list = (playlist?.songIds ?? [])
    .map((id) => (allSongs ?? []).find((s) => s?.id === id))
    .filter(Boolean);

  const totalSec = list.reduce(
    (acc, s) => acc + (Number(s?.durationSec) || 0),
    0
  );

  const cover = playlist?.cover ?? playlist?.image ?? playlist?.img ?? null;
  const isUserPlaylist = (player?.userPlaylists ?? []).some((p) => p?.id === playlist?.id);

  const handleDelete = () => {
    player?.deletePlaylist?.(playlist?.id);
    (player?.navigate ?? player?.setView)?.({ type: 'home' });
  };

  const handleRename = () => {
    const next = prompt('Yeni çalma listesi adı:', playlist?.name ?? '');
    if (next && next.trim()) player?.renamePlaylist?.(playlist?.id, next.trim());
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-end mb-6">
        {cover ? (
          <img
            src={cover}
            alt=""
            className="w-52 h-52 rounded shadow-2xl object-cover"
          />
        ) : (
          <div className="w-52 h-52 rounded shadow-2xl bg-gradient-to-br from-[#5038a8] to-[#121212] flex items-center justify-center text-5xl">
            🎵
          </div>
        )}
        <div>
          <p className="text-sm text-neutral-300">Çalma listesi</p>
          <h1 className="text-4xl font-bold mt-1">{playlist?.name ?? '—'}</h1>
          {(playlist?.description ?? '') !== '' && (
            <p className="text-sm text-neutral-400 mt-2">{playlist.description}</p>
          )}
          <p className="text-sm text-neutral-400 mt-2">
            {formatTotal(totalSec)} • {list.length} şarkı
          </p>
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleRename}
              className="px-3 py-1 rounded-full border border-white/20 text-xs hover:bg-white/10 transition cursor-pointer"
            >
              ✏️ Adlandır
            </button>
            {isUserPlaylist && (
              <button
                onClick={handleDelete}
                className="px-3 py-1 rounded-full border border-white/20 text-xs hover:bg-white/10 transition cursor-pointer"
              >
                🗑 Sil
              </button>
            )}
          </div>
        </div>
      </div>

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
        {list.length === 0 && (
          <p className="text-neutral-400 text-sm">Bu çalma listesi boş.</p>
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
