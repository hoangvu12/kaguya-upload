import { parseNumbersFromString } from "@/utils";

interface MediaUnit {
  number: number | string;
}

export const sortMediaUnit = <T extends MediaUnit>(data: T[]) => {
  return data.sort((a, b) => {
    const aNumber = parseNumbersFromString(a.number.toString(), 9999)?.[0];
    const bNumber = parseNumbersFromString(b.number.toString(), 9999)?.[0];

    return aNumber - bNumber;
  });
};
