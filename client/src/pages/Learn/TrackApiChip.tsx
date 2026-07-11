import { Link } from "@tanstack/react-router";
import { useApiForLink } from "../../hooks/useApiList";

interface Props {
  apiLink: string;
}

const TrackApiChip = ({ apiLink }: Props) => {
  const api = useApiForLink(apiLink);

  if (api) {
    return (
      <Link className="learn-chip" to="/api-list/$id" params={{ id: api.name }}>
        runs on {api.metaData.title}
      </Link>
    );
  }

  return <span className="learn-chip">runs on {apiLink}</span>;
};

export default TrackApiChip;
