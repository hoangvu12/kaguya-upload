import classNames from "classnames";
import { atom, useAtom } from "jotai";
import { useRouter } from "next/router";
import { useEffect } from "react";

export enum TitleType {
  ORIGINAL = "original",
  Japanese = "japanese",
}

export const titleTypeAtom = atom(TitleType.ORIGINAL);

const LOCALSTORAGE_KEY = "kaguya.title_type";

const TitleSwitcher = () => {
  const [titleType, setTitleType] = useAtom(titleTypeAtom);
  const { locale } = useRouter();

  const handleSetTitleType = (titleType: TitleType) => () => {
    setTitleType(titleType);

    localStorage.setItem(LOCALSTORAGE_KEY, titleType);
  };

  useEffect(() => {
    const savedTitleType = localStorage.getItem(LOCALSTORAGE_KEY);

    let titleType = savedTitleType as TitleType;

    if (
      savedTitleType !== TitleType.ORIGINAL &&
      savedTitleType !== TitleType.Japanese
    ) {
      titleType = TitleType.ORIGINAL;
    }

    setTitleType(titleType);
  }, [setTitleType]);

  return (
    <div className="flex rounded-full bg-background-900">
      <button
        className={classNames(
          "px-2 py-1 rounded-full",
          titleType === TitleType.ORIGINAL && "bg-primary-600"
        )}
        onClick={handleSetTitleType(TitleType.ORIGINAL)}
      >
        {locale.toUpperCase()}
      </button>
      <button
        className={classNames(
          "px-2 py-1 rounded-full",
          titleType === TitleType.Japanese && "bg-primary-600"
        )}
        onClick={handleSetTitleType(TitleType.Japanese)}
      >
        JP
      </button>
    </div>
  );
};

export default TitleSwitcher;
