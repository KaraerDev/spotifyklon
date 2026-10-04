export function PlaylistCard({ playlist, songCount, onOpen, onPlay }) {
  const count = songCount ?? playlist?.songIds?.length ?? playlist?.songs?.length ?? playlist?.songCount ?? 0;

  const handleOpen = () => onOpen?.(playlist?.id);
  const handlePlay = (e) => {
    e.stopPropagation();
    if (onPlay) {
      onPlay?.(playlist?.songIds);
    } else {
      onOpen?.(playlist?.id);
    }
  };

  return (
    <div
      onClick={handleOpen}
      className="bg-[#181818] p-4 rounded-lg hover:bg-[#282828] hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 cursor-pointer group relative"
    >
      <div className="relative mb-3">
        <img
          src={playlist?.cover ?? playlist?.image ?? ''}
          alt={playlist?.name ?? 'çalma listesi'}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = 'https://picsum.photos/seed/fallback/300/300';
          }}
          className="w-full aspect-square object-cover rounded-xl shadow-lg bg-[#282828]"
        />
        <button
          onClick={handlePlay}
          aria-label="Oynat"
          className="absolute bottom-2 right-2 w-11 h-11 rounded-full bg-[#1DB954] text-black flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition hover:scale-105"
        >
          ▶
        </button>
      </div>
      <p className="text-white font-semibold text-sm truncate">{playlist?.name ?? 'İsimsiz çalma listesi'}</p>
      <p className="text-[#B3B3B3] text-xs mt-1 line-clamp-2 min-h-[2rem]">
        {playlist?.description ?? `${count} şarkı`}
      </p>
    </div>
  );
}
