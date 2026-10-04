import { useState } from 'react';
import { usePlayer } from '../context/PlayerContext.jsx';
import { songs, playlists, artists } from '../data/songs.js';
import { PlaylistCard } from '../components/PlaylistCard.jsx';
import { ArtistCard } from '../components/ArtistCard.jsx';
import { SongRow } from '../components/SongRow.jsx';
import { SongMenu } from '../components/SongMenu.jsx';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 6) return 'İyi geceler';
  if (hour < 12) return 'Günaydın';
  if (hour < 18) return 'İyi günler';
  return 'İyi akşamlar';
}

export function Home({ onOpenPlaylist }) {
  const player = usePlayer?.() ?? {};
  const allSongs = songs ?? [];
  const allPlaylists = [...(playlists ?? []), ...(player?.userPlaylists ?? [])];
  const allArtists = artists ?? [];
  const navigate = player?.navigate ?? player?.setView;
  const [menu, setMenu] = useState(null);
  const handleMenu = (song, e) => {
    const r = e?.currentTarget?.getBoundingClientRect?.();
    setMenu({ song, rect: r });
  };

  const heroItems = (allPlaylists?.length ? allPlaylists : allSongs)?.slice?.(0, 6) ?? [];

  const playByIds = (songIds) => {
    const ids = (songIds ?? []).map((x) => (typeof x === 'object' ? x?.id : x));
    // context playPlaylist expects an array of ids
    if (ids.length) player?.playPlaylist?.(ids);
  };

  const openPlaylist = (id) => {
    if (onOpenPlaylist) onOpenPlaylist(id);
    else navigate?.({ type: 'playlist', playlistId: id });
  };

  const goSearch = () => navigate?.({ type: 'search' });

  const playFirstPlaylist = () => {
    const first = allPlaylists?.[0];
    if (first?.songIds?.length) playByIds(first.songIds);
    else if (allSongs?.length) playByIds([allSongs[0]?.id]);
  };

  const recentSongs = (player?.recentlyPlayed ?? [])
    .map((id) => (allSongs ?? []).find((s) => s?.id === id))
    .filter(Boolean)
    .slice(0, 8);

  return (
    <div className="p-6 space-y-8">
      <section>
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-3xl font-bold">{getGreeting()}</h1>
          <button
            onClick={playFirstPlaylist}
            aria-label="Çalmaya başla"
            className="w-12 h-12 rounded-full bg-[#1DB954] text-black grid place-items-center hover:scale-105 transition"
          >
            ▶
          </button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {heroItems.map((item, i) => {
            const isPlaylist = Boolean(item?.songIds);
            const title = item?.name ?? item?.title ?? '—';
            const img = item?.cover ?? item?.image ?? item?.img ?? null;
            const songIds = item?.songIds ?? (item?.id ? [item.id] : []);
            const gradients = [
              'from-[#5038a8]',
              'from-[#1e3264]',
              'from-[#8d67ab]',
              'from-[#e8115b]',
              'from-[#148a08]',
              'from-[#477d95]',
            ];
            return (
              <button
                key={item?.id ?? i}
                onClick={() =>
                  isPlaylist ? openPlaylist(item?.id) : playByIds(songIds)
                }
                className={`flex items-center gap-3 bg-gradient-to-r ${gradients[i % gradients.length]} to-[#282828] rounded-lg overflow-hidden hover:bg-white/10 transition cursor-pointer text-left`}
              >
                {img ? (
                  <img src={img} alt="" className="w-16 h-16 object-cover shrink-0" />
                ) : (
                  <div className="w-16 h-16 shrink-0 bg-white/20 flex items-center justify-center text-xl">
                    🎵
                  </div>
                )}
                <span className="font-semibold text-sm truncate pr-2">{title}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Sana özel</h2>
          <span onClick={goSearch} className="text-xs text-[#B3B3B3] hover:text-white cursor-pointer">Tümünü göster</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-5">
          {(allPlaylists ?? []).map((pl) => (
            <PlaylistCard
              key={pl?.id}
              playlist={pl}
              onOpen={() => openPlaylist(pl?.id)}
              onPlay={() => playByIds(pl?.songIds ?? [])}
            />
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Popüler sanatçılar</h2>
          <span onClick={goSearch} className="text-xs text-[#B3B3B3] hover:text-white cursor-pointer">Tümünü göster</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-5">
          {(allArtists ?? []).map((a) => (
            <ArtistCard key={a?.id} artist={a} onOpen={(id) => (player?.navigate ?? player?.setView)?.({ type: 'artist', artistId: id })} />
          ))}
        </div>
      </section>

      {(recentSongs?.length ?? 0) > 0 ? (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Son çalınanlar</h2>
            <span onClick={goSearch} className="text-xs text-[#B3B3B3] hover:text-white cursor-pointer">Tümünü göster</span>
          </div>
          <div className="flex flex-col">
            {recentSongs.map((s) => (
              <SongRow key={s?.id} song={s} onMenu={handleMenu} />
            ))}
          </div>
        </section>
      ) : (
        <section>
          <h2 className="text-2xl font-bold mb-4">Son çalınanlar</h2>
          <button
            onClick={() => allSongs?.length && playByIds([allSongs[0]?.id])}
            className="w-full text-left p-6 rounded-lg bg-white/5 hover:bg-white/10 transition cursor-pointer"
          >
            <p className="font-bold text-lg">Hemen dinlemeye başla</p>
            <p className="text-sm text-neutral-400 mt-1">İlk şarkıyı çalmak için dokun</p>
          </button>
        </section>
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
      <footer className="mt-10 pb-6 text-center text-[11px] text-neutral-500">SpotiKlon — eğitim amaçlı demo • Telifli içerik yok</footer>
    </div>
  );
}
