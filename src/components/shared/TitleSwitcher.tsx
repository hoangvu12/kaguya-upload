import classNames from "classnames";
import { atom, useAtom } from "jotai";
import { useEffect } from "react";

export enum TitleType {
  English = "english",
  Japanese = "japanese",
}

export const titleTypeAtom = atom(TitleType.English);

const LOCALSTORAGE_KEY = "kaguya.title_type";

const TitleSwitcher = () => {
  const [titleType, setTitleType] = useAtom(titleTypeAtom);

  const handleSetTitleType = (titleType: TitleType) => () => {
    setTitleType(titleType);

    localStorage.setItem(LOCALSTORAGE_KEY, titleType);
  };

  useEffect(() => {
    const savedTitleType = localStorage.getItem(LOCALSTORAGE_KEY);

    let titleType = savedTitleType as TitleType;

    if (
      savedTitleType !== TitleType.English &&
      savedTitleType !== TitleType.Japanese
    ) {
      titleType = TitleType.English;
    }

    setTitleType(titleType);
  }, []);

  return (
    <div className="flex rounded-full bg-background-900">
      <button
        className={classNames(
          "px-2 py-1 rounded-full",
          titleType === TitleType.English && "bg-primary-600"
        )}
        onClick={handleSetTitleType(TitleType.English)}
      >
        EN
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
