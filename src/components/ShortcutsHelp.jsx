import { useEffect } from 'react';

const SHORTCUTS = [
  ['Space', 'oynat / duraklat'],
  ['→', '+10 sn'],
  ['←', '-10 sn'],
  ['↑ / ↓', 'ses aç / kıs'],
  ['M', 'sessiz'],
  ['F', 'tam ekran'],
  ['L', 'beğen'],
  ['Esc', 'kapat'],
];

export function ShortcutsHelp({ onClose }) {
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose?.();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 grid place-items-center"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Klavye kısayolları"
        className="bg-[#181818] rounded-xl p-6 w-80"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-white text-lg font-bold mb-4">Klavye kısayolları</h2>
        <ul className="space-y-2 mb-5">
          {SHORTCUTS.map(([key, desc]) => (
            <li key={key} className="flex items-center justify-between text-sm">
              <kbd className="bg-white/10 text-white rounded px-2 py-1 font-mono text-xs">
                {key}
              </kbd>
              <span className="text-[#B3B3B3]">{desc}</span>
            </li>
          ))}
        </ul>
        <button
          onClick={onClose}
          className="w-full bg-white text-black text-sm font-bold rounded-full py-2 hover:scale-[1.02] transition"
        >
          Kapat
        </button>
      </div>
    </div>
  );
}
