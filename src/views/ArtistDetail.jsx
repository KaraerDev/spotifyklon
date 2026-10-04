import { usePlayer } from '../context/PlayerContext.jsx';
import { songs, artists } from '../data/songs.js';
import { SongRow } from '../components/SongRow.jsx';

export function ArtistDetail({ artistId }) {
  const player = usePlayer?.() ?? {};
  const q = String(artistId ?? '').toLocaleLowerCase('tr-TR').trim();

  const artist = (artists ?? []).find(
    (a) =>
      String(a?.id ?? '').toLocaleLowerCase('tr-TR') === q ||
      String(a?.name ?? '').toLocaleLowerCase('tr-TR') === q
  );

  if (!artist) {
    return <div className="p-6 text-neutral-400">Sanatçı bulunamadı.</div>;
  }

  const artistName = String(artist?.name ?? '').toLocaleLowerCase('tr-TR');
  const list = (songs ?? []).filter(
    (s) => String(s?.artist ?? '').toLocaleLowerCase('tr-TR') === artistName
  );

  const cover = artist?.cover ?? artist?.image ?? artist?.img ?? null;

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-end mb-6">
        {cover ? (
          <img
            src={cover}
            alt=""
            className="w-52 h-52 rounded-full object-cover shadow-2xl"
          />
        ) : (
          <div className="w-52 h-52 rounded-full bg-white/10 flex items-center justify-center text-5xl">
            🎤
          </div>
        )}
        <div>
          <p className="text-sm text-neutral-300">Sanatçı</p>
          <h1 className="text-4xl font-bold mt-1">{artist?.name}</h1>
          {artist?.monthlyListeners && (
            <p className="text-sm text-neutral-400 mt-2">{artist.monthlyListeners}</p>
          )}
        </div>
      </div>

      <button
        onClick={() => list.length && player?.playPlaylist?.(list.map((s) => s?.id))}
        className="px-6 py-3 rounded-full bg-[#1DB954] text-black font-bold hover:scale-105 transition mb-6 cursor-pointer"
      >
        ▶ Çal
      </button>

      <div className="flex flex-col">
        {list.map((s) => (
          <SongRow key={s?.id} song={s} />
        ))}
        {list.length === 0 && (
          <p className="text-neutral-400 text-sm">Bu sanatçının şarkısı yok.</p>
        )}
      </div>
    </div>
  );
}
