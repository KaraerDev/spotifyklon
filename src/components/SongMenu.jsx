export function SongMenu({
  song,
  anchorRect,
  onClose,
  onAddToPlaylist,
  onAddToQueue,
  onToggleLike,
  isLiked,
  playlists,
}) {
  const menuStyle = anchorRect
    ? {
        top: (anchorRect.bottom ?? 0) + 8,
        left: Math.max(
          8,
          Math.min(anchorRect.left ?? 8, (typeof window !== 'undefined' ? window.innerWidth : 1024) - 240)
        ),
      }
    : { bottom: 96, right: 16 };

  const itemCls =
    'w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10 transition truncate';

  return (
    <>
      <div className="fixed inset-0 z-40 bg-transparent" onClick={onClose} />
      <div
        style={menuStyle}
        className="fixed z-50 w-56 bg-[#282828] rounded-lg shadow-2xl py-2 animate-fadeIn"
        role="menu"
      >
        <p className="px-4 py-2 text-xs text-[#B3B3B3] truncate border-b border-white/10">
          {song?.title ?? 'Şarkı'}
        </p>
        <button
          role="menuitem"
          onClick={() => {
            onToggleLike?.(song);
            onClose?.();
          }}
          className={itemCls}
        >
          {isLiked ? 'Beğenmekten vazgeç' : 'Beğen'}
        </button>
        <button
          role="menuitem"
          onClick={() => {
            onAddToQueue?.(song);
            onClose?.();
          }}
          className={itemCls}
        >
          Kuyruğa ekle
        </button>
        <div className="border-t border-white/10 mt-1 pt-1">
          <p className="px-4 py-1 text-xs text-[#B3B3B3]">Çalma listesine ekle ›</p>
          {Array.isArray(playlists) && playlists.length > 0 ? (
            playlists.map((pl) => (
              <button
                key={pl?.id ?? pl?.name}
                role="menuitem"
                onClick={() => {
                  onAddToPlaylist?.(pl?.id, song);
                  onClose?.();
                }}
                className={itemCls}
              >
                {pl?.name ?? 'İsimsiz çalma listesi'}
              </button>
            ))
          ) : (
            <p className="px-4 py-1 text-xs text-[#6a6a6a]">Henüz çalma listen yok.</p>
          )}
        </div>
        <div className="border-t border-white/10 mt-1 pt-1">
          <button role="menuitem" onClick={() => onClose?.()} className={itemCls}>
            Sanatçıya git
          </button>
        </div>
      </div>
    </>
  );
}
