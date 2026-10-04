# Spotiklon — Türkçe Spotify Klonu

React 19 + Vite 8 + Tailwind CSS v4 ile yapılmış, tam fonksiyonel Türkçe Spotify klonu.

## Özellikler

- **Türkçe UI:** Tüm arayüz Türkçe (Ana Sayfa, Ara, Beğenilenler, Çalma Listeleri).
- **Full fonksiyonel player:** Oynat / duraklat, ileri / geri, seek bar, ses kontrolü, karıştır (shuffle) ve tekrar (repeat) modları.
- **Arama:** Şarkı, sanatçı ve albüm adında anlık filtreleme.
- **Beğeni (❤️):** Şarkı beğenme / beğenmekten vazgeçme, Beğenilenler sayfası.
- **Playlist oluşturma:** Kullanıcı kendi çalma listelerini oluşturur, şarkı ekler / çıkarır, liste siler.
- **Kalıcılık:** Beğeniler ve playlistler `localStorage`'da saklanır, sayfa yenilenince kaybolmaz.
- **Responsive:** Mobil + masaüstü uyumlu (kenar çubuğu / alt player mobilde uyum sağlar).
- **Veri:** 22 şarkı (gerçek isimler) + kapaklar için `picsum.photos`.

## Teknoloji

- **React 19** + **Vite 8** (dev server + build)
- **Tailwind CSS v4** (`@tailwindcss/vite` eklentisi ile)
- **Bun** ile kuruldu ve çalıştırıldı (npm kullanılmadı)
- Durum yönetimi: React Context (`PlayerContext`)

## Kurulum

Gereksinim: **Bun** (yüklü değilse [bun.sh](https://bun.sh) adresinden kurun). Node hiç yoksa önce:

```powershell
winget install OpenJS.NodeJS.LTS
```

```powershell
cd proj4
bun install
bun run dev      # geliştirme: http://localhost:5173
bun run build    # üretim derlemesi -> dist/
bun run preview  # build önizleme
```

> Not: `bun run dev` ve `bun run build` doğrulandı (build başarılı, dev HTTP 200).

## Demo Ses Notu

Şarkı sesleri demo amaçlıdır — **SoundHelix örnek MP3** dosyaları stream edilir:

- `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3` … `Song-16`
- Gerçek sanatçı kayıtları DEĞİLDİR; şarkı isimleri/sanatçılar vitrin amaçlıdır.
- İnternet yoksa ses çalmaz (UI yine de gezinilebilir).

## Klasör Yapısı

```
proj4/
├── index.html
├── vite.config.js
├── package.json          # scripts: dev / build / preview / lint
├── public/
│   ├── favicon.svg
│   └── icons.svg
└── src/
    ├── main.jsx          # giriş noktası
    ├── App.jsx           # route + layout (Sidebar + Topbar + Player)
    ├── index.css         # Tailwind v4 import + global stiller
    ├── App.css
    ├── assets/           # hero.png + vite/react svg
    ├── components/       # Sidebar, Topbar, Player, SongRow, ArtistCard, PlaylistCard
    ├── context/
    │   └── PlayerContext.jsx  # oynatıcı + beğeni + playlist + localStorage mantığı
    ├── data/
    │   └── songs.js      # 22 şarkı (isim, sanatçı, albüm, süre, cover, audioUrl)
    └── views/            # Home, Search, Liked, PlaylistDetail
```

## Yeni Özellikler

- **Tam ekran player:** `FullPlayer` bileşeni — büyük kapak, bulanık arka plan (`backdrop-blur` + kapak görseli), senkron şarkı sözleri görünümü. Alt player'daki kapak/şarkı adına veya genişlet butonuna tıklayınca açılır, `X` veya `Esc` ile kapanır.
- **Kuyruk paneli:** `QueuePanel` — sağ tarafta açılan "Sıradakiler" listesi. Mevcut şarkıyı gösterir, sonraki şarkılara tıklayıp doğrudan çalabilirsiniz. Kuyruk boşsa "Sırada şarkı yok" mesajı görünür.
- **Şarkı sözleri:** `src/data/lyrics.js` — 6 şarkıya özgün Türkçe söz (Sezen Aksu, Tarkan, Sertab Erener vb.). Sözler zaman etiketlidir (`[mm:ss]`) ve çalan süreye göre satır satır senkron vurgulanır; sözü olmayan şarkıda "Bu şarkı için söz bulunamadı" mesajı görünür.
- **Klavye kısayolları:**
  - `Space` — oynat / duraklat
  - `→` — 10 sn ileri sar, `←` — 10 sn geri sar
  - `↑` — ses aç, `↓` — ses kıs
  - `M` — sessize al / aç
  - `F` — tam ekran player aç / kapat
  - `L` — beğen / beğenmekten vazgeç
  - (Not: arama kutusu gibi bir input alanındayken kısayollar çalışmaz.)
- **Tasarım cilası:** `fadeIn` açılış animasyonu, çalan şarkıda equalizer çubuk animasyonu, kartlarda hover büyüme (`scale`), aktif şarkıda yeşil halka (`ring`), koyu temalı özel scrollbar. Build yeşil (32 modül), dev `http://localhost:5173/` HTTP 200.

### Kullanım

1. Herhangi bir şarkıda **oynat**'a basın — alt player açılır.
2. Alt player'daki **şarkı adına / kapağa** tıklayın — tam ekran player açılır (sözler senkron kayar, aktif satır yeşil vurgulanır).
3. **Kuyruk** butonuna tıklayın — sağdan "Sıradakiler" paneli açılır, listedeki şarkıya tıklayıp geçiş yapabilirsiniz.
4. Klavyeden `Space` ile duraklatıp `→` ile sarabilir, `F` ile tam ekrana girip çıkabilirsiniz.
