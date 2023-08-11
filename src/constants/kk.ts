import {
  CharacterRole,
  MediaFormat,
  MediaSeason,
  MediaSort,
  MediaStatus,
} from "@/types/anilist";
import { I18n } from "netplayer";

export const SEASONS = [
  { value: MediaSeason.Winter, label: "Қыс" },
  { value: MediaSeason.Spring, label: "Көктем" },
  { value: MediaSeason.Summer, label: "Жаз" },
  { value: MediaSeason.Fall, label: "Күз" },
];

export const STATUS = [
  { value: MediaStatus.Finished, label: "Шығып бітті" },
  { value: MediaStatus.Releasing, label: "Шығып жатыр" },
  { value: MediaStatus.Not_yet_released, label: "Әлі шықпайды" },
  { value: MediaStatus.Cancelled, label: "Релизі болмайды" },
  { value: MediaStatus.Hiatus, label: "Хиатус" },
];

export const FORMATS = [
  { value: MediaFormat.Tv, label: "ТВ" },
  { value: MediaFormat.Tv_short, label: "Қысқа ТВ" },
  { value: MediaFormat.Movie, label: "Филім" },
  { value: MediaFormat.Special, label: "Спешл" },
  { value: MediaFormat.Ova, label: "OVA" },
  { value: MediaFormat.Ona, label: "ONA" },
  { value: MediaFormat.Music, label: "Ән" },
  { value: MediaFormat.Manga, label: "Маңга" },
];

export const ANIME_SORTS = [
  { value: MediaSort.Popularity_desc, label: "Танымал анимелер" },
  { value: MediaSort.Trending_desc, label: "Трендтегілер" },
  { value: MediaSort.Favourites_desc, label: "Таңдаулылар" },
  { value: MediaSort.Score_desc, label: "Жоғары ұпай алғандар" },
  { value: MediaSort.Updated_at_desc, label: "Жуырда жаңартылғандар" },
];

export const MANGA_SORTS = [
  { value: MediaSort.Popularity_desc, label: "Танымал маңгалар" },
  { value: MediaSort.Trending_desc, label: "Трендтегілер" },
  { value: MediaSort.Favourites_desc, label: "Таңдаулылар" },
  { value: MediaSort.Score_desc, label: "Жоғары ұпай алғандар" },
  { value: MediaSort.Updated_at_desc, label: "Жуырда жаңартылғандар" },
];

export const GENRES = [
  {
    value: "Action",
    label: "Атыс-шабыс",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/5114-q0V5URebphSG.jpg",
  },
  {
    value: "Adventure",
    label: "Шытырман",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/101922-YfZhKBUDDS6L.jpg",
  },
  {
    value: "Comedy",
    label: "Әзіл-қалжың",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/20464-HbmkPacki4sl.jpg",
  },
  {
    value: "Drama",
    label: "Драма",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/n9253-JIhmKgBKsWUN.jpg",
  },
  {
    value: "Ecchi",
    label: "Эччи",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/108465-RgsRpTMhP9Sv.jpg",
  },
  {
    value: "Fantasy",
    label: "Фентези",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/101759-MhlCoeqnODso.jpg",
  },
  {
    value: "Hentai",
    label: "Ұятсыз",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/99894-MWIuMGnDIg1x.jpg",
  },
  {
    value: "Horror",
    label: "Хоррор",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/101759-MhlCoeqnODso.jpg",
  },
  {
    value: "Mahou Shoujo",
    label: "Махоу Шоуджо",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/9756-d5M8NffgJJHB.jpg",
  },
  {
    value: "Mecha",
    label: "Меха",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/30-gEMoHHIqxDgN.jpg",
  },
  {
    value: "Music",
    label: "Музыка",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/20665-j4kSsfhfkM24.jpg",
  },
  {
    value: "Mystery",
    label: "Жұмбақ",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/n101291-fqIUvQ6apEtD.jpg",
  },
  {
    value: "Psychological",
    label: "Психологиялық",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/21355-f9SjOfEJMk5P.jpg",
  },
  {
    value: "Romance",
    label: "Махаббат",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/101921-GgvvFhlNhzlF.jpg",
  },
  {
    value: "Sci-Fi",
    label: "Сай-фай",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/1-T3PJUjFJyRwg.jpg",
  },
  {
    value: "Slice of Life",
    label: "Өмір үзіндісі",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/124080-ARyLAHHgikRq.jpg",
  },
  {
    value: "Sports",
    label: "Спорт",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/20992-sYHxFXg98JEj.jpg",
  },
  {
    value: "Supernatural",
    label: "Тылсым",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/21507-Qx8bGsLXUgLo.jpg",
  },
  {
    value: "Thriller",
    label: "Триллер",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/100388-CR4PUEz1Nzsl.jpg",
  },
];

export const TYPES = [
  {
    value: "anime",
    label: "Аниме",
  },
  {
    value: "manga",
    label: "Маңга",
  },
  {
    value: "characters",
    label: "Кейіпкерлер",
  },
  {
    value: "voice_actors",
    label: "Дыбыстаушылар",
  },
  {
    value: "users",
    label: "Пайдаланушылар",
  },
];

export const COUNTRIES = [
  {
    value: "JP",
    label: "Жапония",
  },
  {
    value: "CN",
    label: "Қытай",
  },
  {
    value: "KR",
    label: "Корея",
  },
];

export const CHARACTERS_ROLES = [
  { value: CharacterRole.Main, label: "Басты" },
  { value: CharacterRole.Supporting, label: "Қосалқы" },
  { value: CharacterRole.Background, label: "Артқы" },
];

export const GENDERS = {
  male: "Ер",
  female: "Әйел",
};

export const PLAYER_TRANSLATIONS: I18n = {
  controls: {
    play: "Ойнату ({{shortcut}})",
    pause: "Тоқтату ({{shortcut}})",
    forward: "{{time}} сек. алға",
    backward: "{{time}} сек. артқа",
    enableSubtitle: "Субтитр қосу",
    disableSubtitle: "Субтитр өшіру",
    settings: "Баптау",
    enterFullscreen: "Толық экранға қосу ({{shortcut}})",
    exitFullscreen: "Толық экраннан шығу ({{shortcut}})",
    muteVolume: "Даусын сөндіру ({{shortcut}})",
    unmuteVolume: "Даусын қосу ({{shortcut}})",
    sliderDragMessage: "Бейне іздеу үшін сүйреңіз",
    nextEpisode: "Келесі бөлім",
    episodes: "Бөлімдер",
    skipOPED: "Опениң/Эндиңін өткізіп жіберу",
    timestamps: "Уақыт белгісі",
    screenshot: "Скриншот",
  },
  settings: {
    audio: "Аудио",
    playbackSpeed: "Жылдамдығы",
    quality: "Сапасы",
    subtitle: "Субтитр",
    subtitleSettings: "Субтитрді баптау",
    reset: "Қалпына келтіру",
    none: "Нөл",
    off: "Өшіру",
    subtitleBackgroundOpacity: "Арты жағының ашықтығы",
    subtitleFontOpacity: "Қаріп ашықтығы",
    subtitleFontSize: "Қаріп көлемі",
    subtitleTextStyle: "Мәтін мәнері",
  },
};

const DAYSOFWEEK = ["Жек", "Дүй", "Сей", "Сәр", "Бей", "Жұм", "Сен"];

const translations = {
  SEASONS,
  FORMATS,
  STATUS,
  GENRES,
  CHARACTERS_ROLES,
  ANIME_SORTS,
  MANGA_SORTS,
  TYPES,
  COUNTRIES,
  GENDERS,
  PLAYER_TRANSLATIONS,
  DAYSOFWEEK,
};

export default translations;
