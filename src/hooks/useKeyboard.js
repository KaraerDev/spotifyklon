import { useEffect, useRef } from 'react';
import { usePlayer } from '../context/PlayerContext.jsx';

function isEditableTarget(target) {
  if (!target) return false;
  const tag = (target.tagName || '').toUpperCase();
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
  if (target.isContentEditable) return true;
  return false;
}

export function useKeyboard({ onOpenFull } = {}) {
  const player = usePlayer?.() ?? {};

  const playerRef = useRef(player);
  const openFullRef = useRef(onOpenFull);

  useEffect(() => {
    playerRef.current = player;
  });

  useEffect(() => {
    openFullRef.current = onOpenFull;
  });

  useEffect(() => {
    const onKeyDown = (e) => {
      if (isEditableTarget(e.target)) return;

      const p = playerRef.current ?? {};
      const key = e.key;
      const currentTime = p?.currentTime ?? 0;
      const volume = p?.volume ?? 0.8;
      const currentSong = p?.currentSong ?? null;

      // Space: play/pause
      if (e.code === 'Space' || key === ' ' || key === 'Spacebar') {
        e.preventDefault();
        p?.togglePlay?.();
        return;
      }

      // ArrowRight: +10sn
      if (key === 'ArrowRight') {
        p?.seekTo?.((currentTime || 0) + 10);
        return;
      }

      // ArrowLeft: -10sn
      if (key === 'ArrowLeft') {
        p?.seekTo?.((currentTime || 0) - 10);
        return;
      }

      // ArrowUp / ArrowDown: ses +/-
      if (key === 'ArrowUp') {
        e.preventDefault();
        p?.setVolumeLevel?.(Math.min(1, (volume ?? 0.8) + 0.1));
        return;
      }
      if (key === 'ArrowDown') {
        e.preventDefault();
        p?.setVolumeLevel?.(Math.max(0, (volume ?? 0.8) - 0.1));
        return;
      }

      // M: mute
      if (key === 'm' || key === 'M') {
        p?.toggleMute?.();
        return;
      }

      // F: tam ekran aç
      if (key === 'f' || key === 'F') {
        openFullRef.current?.();
        return;
      }

      // L: beğen
      if (key === 'l' || key === 'L') {
        if (currentSong?.id != null) p?.toggleLike?.(currentSong.id);
        return;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);
}
