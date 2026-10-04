export function ArtistCard({ artist, onOpen }) {
  const handleOpen = () => onOpen?.(artist?.id);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleOpen();
    }
  };

  return (
    <div
      onClick={handleOpen}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="bg-[#181818] p-4 rounded-lg hover:bg-[#282828] transition-all duration-300 cursor-pointer text-center group hover:scale-[1.02] hover:shadow-2xl"
    >
      <img
        src={artist?.image ?? artist?.cover ?? ''}
        alt={artist?.name ?? 'sanatçı'}
        loading="lazy"
        onError={(e) => {
          e.currentTarget.src = 'https://picsum.photos/seed/fallback/300/300';
        }}
        className="w-full aspect-square object-cover rounded-full bg-[#282828] mb-3 ring-2 ring-transparent hover:ring-[#1DB954] hover:scale-105 transition duration-300"
      />
      <p className="text-white font-semibold text-sm truncate">{artist?.name ?? 'Bilinmeyen Sanatçı'}</p>
      <p className="text-[#B3B3B3] text-xs mt-1">Sanatçı</p>
    </div>
  );
}
