import Input from "@/components/shared/Input";
import Loading from "@/components/shared/Loading";
import Portal from "@/components/shared/Portal";
import { useThemePlayer } from "@/contexts/ThemePlayerContext";
import useThemeSearch from "@/hooks/useThemeSearch";
import { debounce } from "@/utils";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import ThemeCard from "./ThemeCard";

interface SearchProps {
  className?: string;
}

const ThemeSearch: React.FC<SearchProps> = ({ className }) => {
  const [show, setShow] = useState(false);
  const [keyword, setKeyword] = useState(null);
  const { data, isLoading, refetch } = useThemeSearch(keyword, false);
  const { theme } = useThemePlayer();
  const searchDebounce = useRef<NodeJS.Timeout>(null);

  const handleFetch = () => {
    if (searchDebounce.current) {
      clearTimeout(searchDebounce.current);
    }

    searchDebounce.current = setTimeout(() => {
      refetch({ inactive: true });
    }, 500);
  };

  const handleInputChange: React.FormEventHandler<HTMLInputElement> = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setKeyword(e.target.value);

    handleFetch();
  };

  useEffect(() => {
    if (show) return;

    if (!theme?.name) return;

    setKeyword(theme.name);

    setTimeout(() => {
      refetch({ inactive: true });
    }, 500);
  }, [refetch, show, theme?.name]);

  return (
    <React.Fragment>
      <AiOutlineSearch
        className={className}
        onClick={(e) => {
          e.stopPropagation();

          setShow(true);
        }}
      />

      {show && (
        <Portal>
          <div
            className="fixed inset-0 z-40 bg-black/80"
            onClick={(e) => {
              e.stopPropagation();

              setShow(false);
            }}
          ></div>

          <div
            className="absolute h-5/6 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 flex flex-col items-center space-y-2"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="w-full">
              <Input
                value={keyword}
                containerInputClassName="border border-white/80 min-w-[80vw] md:min-w-[30rem]"
                LeftIcon={AiOutlineSearch}
                placeholder="Theme search"
                onChange={handleInputChange}
              />
            </div>

            <div className="relative h-full w-full overflow-y-scroll no-scrollbar bg-background-900">
              {isLoading ? (
                <Loading />
              ) : (
                keyword && (
                  <div className="relative w-full h-full space-y-2 overflow-y-scroll no-scrollbar">
                    {data?.search?.anime?.length ? (
                      data.search.anime.map((anime) => (
                        <ThemeCard anime={anime} key={anime.id} />
                      ))
                    ) : (
                      <p className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-xl text-center">
                        No results
                      </p>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        </Portal>
      )}
    </React.Fragment>
  );
};

export default ThemeSearch;
