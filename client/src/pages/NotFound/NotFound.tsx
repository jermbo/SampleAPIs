import React from "react";

interface Props {}

const NotFound: React.FC<Props> = () => {
  return (
    <div className="page -not-found">
      <code>
        {`{
  samplesAPI: {
    error: "404 Page not Found"
    action: "Navigate back home and try again"
  }
}`}
      </code>
    </div>
  );
};

export default NotFound;
