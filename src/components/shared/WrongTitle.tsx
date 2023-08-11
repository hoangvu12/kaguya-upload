import { Media, MediaType } from "@/types/anilist";
import React, { useCallback, useRef, useState } from "react";
import Modal, { ModalRef } from "./Modal";
import { isDesktop } from "react-device-detect";
import useSourceSearch from "@/hooks/useSourceSearch";
import List from "./List";
import SearchResultCard from "./SearchResultCard";
import ListSkeleton from "../skeletons/ListSkeleton";
import { SearchResult } from "@/types/core";
import { useQueryClient } from "react-query";
import BottomSheet, { BottomSheetRef } from "./BottomSheet";
import Input from "./Input";
import { AiOutlineSearch } from "react-icons/ai";
import { debounce } from "@/utils";
import { saveMapping } from "@/utils/mediaId";
import { Trans, useTranslation } from "next-i18next";

interface WrongTitleProps {
  sourceId: string;
  mediaType: MediaType;
  anilist: Media;
}

const WrongTitle: React.FC<WrongTitleProps> = (props) => {
  return isDesktop ? (
    <WrongTitleDesktop {...props} />
  ) : (
    <WrongTitleMobile {...props} />
  );
};

const WrongTitleDesktop: React.FC<WrongTitleProps> = ({
  sourceId,
  mediaType,
  anilist,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useTranslation("wrong_title");

  const { data, isLoading, isError, error } = useSourceSearch(
    {
      anilist,
      sourceId,
      mediaType,
      query: searchQuery,
    },
    { enabled: isModalOpen }
  );

  const queryClient = useQueryClient();

  const modalRef = useRef<ModalRef>(null);

  const handleOpen = useCallback(() => {
    modalRef.current?.open();

    setIsModalOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleInputChange = debounce(
    (e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value),
    500
  );

  const setMediaId = useCallback(
    (result: SearchResult) => {
      const queryKey =
        mediaType === MediaType.Anime
          ? ["anime-id", anilist.id, sourceId]
          : ["manga-id", anilist.id, sourceId];
      const updateResult =
        mediaType === MediaType.Anime
          ? { animeId: result.id, extraData: result.extra }
          : { mangaId: result.id, extraData: result.extra };

      queryClient.setQueryData(queryKey, updateResult);

      saveMapping(anilist.id, sourceId, result.id, result.extra);

      modalRef?.current?.close();
    },
    [anilist.id, mediaType, queryClient, sourceId]
  );

  return (
    <React.Fragment>
      <p
        onClick={handleOpen}
        className="text-right cursor-pointer font-semibold underline"
      >
        {t("wrong_title_label")}
      </p>

      <Modal onClose={handleClose} ref={modalRef}>
        <Input
          containerInputClassName="border border-white/80"
          LeftIcon={AiOutlineSearch}
          onChange={handleInputChange}
          defaultValue={null}
          placeholder={anilist.title.english || anilist.title.romaji}
        />

        <h1 className="font-semibold text-2xl my-8">
          <Trans
            t={t}
            i18nKey="search_results_heading"
            defaults="Search result for: <italic>{{searchQuery}}</italic>"
            values={{
              searchQuery:
                searchQuery ||
                anilist.title.english ||
                anilist.title.romaji ||
                anilist.title.userPreferred,
            }}
            components={{ italic: <i className="italic" /> }}
          />
        </h1>

        {isLoading ? (
          <ListSkeleton />
        ) : isError ? (
          <p className="text-center font-bold text-2l">
            <Trans
              t={t}
              i18nKey="wrong_title_error"
              defaults="Something went wrong ({{errorMessage}})"
              values={{ errorMessage: error.message }}
            />
          </p>
        ) : data?.length ? (
          <List data={data}>
            {(node) => (
              <SearchResultCard
                className="cursor-pointer"
                data={node}
                onClick={() => setMediaId(node)}
              />
            )}
          </List>
        ) : (
          <p className="text-center font-bold text-2xl">
            {t("no_search_results")}
          </p>
        )}
      </Modal>
    </React.Fragment>
  );
};

const WrongTitleMobile: React.FC<WrongTitleProps> = ({
  sourceId,
  mediaType,
  anilist,
}) => {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, isError, error } = useSourceSearch(
    {
      anilist,
      sourceId,
      mediaType,
      query: searchQuery,
    },
    { enabled: isBottomSheetOpen }
  );

  const queryClient = useQueryClient();

  const bottomSheetRef = useRef<BottomSheetRef>(null);

  const handleOpen = useCallback(() => {
    bottomSheetRef.current?.open();

    setIsBottomSheetOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsBottomSheetOpen(false);
  }, []);

  const handleInputChange = debounce(
    (e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value),
    500
  );

  const setMediaId = useCallback(
    (result: SearchResult) => {
      const queryKey =
        mediaType === MediaType.Anime
          ? ["anime-id", anilist.id, sourceId]
          : ["manga-id", anilist.id, sourceId];
      const updateResult =
        mediaType === MediaType.Anime
          ? { animeId: result.id }
          : { mangaId: result.id };

      queryClient.setQueryData(queryKey, updateResult);

      bottomSheetRef?.current?.close();
    },
    [anilist.id, mediaType, queryClient, sourceId]
  );

  return (
    <React.Fragment>
      <p
        onClick={handleOpen}
        className="text-right cursor-pointer font-semibold underline"
      >
        Wrong title?
      </p>

      <BottomSheet onClose={handleClose} ref={bottomSheetRef}>
        <Input
          containerInputClassName="border border-white/80"
          LeftIcon={AiOutlineSearch}
          onChange={handleInputChange}
          defaultValue={null}
          placeholder={anilist.title.english || anilist.title.romaji}
        />

        <h1 className="font-semibold text-2xl my-8">
          Search result for:{" "}
          <i className="italic">
            {searchQuery || anilist.title.english || anilist.title.romaji}
          </i>
        </h1>

        {isLoading ? (
          <ListSkeleton />
        ) : isError ? (
          <p className="text-center font-bold text-xl">
            Something went wrong ({error.message})
          </p>
        ) : data?.length ? (
          <List data={data}>
            {(node) => (
              <SearchResultCard
                className="cursor-pointer"
                data={node}
                onClick={() => setMediaId(node)}
              />
            )}
          </List>
        ) : (
          <p className="text-center font-bold text-xl">No results</p>
        )}
      </BottomSheet>
    </React.Fragment>
  );
};
export default WrongTitle;
