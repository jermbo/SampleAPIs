import React, { lazy, Suspense } from "react";

const LazyStyleGuide = lazy(() => import("./StyleGuide"));

const StyleGuide = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode }) => (
  <Suspense fallback={null}>
    <LazyStyleGuide {...props} />
  </Suspense>
);

export default StyleGuide;
