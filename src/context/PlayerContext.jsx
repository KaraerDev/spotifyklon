import { createContext, useContext, useRef, useState, useEffect, useMemo } from 'react';
import { songs, playlists } from '../data/songs.js';

export const PlayerContext = createContext(null);

function readLS(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return fallback;
    const parsed = JSON.parse(raw);
    if (Array.isArray(fallback)) {
      return Array.isArray(parsed) ? parsed : fallback;
    }
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function writeLS(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore quota / private mode errors
  }
}

export function formatTime(s) {
  if (s == null || isNaN(s) || !isFinite(s)) return '0:00';
  const sec = Math.max(0, Math.floor(s));
  const m = Math.floor(sec / 60);
  const r = sec % 60;
  return `${m}:${String(r).padStart(2, '0')}`;
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider');
  return ctx;
}

const HOME_VIEW = { type: 'home' };

export function PlayerProvider({ children }) {
  const audioRef = useRef(null);

  const [currentSong, setCurrentSong] = useState(null);
  const [queue, setQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(() => {
    const v = readLS('spotify_volume', 0.8);
    return typeof v === 'number' && isFinite(v) ? Math.max(0, Math.min(1, v)) : 0.8;
  });
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off');
  const [likedIds, setLikedIds] = useState(() => readLS('spotify_likes', []));
  const [userPlaylists, setUserPlaylists] = useState(() => readLS('spotify_user_playlists', []));
  const [recentlyPlayed, setRecentlyPlayed] = useState(() => readLS('spotify_recent', []));
  const [view, setView] = useState(HOME_VIEW);
  const [searchQuery, setSearchQuery] = useState('');
  const [history, setHistory] = useState({ stack: [HOME_VIEW], index: 0 });

  // Keep latest values for event listeners without re-subscribing
  const stateRef = useRef({});
  stateRef.current = { queue, queueIndex, repeatMode, isShuffled };

  // Create audio element once (StrictMode-safe: cleanup pauses + clears src)
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.src = '';
      if (audioRef.current === audio) {
        audioRef.current = null;
      }
    };
  }, []);

  // Sync volume / mute to audio element
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
    audio.muted = isMuted;
  }, [volume, isMuted]);

  // Persist to localStorage on every change
  useEffect(() => { writeLS('spotify_volume', volume); }, [volume]);
  useEffect(() => { writeLS('spotify_likes', likedIds); }, [likedIds]);
  useEffect(() => { writeLS('spotify_user_playlists', userPlaylists); }, [userPlaylists]);
  useEffect(() => { writeLS('spotify_recent', recentlyPlayed); }, [recentlyPlayed]);

  function playAt(index) {
    const audio = audioRef.current;
    const q = stateRef.current.queue?.length ? stateRef.current.queue : queue;
    if (!q.length) return;
    const ni = ((index % q.length) + q.length) % q.length;
    const song = q[ni];
    setQueueIndex(ni);
    setCurrentSong(song);
    setCurrentTime(0);
    if (audio) {
      audio.src = song.audioUrl;
      audio.play().catch(() => {});
    }
    setIsPlaying(true);
    setRecentlyPlayed((prev) => [song.id, ...prev.filter((id) => id !== song.id)].slice(0, 8));
  }

  // Single queue-advance helper: shuffle picks an index different from current.
  // Reads from stateRef so it is safe to call from event listeners.
  function playNext() {
    const { queue: q, queueIndex: qi, repeatMode: rm, isShuffled: sh } = stateRef.current;
    const audio = audioRef.current;
    if (!q || q.length === 0) {
      if (rm === 'all' && audio && audio.src) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
        setIsPlaying(true);
        return;
      }
      setIsPlaying(false);
      return;
    }
    let ni;
    if (sh) {
      if (q.length === 1) {
        ni = 0;
      } else {
        ni = qi;
        let guard = 0;
        while (ni === qi && guard < 20) {
          ni = Math.floor(Math.random() * q.length);
          guard += 1;
        }
        if (ni === qi) ni = (qi + 1) % q.length;
      }
    } else {
      ni = qi + 1;
      if (ni >= q.length) {
        if (rm === 'all') {
          ni = 0;
        } else {
          setIsPlaying(false);
          if (audio) audio.pause();
          return;
        }
      }
    }
    const nextSong = q[ni];
    setQueueIndex(ni);
    setCurrentSong(nextSong);
    setCurrentTime(0);
    if (audio) {
      audio.src = nextSong.audioUrl;
      audio.play().catch(() => {});
    }
    setIsPlaying(true);
    setRecentlyPlayed((prev) => {
      const next = [nextSong.id, ...prev.filter((id) => id !== nextSong.id)].slice(0, 8);
      return next;
    });
  }

  // Audio event listeners (single subscription)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime || 0);
    const onLoadedMetadata = () => setDuration(audio.duration || 0);
    const onError = () => {
      console.warn('Audio playback error', audio.src);
      setIsPlaying(false);
      setCurrentTime(0);
    };
    const onEnded = () => {
      const { repeatMode: rm } = stateRef.current;
      if (rm === 'one') {
        audio.currentTime = 0;
        audio.play().catch(() => {});
        return;
      }
      playNext();
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function playSong(song, queueList = songs) {
    if (!song) return;
    const audio = audioRef.current;
    const list = Array.isArray(queueList) && queueList.length > 0 ? queueList : [song];
    let idx = list.findIndex((s) => s.id === song.id);
    if (idx < 0) idx = 0;
    setQueue(list);
    setQueueIndex(idx);
    setCurrentSong(list[idx]);
    setCurrentTime(0);
    if (audio) {
      audio.src = list[idx].audioUrl;
      audio.play().catch(() => {});
    }
    setIsPlaying(true);
    setRecentlyPlayed((prev) => [list[idx].id, ...prev.filter((id) => id !== list[idx].id)].slice(0, 8));
  }

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (!currentSong) {
      if (queue.length > 0) {
        playSong(queue[queueIndex] || queue[0], queue);
      } else {
        playSong(songs[0], songs);
      }
      return;
    }
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => {});
      setIsPlaying(true);
    }
  }

  function next() {
    playNext();
  }

  function prev() {
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      setCurrentTime(0);
      return;
    }
    if (!queue.length) return;
    if (queueIndex - 1 < 0) {
      if (audio) {
        audio.currentTime = 0;
        setCurrentTime(0);
      }
      return;
    }
    playAt(queueIndex - 1);
  }

  function seekTo(sec) {
    const audio = audioRef.current;
    if (!audio) return;
    const clamped = Math.max(0, Math.min(sec, audio.duration || sec));
    audio.currentTime = clamped;
    setCurrentTime(clamped);
  }

  function setVolumeLevel(v) {
    const n = Number(v);
    if (!isFinite(n)) return;
    const clamped = Math.max(0, Math.min(1, n));
    setVolume(clamped);
    if (clamped > 0 && isMuted) setIsMuted(false);
  }

  function toggleMute() {
    setIsMuted((m) => !m);
  }

  function toggleShuffle() {
    setIsShuffled((s) => !s);
  }

  function cycleRepeat() {
    setRepeatMode((m) => (m === 'off' ? 'all' : m === 'all' ? 'one' : 'off'));
  }

  function toggleLike(id) {
    setLikedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function isLiked(id) {
    return likedIds.includes(id);
  }

  function createPlaylist(name) {
    const trimmed = (name || '').trim();
    if (!trimmed) return null;
    const pl = { id: Date.now(), name: trimmed, songIds: [] };
    setUserPlaylists((prev) => [...prev, pl]);
    return pl;
  }

  function deletePlaylist(id) {
    setUserPlaylists((prev) => prev.filter((pl) => String(pl.id) !== String(id)));
  }

  function renamePlaylist(id, newName) {
    const trimmed = (newName || '').trim();
    if (!trimmed) return;
    setUserPlaylists((prev) =>
      prev.map((pl) => (String(pl.id) === String(id) ? { ...pl, name: trimmed } : pl))
    );
  }

  function addToQueue(song) {
    if (!song) return;
    setQueue((prev) => [...prev, song]);
  }

  function removeFromQueue(songId) {
    const idx = queue.findIndex((s) => String(s.id) === String(songId));
    if (idx < 0) return;
    const nextQ = queue.filter((_, i) => i !== idx);
    setQueue(nextQ);
    if (idx < queueIndex) {
      setQueueIndex(queueIndex - 1);
    } else if (idx === queueIndex && queueIndex >= nextQ.length) {
      setQueueIndex(Math.max(0, nextQ.length - 1));
    }
  }

  function togglePlaylistSong(playlistId, songId) {
    setUserPlaylists((prev) =>
      prev.map((pl) => {
        if (String(pl.id) !== String(playlistId)) return pl;
        const has = pl.songIds.includes(songId);
        return { ...pl, songIds: has ? pl.songIds.filter((id) => id !== songId) : [...pl.songIds, songId] };
      })
    );
  }

  function songsByIds(ids) {
    return ids.map((id) => songs.find((s) => s.id === id)).filter(Boolean);
  }

  function playPlaylist(songIds) {
    const list = songsByIds(songIds);
    if (list.length === 0) return;
    playSong(list[0], list);
  }

  function playLiked() {
    const list = songsByIds(likedIds);
    if (list.length === 0) return;
    playSong(list[0], list);
  }

  function navigate(viewObj) {
    if (!viewObj) return;
    setView(viewObj);
    setHistory((prev) => {
      const sliced = prev.stack.slice(0, prev.index + 1);
      sliced.push(viewObj);
      return { stack: sliced, index: sliced.length - 1 };
    });
  }

  function goBack() {
    if (history.index <= 0) return;
    const ni = history.index - 1;
    setView(history.stack[ni]);
    setHistory({ stack: history.stack, index: ni });
  }

  function goForward() {
    if (history.index >= history.stack.length - 1) return;
    const ni = history.index + 1;
    setView(history.stack[ni]);
    setHistory({ stack: history.stack, index: ni });
  }

  const canGoBack = history.index > 0;
  const canGoForward = history.index < history.stack.length - 1;

  const value = useMemo(() => ({
    currentSong,
    queue,
    queueIndex,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffled,
    repeatMode,
    likedIds,
    userPlaylists,
    recentlyPlayed,
    view,
    searchQuery,
    history,
    canGoBack,
    canGoForward,
    audioRef,
    songs,
    playlists,
    playSong,
    togglePlay,
    next,
    playNext,
    prev,
    seekTo,
    setVolumeLevel,
    toggleMute,
    toggleShuffle,
    cycleRepeat,
    toggleLike,
    isLiked,
    createPlaylist,
    deletePlaylist,
    renamePlaylist,
    addToQueue,
    removeFromQueue,
    togglePlaylistSong,
    playPlaylist,
    playLiked,
    navigate,
    goBack,
    goForward,
    setView,
    setSearchQuery,
    formatTime,
  }), [currentSong, queue, queueIndex, isPlaying, currentTime, duration, volume, isMuted, isShuffled, repeatMode, likedIds, userPlaylists, recentlyPlayed, view, searchQuery, history, canGoBack, canGoForward, playSong, togglePlay, next, playNext, prev, seekTo, setVolumeLevel, toggleMute, toggleShuffle, cycleRepeat, toggleLike, isLiked, createPlaylist, deletePlaylist, renamePlaylist, addToQueue, removeFromQueue, togglePlaylistSong, playPlaylist, playLiked, navigate, goBack, goForward, setView, setSearchQuery]);

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}
