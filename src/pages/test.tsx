import LocaleEpisodeSelector from "@/components/features/anime/Player/LocaleEpisodeSelector";
import useEpisodes from "@/hooks/useEpisodes";
import useKitsuEpisodes from "@/hooks/useKitsuEpisodes";
import React from "react";

const TestPage = () => {
  const { data: episodes, isLoading } = useEpisodes(127230, true);

  console.log(episodes);

  return (
    <div className="my-24 w-2/3 mx-auto">
      <LocaleEpisodeSelector episodes={episodes} />
    </div>
  );
};

export default TestPage;
