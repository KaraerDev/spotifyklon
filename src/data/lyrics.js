// Özgün, hayali Türkçe sözler (telifli gerçek söz içermez).
// Yapı: lyrics[songId] = { lines: [{ time: saniye, text: "..." }] }

export const lyrics = {
  1: {
    lines: [
      { time: 0, text: "Sabah ışığı vurur perde aralarından" },
      { time: 12, text: "Aklımda eski bir şarkı, dilimde adın" },
      { time: 24, text: "Sokaklar uyanırken ben hâlâ rüyadayım" },
      { time: 38, text: "Kalbimde çarpan ritim, sensin duyduğum" },
      { time: 55, text: "Dönüp bakma ardına, yol bizi çağırır" },
      { time: 72, text: "Rüzgâr saçlarını dağıtır, özgürsün artık" },
      { time: 95, text: "Dans et, bırak kederi akşamlara" },
      { time: 120, text: "Bu gece yıldızlar bizim için parlar" },
      { time: 150, text: "El ele tutuşalım, sabahı karşılayalım" },
    ],
  },
  4: {
    lines: [
      { time: 0, text: "Gece yarısı uyandım, içimde bir sızı" },
      { time: 14, text: "Duvarlar üstüme gelir, sessizlik uğuldar" },
      { time: 28, text: "Bir derdim var, anlatamam kimseye" },
      { time: 44, text: "Gölgem bile terk etti, kaldım tek başıma" },
      { time: 62, text: "Yağmur camda iz bırakır, ben içimde saklarım" },
      { time: 80, text: "Kaç gece geçti, saymadım, unutmadım" },
      { time: 100, text: "Bir ışık ararım karanlık sokaklarda" },
      { time: 125, text: "Belki sabah olur, belki diner ağrılar" },
      { time: 155, text: "Yine de yürürüm, düşsem de kalkarım" },
    ],
  },
  5: {
    lines: [
      { time: 0, text: "Mektupları yaktım, külleri savurdum" },
      { time: 13, text: "Fotoğraflar solar, anılar kanatır" },
      { time: 27, text: "Her şeyi yak, geriye bakma dedim" },
      { time: 42, text: "Ateşin dili var, o da yalan söyler" },
      { time: 58, text: "Duman yükselir, gökyüzü kararır" },
      { time: 76, text: "İçimdeki yangını kim söndürür?" },
      { time: 94, text: "Küllerimden doğarım, yeniden başlarım" },
      { time: 118, text: "Her şeyi yak, özgür kal bu gece" },
      { time: 145, text: "Sabah küller arasından güneş doğar" },
    ],
  },
  9: {
    lines: [
      { time: 0, text: "Duvarları sarar yeşil bir sarmaşık" },
      { time: 12, text: "Kalbime dolanır hatıralar usulca" },
      { time: 26, text: "Bir bakışın yeter, çiçek açar içim" },
      { time: 40, text: "Zaman durur, gözlerinde kaybolurum" },
      { time: 56, text: "Sarmaşık gibi sardın her yanımı" },
      { time: 72, text: "Kök saldın içime, sökemem artık" },
      { time: 90, text: "Büyürüz birlikte, güneşe döneriz" },
      { time: 112, text: "Yaprak yaprak umut, dal dal sevinç" },
      { time: 140, text: "Sarıl bana, bırakma hiç bu gece" },
    ],
  },
  15: {
    lines: [
      { time: 0, text: "Nehrin kıyısında buluştuk seninle" },
      { time: 11, text: "Elimde gitar, dilimde yeni bir ezgi" },
      { time: 23, text: "Şehrin ışıkları suya yansırken" },
      { time: 37, text: "Kalbim şekillenir avuçlarında" },
      { time: 52, text: "Her adımda ritim, her nefeste sevda" },
      { time: 68, text: "Dans edelim sabaha kadar durmadan" },
      { time: 86, text: "Dünya dönsün, biz aynı yerde kalalım" },
      { time: 108, text: "Sevgin nakış gibi işlenir kalbime" },
      { time: 135, text: "Bu his hiç bitmesin, hep böyle sürsün" },
    ],
  },
  16: {
    lines: [
      { time: 0, text: "Neon ışıklar altında koşuyorum" },
      { time: 10, text: "Şehrin nabzı gece yarısı hızlanır" },
      { time: 22, text: "Farlar gözümü kör eder, yine de durmam" },
      { time: 36, text: "Kör edici ışıklar, içimde bir yangın" },
      { time: 50, text: "Geçmişi dikiz aynasında bıraktım" },
      { time: 66, text: "Hızlandıkça hafifler yalnızlığım" },
      { time: 84, text: "Sabaha karşı kaybolur tüm gölgeler" },
      { time: 106, text: "Işıklara sürüyorum umutlarımı" },
      { time: 130, text: "Durma, devam et, şafak yakın artık" },
    ],
  },
};

const FALLBACK_LINES = [
  { time: 0, text: "Bu şarkı için sözler yakında..." },
  { time: 5, text: "Ritmi hisset, gözlerini kapat" },
  { time: 15, text: "Melodi seni alsın götürsün" },
  { time: 25, text: "Sözler eklenene dek müziğin tadını çıkar ♫" },
];

export function getLyrics(songId) {
  const entry = lyrics?.[songId];
  if (entry && Array.isArray(entry.lines) && entry.lines.length > 0) {
    return entry.lines;
  }
  return FALLBACK_LINES;
}
