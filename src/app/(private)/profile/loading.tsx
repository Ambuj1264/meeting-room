import React, { Suspense } from "react";
import Loader from "@/utility/loader/loading";
const Loading = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Loader />
    </Suspense>
  );
};

export default Loading;
