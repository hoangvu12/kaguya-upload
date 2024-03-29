import UploadContainer from "@/components/features/UploadContainer";
import UploadLayout from "@/components/layouts/UploadLayout";
import Button from "@/components/shared/Button";
import CircleButton from "@/components/shared/CircleButton";
import Description from "@/components/shared/Description";
import Link from "@/components/shared/Link";
import Loading from "@/components/shared/Loading";
import PlainCard from "@/components/shared/PlainCard";
import ServerPaginateTable from "@/components/shared/ServerPaginateTable";
import withUser from "@/hocs/withUser";
import useUploadedMedia, {
  getUploadedMedia,
  MediaWithMediaUnit,
} from "@/hooks/useUploadedMedia";
import { Source } from "@/types";
import { MediaType } from "@/types/anilist";
import { supabaseClient, User } from "@supabase/auth-helpers-nextjs";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import { AiOutlineEdit } from "react-icons/ai";
import { useQueryClient } from "react-query";
import { Column } from "react-table";

interface UploadAnimePageProps {
  user: User;
  sourceId: string;
}

const columns: Column<MediaWithMediaUnit<MediaType.Anime>>[] = [
  {
    Header: "Image",
    Cell: ({ cell }) => {
      const originalCell = cell.row.original;
      const title = originalCell.title.userPreferred;

      return (
        <div className="p-2">
          <PlainCard src={originalCell.coverImage.extraLarge} alt={title} />
        </div>
      );
    },
    accessor: "coverImage",
  },
  {
    Header: "Title",
    Cell: ({ cell }) => {
      const originalCell = cell.row.original;

      const title = originalCell.title.userPreferred;

      return (
        <div className="px-6 py-4">
          <p className="line-clamp-5">{title}</p>
        </div>
      );
    },
    accessor: "title",
  },
  {
    Header: "Description",
    accessor: "description",
    Cell: ({ cell }) => {
      return (
        <div className="px-6 py-4">
          <Description
            className="line-clamp-5 overflow-hidden text-white"
            description={cell.value}
          />
        </div>
      );
    },
  },
  {
    Header: "Uploaded episodes",
    accessor: "episodes",
    Cell: ({ cell }) => {
      const originalCell = cell.row.original;

      return (
        <div className="px-6 py-4">
          <p className="line-clamp-5 overflow-hidden">
            {originalCell.totalUploadedEpisodes || 0}/{cell.value || "??"}
          </p>
        </div>
      );
    },
  },
  {
    Header: "Action",
    Cell: ({ cell }) => {
      return (
        <div className="w-full flex items-center justify-center">
          <Link href={`/anime/${cell.value}`}>
            <a>
              <CircleButton secondary LeftIcon={AiOutlineEdit} />
            </a>
          </Link>
        </div>
      );
    },
    accessor: "id",
  },
];

const UploadAnimePage: NextPage<UploadAnimePageProps> = ({ sourceId }) => {
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);

  const queryClient = useQueryClient();

  const { data, isLoading } = useUploadedMedia({
    type: MediaType.Anime,
    page: pageIndex + 1,
    perPage: pageSize,
    sourceId,
  });

  useEffect(() => {
    const options = {
      type: MediaType.Anime,
      page: pageIndex + 2,
      perPage: pageSize,
      sourceId,
    };

    queryClient.prefetchQuery(["uploaded-media", { options }], () =>
      getUploadedMedia(options)
    );
  }, [pageIndex, pageSize, queryClient, sourceId]);

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
  };

  const handlePageIndexChange = (newPageIndex: number) => {
    setPageIndex(newPageIndex);
  };

  return (
    <UploadContainer title="Uploaded Anime list">
      <Button
        primary
        className="absolute -top-2 right-4 md:right-12 lg:right-20 xl:right-28 2xl:right-36"
      >
        <Link href="/anime/create">
          <a>Search Anime</a>
        </Link>
      </Button>

      {isLoading ? (
        <Loading />
      ) : data?.media?.length ? (
        <ServerPaginateTable
          data={data.media}
          columns={columns}
          totalCount={data.total}
          pageIndex={pageIndex}
          pageSize={pageSize}
          onPageSizeChange={handlePageSizeChange}
          onPageIndexChange={handlePageIndexChange}
        />
      ) : (
        <h1 className="text-3xl text-center">
          You haven&apos;t uploaded any Anime.
        </h1>
      )}
    </UploadContainer>
  );
};

export default UploadAnimePage;

export const getServerSideProps = withUser({
  async getServerSideProps(_, user) {
    const { data: sourceAddedByUser, error } = await supabaseClient
      .from<Source>("kaguya_sources")
      .select("id")
      .eq("userId", user.id)
      .single();

    if (error || !sourceAddedByUser?.id) {
      throw error;
    }

    return {
      props: {
        sourceId: sourceAddedByUser.id,
      },
    };
  },
});

// @ts-ignore
UploadAnimePage.getLayout = (children) => (
  <UploadLayout>{children}</UploadLayout>
);
