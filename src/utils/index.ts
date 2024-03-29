import dayjs from "@/lib/dayjs";
import { MediaSeason } from "@/types/anilist";
import axios from "axios";
import mime from "mime";
import { toast } from "react-toastify";

export const randomElement = <T>(array: T[]): T => {
  const index = Math.floor(Math.random() * array.length);

  return array[index];
};

//https://stackoverflow.com/questions/9733288/how-to-programmatically-calculate-the-contrast-ratio-between-two-colors
export function luminance(r: number, g: number, b: number) {
  var a = [r, g, b].map(function (v) {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}
export function contrast(rgb1: number[], rgb2: number[]) {
  var lum1 = luminance(rgb1[0], rgb1[1], rgb1[2]);
  var lum2 = luminance(rgb2[0], rgb2[1], rgb2[2]);
  var brightest = Math.max(lum1, lum2);
  var darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

// https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
export function hexToRgb(hex: string) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : null;
}

export const isColorVisible = (
  textColor: string,
  backgroundColor: string = "#000000",
  ratio: number = 3.2
) => {
  const textColorRgb = hexToRgb(textColor);
  const backgroundColorRgb = hexToRgb(backgroundColor);

  return contrast(textColorRgb, backgroundColorRgb) >= ratio;
};

// https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function parseTime(seconds: string | number) {
  seconds = seconds.toString();
  let minutes = Math.floor(Number(seconds) / 60).toString();
  let hours = "";

  if (Number(minutes) > 59) {
    hours = Math.floor(Number(minutes) / 60).toString();
    hours = Number(hours) >= 10 ? hours : `0${hours}`;
    minutes = (Number(minutes) - Number(hours) * 60).toString();
    minutes = Number(minutes) >= 10 ? minutes : `0${minutes}`;
  }

  seconds = Math.floor(Number(seconds) % 60).toString();
  seconds = Number(seconds) >= 10 ? seconds : "0" + seconds;

  if (hours) {
    return `${hours}:${minutes}:${seconds}`;
  }

  return `${minutes}:${seconds}`;
}

export function serialize(obj: any) {
  return Object.keys(obj)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
    .join("&");
}

export const chunk = <T>(arr: T[], chunkSize: number): T[][] => {
  const array: T[][] = [];

  for (let i = 0; i < arr.length; i += chunkSize)
    array.push(arr.slice(i, i + chunkSize));

  return array;
};

export const getPagination = (page?: number, limit: number = 15) => {
  const from = page - 1 > 0 ? limit * (page - 1) + 1 : 0;
  const to = page - 1 > 0 ? from + limit : limit;

  return {
    from,
    to: to - 1,
  };
};

export const getSeason = () => {
  const month = dayjs().month();
  const year = dayjs().year();

  let season = MediaSeason.Winter;

  if (3 <= month && month <= 5) {
    season = MediaSeason.Spring;
  }

  if (6 <= month && month <= 8) {
    season = MediaSeason.Summer;
  }

  if (9 <= month && month <= 11) {
    season = MediaSeason.Fall;
  }

  return {
    season,
    year,
  };
};

// https://stackoverflow.com/questions/5457416/how-to-validate-numeric-values-which-may-contain-dots-or-commas
export const parseNumbersFromString = (
  text: string,
  fallbackNumber = null
): number[] => {
  if (!text) return [fallbackNumber];

  const matches = text.match(/\d+([\.,][\d{1,2}])?/g);

  if (!matches) return [fallbackNumber];

  return matches.map(Number);
};

export const parseNumberFromString = (text: string, fallbackNumber = null) => {
  return parseNumbersFromString(text, fallbackNumber)[0];
};

export const parseBetween = (str: string, start: string, end: string) => {
  let strArr = [];

  strArr = str.split(start);
  strArr = strArr[1].split(end);

  return strArr[0];
};

export const isFalsy = (value: any) => {
  return value === undefined || value === null || value === "";
};

export const base64ToUint8Array = (base64: string) => {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(b64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

export const arePropertiesFalsy = (obj: any) =>
  Object.keys(obj).every((key) => isFalsy(obj[key]));

export const formatDate = (date: {
  day?: number;
  month?: number;
  year?: number;
}) => {
  let day = dayjs();
  let format = [];

  if (!isFalsy(date.day)) {
    day = day.date(date.day);
    format.push("DD");
  }

  if (!isFalsy(date.month)) {
    day = day.month(date.month - 1);
    format.push("MM");
  }

  if (!isFalsy(date.year)) {
    day = day.year(date.year);
    format.push("YYYY");
  }

  return day.format(format.join("/"));
};

// https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
export function isValidUrl(string: string) {
  let url: URL;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

export const groupBy = <T, K extends string>(
  list: T[],
  getKey: (data: T) => K
) =>
  list.reduce((previous, currentItem) => {
    const key = getKey(currentItem);

    if (!previous[key]) previous[key] = [];

    previous[key].push(currentItem);

    return previous;
  }, {} as Record<string, T[]>);

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const debounce = <T extends CallableFunction>(func: T, wait: number) => {
  let timeout: any;

  // @ts-ignore
  return (...args: Parameters<T>) => {
    const later = () => {
      timeout = null;
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export function convertTime(seconds: string | number) {
  seconds = seconds.toString();
  let minutes = Math.floor(Number(seconds) / 60).toString();
  let hours = "";

  if (Number(minutes) > 59) {
    hours = Math.floor(Number(minutes) / 60).toString();
    hours = Number(hours) >= 10 ? hours : `0${hours}`;
    minutes = (Number(minutes) - Number(hours) * 60).toString();
    minutes = Number(minutes) >= 10 ? minutes : `0${minutes}`;
  }

  seconds = Math.floor(Number(seconds) % 60).toString();
  seconds = Number(seconds) >= 10 ? seconds : "0" + seconds;

  if (hours) {
    return `${hours}:${minutes}:${seconds}`;
  }

  return `${minutes}:${seconds}`;
}

export const getFileNameFromUrl = (url: string) => {
  return new URL(url).pathname.split("/").pop();
};

export const download = async (url: string, name: string) => {
  if (!url) {
    throw new Error("Resource URL not provided! You need to provide one");
  }

  fetch(url, { mode: "no-cors" })
    .then((response) => response.blob())
    .then((blob) => {
      const blobURL = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobURL;
      a.style.display = "none";

      if (name && name.length) a.download = name;
      document.body.appendChild(a);
      a.click();

      toast.info("The file has been downloaded successfully!");
    });
};

export const removeArrayOfObjectDup = <T extends object, K extends keyof T>(
  arr: T[],
  property: K
) => {
  return arr.filter(
    (obj, index, self) =>
      index === self.findIndex((t) => t[property] === obj[property])
  );
};

// https://stackoverflow.com/questions/10420352/converting-file-size-in-bytes-to-human-readable-string
export const humanFileSize = (size: number) => {
  if (size === 0) return "0 KB";

  const i = Math.floor(Math.log(size) / Math.log(1024));

  // @ts-ignore
  const convertedNumber = (size / Math.pow(1024, i)).toFixed(2) * 1;
  const units = ["B", "KB", "MB", "GB", "TB"];
  const unit = units[i];

  return `${convertedNumber} ${unit}`;
};

// https://stackoverflow.com/questions/6860853/generate-random-string-for-div-id
export const randomString = (length: number) => {
  const chars =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghiklmnopqrstuvwxyz".split("");

  if (!length) {
    length = Math.floor(Math.random() * chars.length);
  }

  let str = "";

  for (var i = 0; i < length; i++) {
    str += chars[Math.floor(Math.random() * chars.length)];
  }
  return str;
};

export const createFileFromUrl = async (url: string, filename: string) => {
  const { data } = await axios.get<Blob>(url, { responseType: "blob" });

  const extension = url.split(".").pop();

  const metadata = {
    type: mime.getType(extension) || "text/plain",
  };

  const file = new File([data], filename, metadata);

  return file;
};

export const sortObjectByValue = <T extends object>(
  obj: T,
  sortFn: (a: T[keyof T], b: T[keyof T]) => number
) => {
  const sortedObj = Object.keys(obj)
    .sort((a, b) => sortFn(obj[a], obj[b]))
    .reduce((result, key) => {
      result[key] = obj[key];
      return result;
    }, {} as T);

  return sortedObj;
};

export const removeDup = <T>(a: T[]) =>
  a.filter(function (item, pos) {
    return a.indexOf(item) == pos;
  });

export function setWithExpiry(key: string, value: any, ttl: number) {
  const now = new Date();

  // `item` is an object which contains the original value
  // as well as the time when it's supposed to expire
  const item = {
    value: value,
    expiry: now.getTime() + ttl,
  };

  localStorage.setItem(key, JSON.stringify(item));
}

export function getWithExpiry<T>(key: string): T {
  const itemStr = localStorage.getItem(key);
  // if the item doesn't exist, return null
  if (!itemStr) {
    return null;
  }

  const item = JSON.parse(itemStr);
  const now = new Date();

  // compare the expiry time of the item with the current time
  if (now.getTime() > item.expiry) {
    // If the item is expired, delete the item from storage
    // and return null

    localStorage.removeItem(key);
    return null;
  }

  return item.value;
}

export const compareTwoObject = (obj1: any, obj2: any) =>
  JSON.stringify(obj1) === JSON.stringify(obj2);

// https://github.com/sindresorhus/array-move/blob/main/index.js
export function arrayMoveMutable(
  array: unknown[],
  fromIndex: number,
  toIndex: number
) {
  const startIndex = fromIndex < 0 ? array.length + fromIndex : fromIndex;

  if (startIndex >= 0 && startIndex < array.length) {
    const endIndex = toIndex < 0 ? array.length + toIndex : toIndex;

    const [item] = array.splice(fromIndex, 1);
    array.splice(endIndex, 0, item);
  }
}

export function arrayMoveImmutable<ValueType>(
  array: readonly ValueType[],
  fromIndex: number,
  toIndex: number
) {
  const newArray = [...array];
  arrayMoveMutable(newArray, fromIndex, toIndex);
  return newArray;
}
