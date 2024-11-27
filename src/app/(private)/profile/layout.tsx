import React, { Suspense } from "react";
import Loader from "@/utility/loader/loading";
const LayoutDAta = ({ children }: { children: React.ReactNode }) => {
  return <Suspense fallback={<Loader />}>{children}</Suspense>;
};

export default LayoutDAta;
