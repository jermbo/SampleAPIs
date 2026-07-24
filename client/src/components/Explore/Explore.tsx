import React, { useState } from "react";
import ShapeViewer from "./ShapeViewer";
import QueryBuilder from "./QueryBuilder";
import { exploreCaret, exploreTabClassName } from "./labels";
import "./Explore.css";

type ExploreTab = "shape" | "query";

interface Props {
  /** Active endpoint URL — identity for both tabs' data. */
  url: string;
  /** Endpoint name; names the copied TypeScript interface. */
  endpoint: string;
  /** Loads a fetch snippet for a composed URL into the Playground. */
  onSendToPlayground: (fullUrl: string) => void;
}

/**
 * "Explore this endpoint" — collapsible panel between the endpoint list and
 * the Playground. Shape and Query share one sample fetch (per-URL cache),
 * and nothing is requested until the panel is opened.
 */
const Explore: React.FC<Props> = ({ url, endpoint, onSendToPlayground }) => {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<ExploreTab>("shape");

  return (
    <section className="explore">
      <button className="explore__toggle" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span className="explore__caret">{exploreCaret(open)}</span>
        <span className="explore__title">Explore this endpoint</span>
        <span className="explore__teaser">
          See its fields and types, or filter, sort, and paginate — no code required.
        </span>
      </button>

      {open && (
        <div className="explore__body">
          <div className="explore__tabs" role="tablist">
            <button
              role="tab"
              aria-selected={tab === "shape"}
              className={exploreTabClassName(tab === "shape")}
              onClick={() => setTab("shape")}
            >
              Shape
            </button>
            <button
              role="tab"
              aria-selected={tab === "query"}
              className={exploreTabClassName(tab === "query")}
              onClick={() => setTab("query")}
            >
              Query
            </button>
          </div>
          {tab === "shape" && <ShapeViewer url={url} endpoint={endpoint} />}
          {tab === "query" && <QueryBuilder url={url} onSendToPlayground={onSendToPlayground} />}
        </div>
      )}
    </section>
  );
};

export default Explore;
