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
  { value: MediaStatus.Not_yet_released, label: "Ещё не вышло" },
  { value: MediaStatus.Cancelled, label: "Отменено" },
  { value: MediaStatus.Hiatus, label: "Хиатус" },
];

export const FORMATS = [
  { value: MediaFormat.Tv, label: "TV" },
  { value: MediaFormat.Tv_short, label: "TV-Short" },
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
    label: "Экшн",
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
    label: "Махо-сёдзё",
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
    label: "Сверхъестественное",
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
    label: "Пользователи",
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

export const GENDERS = {
  male: "Мужской",
  female: "Женский",
};

export const PLAYER_TRANSLATIONS: I18n = {
  controls: {
    play: "Играть ({{shortcut}})",
    pause: "Пауза ({{shortcut}})",
    forward: "Перемотать на {{time}} секунд",
    backward: "Отмотать на {{time}} секунд",
    enableSubtitle: "Включить субтитры",
    disableSubtitle: "Выключить субтитры",
    settings: "Настройки",
    enterFullscreen: "Полноэкранный режим ({{shortcut}})",
    exitFullscreen: "Выйти из полноэкрнанного режима ({{shortcut}})",
    muteVolume: "Выкл звук ({{shortcut}})",
    unmuteVolume: "Вкл звук ({{shortcut}})",
    sliderDragMessage: "Удерживайте чтобы отмотать видео",
    nextEpisode: "Следующая серия",
    episodes: "Серии",
    skipOPED: "Пропустить опенинг/эндинг",
    timestamps: "Временные метки",
    screenshot: "Скриншот",
  },
  settings: {
    audio: "Аудио",
    playbackSpeed: "Скорость",
    quality: "Качество",
    subtitle: "Субтитры",
    subtitleSettings: "Настройки субтитров",
    reset: "Сбросить",
    none: "Ничего",
    off: "Выкл",
    subtitleBackgroundOpacity: "Прозрачность фона",
    subtitleFontOpacity: "Прозрачность шрифта",
    subtitleFontSize: "Размер шрифта",
    subtitleTextStyle: "Стиль шрифта",
  },
};

const DAYSOFWEEK = ["Вос", "Пон", "Вто", "Сре", "Чет", "Пят", "Суб"];

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
