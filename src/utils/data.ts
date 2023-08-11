import { TitleType } from "@/components/shared/TitleSwitcher";
import enTranslations from "@/constants/en";
import esTranslations from "@/constants/es";
import ruTranslations from "@/constants/ru";
import viTranslations from "@/constants/vi";
import kkTranslations from "@/constants/kk";
import esMXTranslations from "@/constants/es-MX";
import ptPTTranslations from "@/constants/pt-PT";

import { Media } from "@/types/anilist";
import { Chapter, Episode } from "@/types/core";
import { Translation } from "next-i18next";
import { parseNumbersFromString } from ".";

type Translate = { readonly value: string; readonly label: string } & Record<
  string,
  any
>;

type TranslationKeys = [
  "SEASONS",
  "FORMATS",
  "STATUS",
  "GENRES",
  "CHARACTERS_ROLES",
  "ANIME_SORTS",
  "MANGA_SORTS",
  "TYPES",
  "COUNTRIES",
  "VISIBILITY_MODES",
  "CHAT_EVENT_TYPES",
  "READ_STATUS",
  "WATCH_STATUS",
  "GENDERS",
  "EMOJI_GROUP"
];
type Translation = Record<TranslationKeys[number], Translate[]>;

export const getConstantTranslation = (locale: string) => {
  switch (locale.toLocaleLowerCase()) {
    case "vi":
      return viTranslations;
    case "en":
      return enTranslations;
    case "ru":
      return ruTranslations;
    case "es":
      return esTranslations;
    case "es-mx":
      return esMXTranslations;
    case "pt-pt":
      return ptPTTranslations;
    case "kk":
      return kkTranslations;
    default:
      return enTranslations;
  }
};

const composeTranslation = (translation: Translation) => {
  return {
    season: translation.SEASONS as Translate[],
    format: translation.FORMATS as Translate[],
    status: translation.STATUS as Translate[],
    genre: translation.GENRES as Translate[],
    characterRole: translation.CHARACTERS_ROLES as Translate[],
    animeSort: translation.ANIME_SORTS as Translate[],
    mangaSort: translation.MANGA_SORTS as Translate[],
    type: translation.TYPES as Translate[],
    country: translation.COUNTRIES as Translate[],
  };
};

const types = [
  "season",
  "format",
  "status",
  "genre",
  "characterRole",
  "animeSort",
  "mangaSort",
  "type",
  "country",
] as const;

type ConvertOptions = {
  reverse?: boolean;
  locale?: string;
};

export const convert = (
  text: string,
  type: (typeof types)[number],
  options: ConvertOptions = {}
) => {
  const { locale, reverse } = options;

  // @ts-ignore
  const constants = composeTranslation(getConstantTranslation(locale));

  const constant = constants[type];

  if (!constant) return text;

  const index = constant.findIndex(
    (el: (typeof constant)[number]) => el.value === text || el.label === text
  );

  if (index === -1) return null;

  if (reverse) return constant[index].value;

  return constant[index].label;
};

export const getTitle = (
  data: Media,
  { titleType, locale }: { titleType?: TitleType; locale?: string } = {
    titleType: TitleType.ORIGINAL,
    locale: "en",
  }
) => {
  if (titleType === TitleType.Japanese && data?.title?.romaji) {
    return data?.title?.romaji || data?.title?.userPreferred;
  }

  if (locale === "en")
    return data?.title?.english || data?.title?.userPreferred;

  const translation = data?.translations?.find(
    (translation) => translation.locale === locale
  );

  return translation?.title || data.title?.english || data.title?.userPreferred;
};

export const getDescription = (
  data: Media,

  { locale }: { locale?: string } = {
    locale: "en",
  }
) => {
  if (locale === "en") return data?.description;

  const translation = data?.translations?.find(
    (translation) => translation.locale === locale
  );

  return translation?.description || data?.description;
};

export const sortMediaUnit = <T extends Chapter | Episode>(data: T[]) => {
  return data.sort((a, b) => {
    const aNumber = parseNumbersFromString(a.number, 9999)?.[0];
    const bNumber = parseNumbersFromString(b.number, 9999)?.[0];

    return aNumber - bNumber;
  });
};
