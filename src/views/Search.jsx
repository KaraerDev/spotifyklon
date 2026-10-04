import { useState } from 'react';
import { usePlayer } from '../context/PlayerContext.jsx';
import { songs, playlists, artists, genres } from '../data/songs.js';
import { SongRow } from '../components/SongRow.jsx';
import { PlaylistCard } from '../components/PlaylistCard.jsx';
import { SongMenu } from '../components/SongMenu.jsx';

export function Search() {
  const player = usePlayer?.() ?? {};
  const [menu, setMenu] = useState(null);
  const handleMenu = (song, e) => {
    const r = e?.currentTarget?.getBoundingClientRect?.();
    setMenu({ song, rect: r });
  };
  const [localQuery, setLocalQuery] = useState('');
  const query = (player?.searchQuery ?? localQuery ?? '').trim();
  const q = query.toLocaleLowerCase('tr-TR');

  const allSongs = songs ?? [];
  const allArtists = artists ?? [];
  const allPlaylists = [...(playlists ?? []), ...(player?.userPlaylists ?? [])];
  const allGenres = genres ?? [];

  const setQuery = (v) => {
    setLocalQuery(v);
    player?.setSearchQuery?.(v);
  };

  const openPlaylist = (id) => {
    (player?.navigate ?? player?.setView)?.({ type: 'playlist', playlistId: id });
  };

  if (!q) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Göz at</h1>
        <div className="mb-4 lg:hidden">
          <input
            value={localQuery}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ne dinlemek istiyorsun?"
            className="w-full bg-white rounded-full px-4 py-2 text-black text-sm outline-none"
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {allGenres.map((g, i) => (
            <div
              key={g?.id ?? g?.name ?? i}
              onClick={() => setQuery(g?.name ?? '')}
              role="button"
              className="relative h-24 rounded-lg overflow-hidden p-3 font-bold cursor-pointer hover:opacity-90 transition"
              style={{ backgroundColor: g?.color ?? '#5038a8' }}
            >
              <span>{g?.name ?? 'Tür'}</span>
            </div>
          ))}
          {(allGenres?.length ?? 0) === 0 && (
            <p className="text-neutral-400 text-sm">Tür bulunamadı.</p>
          )}
        </div>
      </div>
    );
  }

  const matchedSongs = (allSongs ?? []).filter(
    (s) =>
      (s?.title ?? '').toLocaleLowerCase('tr-TR').includes(q) ||
      (s?.artist ?? '').toLocaleLowerCase('tr-TR').includes(q)
  );
  const matchedArtists = (allArtists ?? []).filter((a) =>
    (a?.name ?? '').toLocaleLowerCase('tr-TR').includes(q)
  );
  const matchedPlaylists = (allPlaylists ?? []).filter((p) =>
    (p?.name ?? '').toLocaleLowerCase('tr-TR').includes(q)
  );

  return (
    <div className="p-6 space-y-8">
      <div className="mb-4 lg:hidden">
        <input
          value={localQuery}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ne dinlemek istiyorsun?"
          className="w-full bg-white rounded-full px-4 py-2 text-black text-sm outline-none"
        />
      </div>

      {matchedSongs?.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-3">Şarkılar</h2>
          <div className="flex flex-col">
            {matchedSongs.map((s) => (
              <SongRow key={s?.id} song={s} onMenu={handleMenu} />
            ))}
          </div>
        </section>
      )}

      {matchedArtists?.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-3">Sanatçılar</h2>
          <div className="flex flex-wrap gap-4">
            {matchedArtists.map((a) => (
              <div key={a?.id} className="flex items-center gap-3 bg-white/5 rounded-full pl-1 pr-4 py-1">
                {(a?.image ?? a?.cover) ? (
                  <img
                    src={a?.image ?? a?.cover}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    🎤
                  </div>
                )}
                <span className="font-semibold text-sm">{a?.name}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {matchedPlaylists?.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-3">Çalma listeleri</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
            {matchedPlaylists.map((p) => (
              <PlaylistCard
                key={p?.id}
                playlist={p}
                onOpen={() => openPlaylist(p?.id)}
              />
            ))}
          </div>
        </section>
      )}

      {matchedSongs?.length === 0 &&
        matchedArtists?.length === 0 &&
        matchedPlaylists?.length === 0 && (
          <p className="text-neutral-400">
            Sonuç bulunamadı — başka bir şey dene
          </p>
        )}
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
