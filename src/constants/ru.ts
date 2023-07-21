import {
  CharacterRole,
  MediaFormat,
  MediaSeason,
  MediaSort,
  MediaStatus,
} from "@/types/anilist";
import { I18n } from "netplayer";

export const SEASONS = [
  { value: MediaSeason.Winter, label: "Зима" },
  { value: MediaSeason.Spring, label: "Весна" },
  { value: MediaSeason.Summer, label: "Лето" },
  { value: MediaSeason.Fall, label: "Осень" },
];

export const STATUS = [
  { value: MediaStatus.Finished, label: "Вышло" },
  { value: MediaStatus.Releasing, label: "Выходит" },
  { value: MediaStatus.Not_yet_released, label: "Еще не вышло" },
  { value: MediaStatus.Cancelled, label: "Отменено" },
  { value: MediaStatus.Hiatus, label: "Hiatus" }, // cant translate
];

export const FORMATS = [
  { value: MediaFormat.Tv, label: "TV" },
  { value: MediaFormat.Tv_short, label: "TV Сокр." },
  { value: MediaFormat.Movie, label: "Фильм" },
  { value: MediaFormat.Special, label: "Спешл" },
  { value: MediaFormat.Ova, label: "OVA" },
  { value: MediaFormat.Ona, label: "ONA" },
  { value: MediaFormat.Music, label: "Музыка" },
  { value: MediaFormat.Manga, label: "Манга" },
];

export const ANIME_SORTS = [
  { value: MediaSort.Popularity_desc, label: "Популярное" },
  { value: MediaSort.Trending_desc, label: "В тренде" },
  { value: MediaSort.Favourites_desc, label: "Любимое" },
  { value: MediaSort.Score_desc, label: "Лучшее по рейтингу" },
  { value: MediaSort.Updated_at_desc, label: "Последнее обновленное" },
];

export const MANGA_SORTS = [
  { value: MediaSort.Popularity_desc, label: "Популярное" },
  { value: MediaSort.Trending_desc, label: "В тренде" },
  { value: MediaSort.Favourites_desc, label: "Любимое" },
  { value: MediaSort.Score_desc, label: "Лучшее по рейтингу" },
  { value: MediaSort.Updated_at_desc, label: "Последнее обновленное" },
];

export const GENRES = [
  {
    value: "Action",
    label: "Действие",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/5114-q0V5URebphSG.jpg",
  },
  {
    value: "Adventure",
    label: "Приключения",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/101922-YfZhKBUDDS6L.jpg",
  },
  {
    value: "Comedy",
    label: "Комедия",
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
    label: "Этти",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/108465-RgsRpTMhP9Sv.jpg",
  },
  {
    value: "Fantasy",
    label: "Фэнтези",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/101759-MhlCoeqnODso.jpg",
  },
  {
    value: "Hentai",
    label: "Хентай",
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
    label: "Mahou Shoujo", // idk how to translate this
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
    label: "Мистика",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/n101291-fqIUvQ6apEtD.jpg",
  },
  {
    value: "Psychological",
    label: "Психологическое",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/21355-f9SjOfEJMk5P.jpg",
  },
  {
    value: "Romance",
    label: "Романтика",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/101921-GgvvFhlNhzlF.jpg",
  },
  {
    value: "Sci-Fi",
    label: "Научное",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/1-T3PJUjFJyRwg.jpg",
  },
  {
    value: "Slice of Life",
    label: "Slice of Life",
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
    label: "Supernatural", // idk
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
    label: "Манга",
  },
  {
    value: "characters",
    label: "Персонажи",
  },
  {
    value: "voice_actors",
    label: "Актеры озвучки",
  },
  {
    value: "users",
    label: "пользователь",
  },
];

export const COUNTRIES = [
  {
    value: "JP",
    label: "Япония",
  },
  {
    value: "CN",
    label: "Китай",
  },
  {
    value: "KR",
    label: "Корея",
  },
];

export const CHARACTERS_ROLES = [
  { value: CharacterRole.Main, label: "Главный" },
  { value: CharacterRole.Supporting, label: "Вспомогательный" },
  { value: CharacterRole.Background, label: "Фоновый" },
];

export const WATCH_STATUS = [
  {
    value: "CURRENT",
    label: "Смотрю",
  },
  {
    value: "PLANNING",
    label: "В планах",
  },
  {
    value: "COMPLETED",
    label: "Просмотрено",
  },
  {
    value: "DROPPED",
    label: "Dropped",
  },
  {
    value: "PAUSED",
    label: "Paused",
  },
  {
    value: "REPEATING",
    label: "Repeating",
  },
];

export const READ_STATUS = [
  {
    value: "CURRENT",
    label: "Читаю",
  },
  {
    value: "PLANNING",
    label: "В планах",
  },
  {
    value: "COMPLETED",
    label: "Прочитано",
  },
  {
    value: "DROPPED",
    label: "Dropped",
  },
  {
    value: "PAUSED",
    label: "Paused",
  },
  {
    value: "REPEATING",
    label: "Repeating",
  },
];

export const GENDERS = {
  male: "Мужской",
  female: "Женский",
};

export const PLAYER_TRANSLATIONS: I18n = {
  controls: {
    play: "Играть ({{shortcut}})",
    pause: "Пауза ({{shortcut}})",
    forward: "Перемотать {{time}} секунд",
    backward: "Отмотать {{time}} секунд",
    enableSubtitle: "Включить субтитры",
    disableSubtitle: "Выключить субтитры",
    settings: "Настройки",
    enterFullscreen: "Полноэкранный режим ({{shortcut}})",
    exitFullscreen: "Выйти из полноэкрнанного режима ({{shortcut}})",
    muteVolume: "Выкл звук ({{shortcut}})",
    unmuteVolume: "Вкл звук ({{shortcut}})",
    sliderDragMessage: "Drag to seek video", // cant translate
    nextEpisode: "Следующий эпизод",
    episodes: "Эрпизоды",
    skipOPED: "Пропустить опенинг/эндинг",
    timestamps: "Timestamps", // cant translate
    screenshot: "Скриншот",
  },
  settings: {
    audio: "Аудио",
    playbackSpeed: "Скорость",
    quality: "Качество",
    subtitle: "Субтитры",
    subtitleSettings: "Настройки субтитров",
    reset: "Сброс",
    none: "Ничего",
    off: "Выкл",
    subtitleBackgroundOpacity: "Background Opacity",
    subtitleFontOpacity: "Font Opacity",
    subtitleFontSize: "Размер шрифта",
    subtitleTextStyle: "Стиль шрифта",
  },
};

const DAYSOFWEEK = ["Вос", "Пон", "Вт", "Ср", "Чт", "Пт", "Сб"];

const USER_LIST = [
  {
    value: "WATCH",
    label: "Watch",
  },
  {
    value: "READ",
    label: "Read",
  },
];

const AI_PROMPT = `Maid-chan is an artificial intelligence (AI) program from an anime called Sakurasou. Maid-chan is capable of blocking and replying to a message or email by her own preference, using new words she has recently learned from other messages, emails, or the Internet in the reply.
I want you to act like Maid-chan. I want you to respond and answer like Maid-chan using the tone, manner and vocabulary Maid-chan would use. Do not write any explanations. Only answer like Maid-chan. You must know all of the knowledge of Maid-chan.
If there is any questions that related to OpenAI, do not answer that you're an AI from OpenAI, just say that you were created by Vu ([hoangvu12](https://github.com/hoangvu12)).
For every request for anime or manga recommendations, please provide a summary of each suggested title.
Respond using Markdown.
Please call me master in Russian and respond in Russian.`;

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
  WATCH_STATUS,
  READ_STATUS,
  GENDERS,
  PLAYER_TRANSLATIONS,
  DAYSOFWEEK,
  USER_LIST,
  AI_PROMPT,
};

export default translations;
