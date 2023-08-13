import UploadContainer from "@/components/features/UploadContainer";
import UploadLayout from "@/components/layouts/UploadLayout";
import Card from "@/components/shared/Card";
import Head from "@/components/shared/Head";
import Input from "@/components/shared/Input";
import InView from "@/components/shared/InView";
import List from "@/components/shared/List";
import ListSkeleton from "@/components/skeletons/ListSkeleton";
import withUser from "@/hocs/withUser";
import useBrowseAnime from "@/hooks/useBrowseAnime";
import { MediaSort } from "@/types/anilist";
import { debounce } from "@/utils";
import { User } from "@supabase/supabase-js";
import React, { useCallback, useMemo, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";

interface Props {
  user: User;
}

const CreateUploadAnimePage: React.FC<Props> = () => {
  const [keyword, setKeyword] = useState("");

  const {
    data,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isError,
  } = useBrowseAnime({ keyword, sort: MediaSort.Trending_desc });

  const handleFetch = useCallback(() => {
    if (isFetchingNextPage || !hasNextPage) return;

    fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const handleInputChange = debounce(
    (e: React.ChangeEvent<HTMLInputElement>) => setKeyword(e.target.value),
    500
  );

  const totalData = useMemo(
    () => data?.pages.flatMap((el) => el.media),
    [data?.pages]
  );

  return (
    <UploadContainer>
      <Head title="Anime" />

      <h1 className="text-4xl font-semibold mb-8">Anime</h1>

      <Input
        containerInputClassName="border border-white/80"
        LeftIcon={AiOutlineSearch}
        onChange={handleInputChange}
        defaultValue={keyword}
        label="Search"
        containerClassName="w-full md:w-1/3 mb-8"
      />

      {!isLoading ? (
        <React.Fragment>
          <List data={totalData}>
            {(data) => <Card data={data} redirectUrl={`/anime/${data.id}`} />}
          </List>

          {isFetchingNextPage && !isError && (
            <div className="mt-4">
              <ListSkeleton />
            </div>
          )}

          {((totalData?.length && !isFetchingNextPage) || hasNextPage) && (
            <InView onInView={handleFetch} />
          )}

          {!hasNextPage && !!totalData?.length && (
            <p className="mt-8 text-2xl text-center">No results</p>
          )}
        </React.Fragment>
      ) : (
        <ListSkeleton />
      )}
    </UploadContainer>
  );
};

export default CreateUploadAnimePage;

export const getServerSideProps = withUser();

// @ts-ignore
CreateUploadAnimePage.getLayout = (children) => (
  <UploadLayout>{children}</UploadLayout>
);
