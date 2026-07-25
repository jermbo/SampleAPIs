import { Link } from "@tanstack/react-router";
import { tracksForApi } from "../../challenges";
import type { APIData } from "../../utils/Interfaces";

interface Props {
  api: APIData;
}

const ApiLearnBanners = ({ api }: Props) => {
  const tracks = tracksForApi(api.link);

  return (
    <>
      {tracks.map((track) => (
        <Link
          key={track.id}
          className="learn-banner"
          to="/learn/$trackId/$step"
          params={{ trackId: track.id, step: "1" }}
        >
          This API has a practice track: {track.title} →
        </Link>
      ))}
    </>
  );
};

export default ApiLearnBanners;
