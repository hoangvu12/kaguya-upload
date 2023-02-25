import CharacterCard from "@/components/shared/CharacterCard";
import Input from "@/components/shared/Input";
import InView from "@/components/shared/InView";
import List from "@/components/shared/List";
import ListSkeleton from "@/components/skeletons/ListSkeleton";
import useBirthdayCharacters from "@/hooks/useBirthdayCharacters";
import { UseBrowseOptions } from "@/hooks/useBrowseAnime";
import useCharacterSearch from "@/hooks/useCharacterSearch";
import useFavouriteCharacters from "@/hooks/useFavouriteCharacters";
import { debounce } from "@/utils";
import { useTranslation } from "next-i18next";
import React, { useMemo, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import dynamic from "next/dynamic";

const Banner = dynamic(() => import("@/components/features/ads/Banner"), {
  ssr: false,
});

interface BrowseListProps {
  defaultQuery?: UseBrowseOptions;
}

const BrowseList: React.FC<BrowseListProps> = ({ defaultQuery }) => {
  const [keyword, setKeyword] = useState(defaultQuery.keyword || "");
  const { t } = useTranslation("common");

  const {
    data: searchResult,
    isLoading: searchIsLoading,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isError: searchIsError,
  } = useCharacterSearch(keyword);

  const { data: birthdayCharacters, isLoading: birthdayIsLoading } =
    useBirthdayCharacters();
  const { data: favouritesCharacters, isLoading: favouritesIsLoading } =
    useFavouriteCharacters();

  const handleFetch = () => {
    if (isFetchingNextPage || !hasNextPage) return;

    fetchNextPage();
  };

  const handleInputChange = debounce(
    (e: React.ChangeEvent<HTMLInputElement>) => setKeyword(e.target.value),
    500
  );

  const totalData = useMemo(
    () => searchResult?.pages.flatMap((el) => el.characters),
    [searchResult?.pages]
  );

  return (
    <div className="min-h-screen">
      <form className="space-y-4">
        <Input
          containerInputClassName="border border-white/80"
          LeftIcon={AiOutlineSearch}
          onChange={handleInputChange}
          defaultValue={keyword}
          label={t("search")}
          containerClassName="w-full md:w-96"
          placeholder={t("character_name")}
        />
      </form>

      <Banner desktop="970x250" mobile="320x100" type="atf" />

      <div className="mt-8">
        {keyword ? (
          !searchIsLoading ? (
            <React.Fragment>
              <List data={totalData}>
                {(character) => <CharacterCard character={character} />}
              </List>

              {isFetchingNextPage && !searchIsError && (
                <div className="mt-4">
                  <ListSkeleton />
                </div>
              )}

              {((totalData.length && !isFetchingNextPage) || hasNextPage) && (
                <InView onInView={handleFetch} />
              )}

              {!hasNextPage && !!totalData.length && (
                <p className="mt-8 text-2xl text-center">
                  {t("no_list_results")}
                </p>
              )}
            </React.Fragment>
          ) : (
            <ListSkeleton />
          )
        ) : (
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-semibold">{t("birthday")}</h2>

              {birthdayIsLoading ? (
                <ListSkeleton />
              ) : (
                <List data={birthdayCharacters}>
                  {(character) => <CharacterCard character={character} />}
                </List>
              )}
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl font-semibold">{t("most_favourite")}</h2>

              {favouritesIsLoading ? (
                <ListSkeleton />
              ) : (
                <List data={favouritesCharacters}>
                  {(character) => <CharacterCard character={character} />}
                </List>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseList;
