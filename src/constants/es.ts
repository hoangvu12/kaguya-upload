import { Notification, NotificationEntity } from "@/types";
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
  { value: MediaStatus.Finished, label: "Terminadp" },
  { value: MediaStatus.Releasing, label: "En emisión" },
  { value: MediaStatus.Not_yet_released, label: "No emitido" },
  { value: MediaStatus.Cancelled, label: "Cancelado" },
  { value: MediaStatus.Hiatus, label: "Hiatus" },
];

export const FORMATS = [
  { value: MediaFormat.Tv, label: "Serie" },
  { value: MediaFormat.Tv_short, label: "Corto" },
  { value: MediaFormat.Movie, label: "Película" },
  { value: MediaFormat.Special, label: "Especial" },
  { value: MediaFormat.Ova, label: "OVA" },
  { value: MediaFormat.Ona, label: "ONA" },
  { value: MediaFormat.Music, label: "Musica" },
  { value: MediaFormat.Manga, label: "Manga" },
];

export const ANIME_SORTS = [
  { value: MediaSort.Popularity_desc, label: "Popularidad" },
  { value: MediaSort.Trending_desc, label: "Tendencia" },
  { value: MediaSort.Favourites_desc, label: "Favoritos" },
  { value: MediaSort.Score_desc, label: "Puntuación" },
  { value: MediaSort.Updated_at_desc, label: "Actualizados recientemente" },
];

export const MANGA_SORTS = [
  { value: MediaSort.Popularity_desc, label: "Popularidad" },
  { value: MediaSort.Trending_desc, label: "Tendencia" },
  { value: MediaSort.Favourites_desc, label: "Favoritos" },
  { value: MediaSort.Score_desc, label: "Puntuación" },
  { value: MediaSort.Updated_at_desc, label: "Actualizados recientemente" },
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
    label: "Terror",
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
    label: "Sci-Fi",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/1-T3PJUjFJyRwg.jpg",
  },
  {
    value: "Slice of Life",
    label: "Cosas de la vida",
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
    label: "Actores/actrices de voz",
  },
  {
    value: "users",
    label: "Usuaria",
  },
];

export const COUNTRIES = [
  {
    value: "JP",
    label: "Japón",
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
  { value: CharacterRole.Main, label: "Principal" },
  { value: CharacterRole.Supporting, label: "Secundario" },
  { value: CharacterRole.Background, label: "De fondo" },
];

export const WATCH_STATUS = [
  {
    value: "CURRENT",
    label: "Viendo",
  },
  {
    value: "PLANNING",
    label: "Planeado",
  },
  {
    value: "COMPLETED",
    label: "Completado",
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
    label: "Leyendo",
  },
  {
    value: "PLANNING",
    label: "Planeado",
  },
  {
    value: "COMPLETED",
    label: "Completado",
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

export const VISIBILITY_MODES = [
  {
    value: "public",
    label: "Público",
  },
  {
    value: "private",
    label: "Privado",
  },
];

export const CHAT_EVENT_TYPES = {
  join: "se ha unido a la sala",
  leave: "ha abandonado la sala",
  play: "ha reproducido al video",
  pause: "ha pausado el video",
  changeEpisode: "ha cambiado de episodio",
};

export const GENDERS = {
  male: "Masculino",
  female: "Femenino",
};

export const EMOJI_GROUP = {
  smileys_people: "Caras Sonrientes y Personas",
  animals_nature: "Animales y Naturaleza",
  food_drink: "Comidas y Bebidas",
  travel_places: "Viajes y Lugares",
  activities: "Actividades",
  objects: "Objetos",
  symbols: "Símbolos",
  flags: "Banderas",
  recently_used: "Usados recientemente",
};

export const PLAYER_TRANSLATIONS: I18n = {
  controls: {
    play: "Reproducir ({{shortcut}})",
    pause: "Pausar ({{shortcut}})",
    forward: "Adelantar {{time}} segundos",
    backward: "Retrasar {{time}} segundos",
    enableSubtitle: "Activar subtitulos",
    disableSubtitle: "Desactivar subtitulos",
    settings: "Ajustes",
    enterFullscreen: "Pantalla completa ({{shortcut}})",
    exitFullscreen: "Salir de pantalla completa ({{shortcut}})",
    muteVolume: "Mutear ({{shortcut}})",
    unmuteVolume: "Desmutear ({{shortcut}})",
    sliderDragMessage: "Arrastrar para adelantar o atrasar el video",
    nextEpisode: "Próximo episodio",
    episodes: "Episodios",
    skipOPED: "Omitir OP/ED",
    timestamps: "Marcas de tiempo",
    screenshot: "Captura de pantalla",
  },
  settings: {
    audio: "Audio",
    playbackSpeed: "Velocidad de reproducción",
    quality: "Calidad",
    subtitle: "Subtítulos",
    subtitleSettings: "Ajustes de subtítulos",
    reset: "Resetear",
    none: "Ninguno",
    off: "Apagado",
    subtitleBackgroundOpacity: "Opacidad del fondo",
    subtitleFontOpacity: "Opacidad de fuente",
    subtitleFontSize: "Tamaño de fuente",
    subtitleTextStyle: "Estilo del texto",
  },
};

export const NOTIFICATION_ENTITIES: Record<
  string,
  (notification: Notification) => NotificationEntity
> = {
  comment_mention: (notification) => {
    const [mediaType, mediaId] = notification.parentEntityId.split("-");

    return {
      message: `${notification?.sender?.name} te mencionó en un comentario`,
      redirectUrl: `/${mediaType}/details/${mediaId}?commentId=${notification.entityId}`,
    };
  },
  comment_reaction: (notification) => {
    const [mediaType, mediaId] = notification.parentEntityId.split("-");

    return {
      message: `${notification?.sender?.name} ha reaccionado a tu comentario`,
      redirectUrl: `/${mediaType}/details/${mediaId}?commentId=${notification.entityId}`,
    };
  },
};

const DAYSOFWEEK = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];

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
Please call me master in Spanish and respond in Spanish.`;

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
  VISIBILITY_MODES,
  CHAT_EVENT_TYPES,
  WATCH_STATUS,
  READ_STATUS,
  GENDERS,
  EMOJI_GROUP,
  PLAYER_TRANSLATIONS,
  DAYSOFWEEK,
  NOTIFICATION_ENTITIES,
  USER_LIST,
  AI_PROMPT,
};

export default translations;
