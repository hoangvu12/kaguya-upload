import {
  CharacterRole,
  MediaFormat,
  MediaSeason,
  MediaSort,
  MediaStatus,
} from "@/types/anilist";
import { I18n } from "netplayer";

export const SEASONS = [
  { value: MediaSeason.Winter, label: "Inverno" },
  { value: MediaSeason.Spring, label: "Primavera" },
  { value: MediaSeason.Summer, label: "Verão" },
  { value: MediaSeason.Fall, label: "Outono" },
];

export const STATUS = [
  { value: MediaStatus.Finished, label: "Concluído" },
  { value: MediaStatus.Releasing, label: "Em lançamento" },
  { value: MediaStatus.Not_yet_released, label: "Ainda não lançado" },
  { value: MediaStatus.Cancelled, label: "Cancelado" },
  { value: MediaStatus.Hiatus, label: "Em hiato" },
];

export const FORMATS = [
  { value: MediaFormat.Tv, label: "Série" },
  { value: MediaFormat.Tv_short, label: "Curta-metragem" },
  { value: MediaFormat.Movie, label: "Filme" },
  { value: MediaFormat.Special, label: "Especial" },
  { value: MediaFormat.Ova, label: "OVA" },
  { value: MediaFormat.Ona, label: "ONA" },
  { value: MediaFormat.Music, label: "Música" },
  { value: MediaFormat.Manga, label: "Mangá" },
];

export const ANIME_SORTS = [
  { value: MediaSort.Popularity_desc, label: "Popularidade" },
  { value: MediaSort.Trending_desc, label: "Tendência" },
  { value: MediaSort.Favourites_desc, label: "Favoritos" },
  { value: MediaSort.Score_desc, label: "Média de pontuação" },
  { value: MediaSort.Updated_at_desc, label: "Atualizado recentemente" },
];

export const MANGA_SORTS = [
  { value: MediaSort.Popularity_desc, label: "Popularidade" },
  { value: MediaSort.Trending_desc, label: "Tendência" },
  { value: MediaSort.Favourites_desc, label: "Favoritos" },
  { value: MediaSort.Score_desc, label: "Média de pontuação" },
  { value: MediaSort.Updated_at_desc, label: "Atualizado recentemente" },
];

export const GENRES = [
  {
    value: "Action",
    label: "Ação",
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
    label: "Comédia",
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
    label: "Pervertido",
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
    label: "Robô",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/30-gEMoHHIqxDgN.jpg",
  },
  {
    value: "Music",
    label: "A música",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/20665-j4kSsfhfkM24.jpg",
  },
  {
    value: "Mystery",
    label: "Mistério",
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
    label: "O Romance",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/101921-GgvvFhlNhzlF.jpg",
  },
  {
    value: "Sci-Fi",
    label: "Ficção científica",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/1-T3PJUjFJyRwg.jpg",
  },
  {
    value: "Slice of Life",
    label: "Fatia de vida",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/124080-ARyLAHHgikRq.jpg",
  },
  {
    value: "Sports",
    label: "Desporto",
    thumbnail:
      "https://s4.anilist.co/file/anilistcdn/media/anime/banner/20992-sYHxFXg98JEj.jpg",
  },
  {
    value: "Supernatural",
    label: "Sobrenaturais",
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
    label: "personagens",
  },
  {
    value: "voice_actors",
    label: "actores vocais",
  },
  {
    value: "users",
    label: "utentes",
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
    play: "Pronto ({{shortcut}})",
    pause: "Pausa ({{shortcut}})",
    forward: "Avançar {{time}} segundos",
    backward: "Recuar {{time}} segundos",
    enableSubtitle: "Ativar legendas",
    disableSubtitle: "Desativar legendas",
    settings: "Ajustes",
    enterFullscreen: "Aceder ao ecrã inteiro ({{shortcut}})",
    exitFullscreen: "Sair do ecrã inteiro ({{shortcut}})",
    muteVolume: "silenciar Volumen ({{shortcut}})",
    unmuteVolume: "Desactivar Volumen ({{shortcut}})",
    sliderDragMessage: "pesquisa de vídeo com arrastar e largar",
    nextEpisode: "Próximo episódio",
    episodes: "Episodios",
    skipOPED: "Saltar OP/ED",
    timestamps: "Carimbos de tempo",
    screenshot: "Captura de ecrã",
  },
  settings: {
    audio: "Áudio",
    playbackSpeed: "Velocidade de reprodução",
    quality: "Qualidade",
    subtitle: "Legenda",
    subtitleSettings: "Definições de legendas",
    reset: "Recomeçar",
    none: "Nenhum",
    off: "Não",
    subtitleBackgroundOpacity: "Opacidade do fundo",
    subtitleFontOpacity: "Opacidade da fonte",
    subtitleFontSize: "Tamanho da letra",
    subtitleTextStyle: "Estilo do texto",
  },
};

const DAYSOFWEEK = [
  "Dom",
  "Seg-feira",
  "Ter-feira",
  "Qua-feira",
  "Qui-feira",
  "Sex-feira",
];

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
