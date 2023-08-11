import {
  CharacterRole,
  MediaFormat,
  MediaSeason,
  MediaSort,
  MediaStatus,
} from "@/types/anilist";
import { I18n } from "netplayer";

export const SEASONS = [
  { value: MediaSeason.Winter, label: "Invierno" },
  { value: MediaSeason.Spring, label: "Primavera" },
  { value: MediaSeason.Summer, label: "Verano" },
  { value: MediaSeason.Fall, label: "Otoño" },
];

export const STATUS = [
  { value: MediaStatus.Finished, label: "Terminado" },
  { value: MediaStatus.Releasing, label: "En emisión" },
  { value: MediaStatus.Not_yet_released, label: "No se ha estrenado" },
  { value: MediaStatus.Cancelled, label: "Cancelado" },
  { value: MediaStatus.Hiatus, label: "En pausa" },
];

export const FORMATS = [
  { value: MediaFormat.Tv, label: "Serie" },
  { value: MediaFormat.Tv_short, label: "Cortometraje" },
  { value: MediaFormat.Movie, label: "Película" },
  { value: MediaFormat.Special, label: "Especial" },
  { value: MediaFormat.Ova, label: "OVA" },
  { value: MediaFormat.Ona, label: "ONA" },
  { value: MediaFormat.Music, label: "Música" },
  { value: MediaFormat.Manga, label: "Manga" },
];

export const ANIME_SORTS = [
  { value: MediaSort.Popularity_desc, label: "Popularidad" },
  { value: MediaSort.Trending_desc, label: "Tendencia" },
  { value: MediaSort.Favourites_desc, label: "Favoritos" },
  { value: MediaSort.Score_desc, label: "Puntuación media" },
  { value: MediaSort.Updated_at_desc, label: "Actualizado recientemente" },
];

export const MANGA_SORTS = [
  { value: MediaSort.Popularity_desc, label: "Popularidad" },
  { value: MediaSort.Trending_desc, label: "Tendencia" },
  { value: MediaSort.Favourites_desc, label: "Favoritos" },
  { value: MediaSort.Score_desc, label: "Puntuación media" },
  { value: MediaSort.Updated_at_desc, label: "Actualizado recientemente" },
];

export const GENRES = [
  {
    value: "Action",
    label: "Acción",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/5114-q0V5URebphSG.jpg",
  },
  {
    value: "Adventure",
    label: "Aventura",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/101922-YfZhKBUDDS6L.jpg",
  },
  {
    value: "Comedy",
    label: "Comedia",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/20464-HbmkPacki4sl.jpg",
  },
  {
    value: "Drama",
    label: "Drama",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/n9253-JIhmKgBKsWUN.jpg",
  },
  {
    value: "Ecchi",
    label: "Ecchi",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/108465-RgsRpTMhP9Sv.jpg",
  },
  {
    value: "Fantasy",
    label: "Fantasía",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/101759-MhlCoeqnODso.jpg",
  },
  {
    value: "Hentai",
    label: "Hentai",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/99894-MWIuMGnDIg1x.jpg",
  },
  {
    value: "Horror",
    label: "Horror",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/101759-MhlCoeqnODso.jpg",
  },
  {
    value: "Mahou Shoujo",
    label: "Mahou Shoujo",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/9756-d5M8NffgJJHB.jpg",
  },
  {
    value: "Mecha",
    label: "Mecha",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/30-gEMoHHIqxDgN.jpg",
  },
  {
    value: "Music",
    label: "Musica",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/20665-j4kSsfhfkM24.jpg",
  },
  {
    value: "Mystery",
    label: "Misterio",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/n101291-fqIUvQ6apEtD.jpg",
  },
  {
    value: "Psychological",
    label: "Psicológico",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/21355-f9SjOfEJMk5P.jpg",
  },
  {
    value: "Romance",
    label: "Romance",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/101921-GgvvFhlNhzlF.jpg",
  },
  {
    value: "Sci-Fi",
    label: "Ciencia ficción",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/1-T3PJUjFJyRwg.jpg",
  },
  {
    value: "Slice of Life",
    label: "Un trozo de vida",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/124080-ARyLAHHgikRq.jpg",
  },
  {
    value: "Sports",
    label: "Deportes",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/20992-sYHxFXg98JEj.jpg",
  },
  {
    value: "Supernatural",
    label: "Sobrenatural",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/21507-Qx8bGsLXUgLo.jpg",
  },
  {
    value: "Thriller",
    label: "Suspenso",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/100388-CR4PUEz1Nzsl.jpg",
  },
];

export const TYPES = [
  {
    value: "anime",
    label: "Anime",
  },
  {
    value: "manga",
    label: "Manga",
  },
  {
    value: "characters",
    label: "Personajes",
  },
  {
    value: "voice_actors",
    label: "Actores de voz",
  },
  {
    value: "users",
    label: "Usuarios",
  },
];

export const COUNTRIES = [
  {
    value: "JP",
    label: "Japan",
  },
  {
    value: "CN",
    label: "China",
  },
  {
    value: "KR",
    label: "Korea",
  },
];

export const CHARACTERS_ROLES = [
  { value: CharacterRole.Main, label: "Main" },
  { value: CharacterRole.Supporting, label: "Supporting" },
  { value: CharacterRole.Background, label: "Background" },
];

export const GENDERS = {
  male: "Hombre",
  female: "Mujer",
};

export const PLAYER_TRANSLATIONS: I18n = {
  controls: {
    play: "Play ({{shortcut}})",
    pause: "Pause ({{shortcut}})",
    forward: "Adelante {{time}} segundos",
    backward: "retroceder {{time}} segundos",
    enableSubtitle: "Activar subtítulos",
    disableSubtitle: "Desactivar subtítulos",
    settings: "Ajustes",
    enterFullscreen: "Entrar en pantalla completa ({{shortcut}})",
    exitFullscreen: "Salir de pantalla completa ({{shortcut}})",
    muteVolume: "Silenciar ({{shortcut}})",
    unmuteVolume: "Desactivar silencio ({{shortcut}})",
    sliderDragMessage: "Arrastrar para buscar vídeo",
    nextEpisode: "Siguiente episodio",
    episodes: "Episodios",
    skipOPED: "Saltar OP/ED",
    timestamps: "Marcas de tiempo",
    screenshot: "Captura de pantalla",
  },
  settings: {
    audio: "Audio",
    playbackSpeed: "Velocidad de reproducción",
    quality: "Calidad",
    subtitle: "Subtítulo",
    subtitleSettings: "Ajustes de subtítulos",
    reset: "Reiniciar",
    none: "Ninguno",
    off: "Off",
    subtitleBackgroundOpacity: "Opacidad de fondo",
    subtitleFontOpacity: "Opacidad de fuente",
    subtitleFontSize: "Tamaño de fuente",
    subtitleTextStyle: "Estilo de texto",
  },
};

const DAYSOFWEEK = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];

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
