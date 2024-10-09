"use client";
import React, { useEffect } from "react";
import "aos/dist/aos.css";
import AOS from "aos";
interface ChildInterface {
  children: React.ReactNode;
}
const Aosanimation = ({ children }: ChildInterface) => {
  useEffect(() => {
    AOS.init({
      easing: "ease-out-cubic",
      duration: 1000,
    });
  }, []);
  return <>{children}</>;
};

export default Aosanimation;
