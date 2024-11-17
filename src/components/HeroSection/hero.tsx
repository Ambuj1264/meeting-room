"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import appointmentImage from "../../../public/appointment-booking-with-smartphone.png";
import {
  HERO_ACTION_BUTTON,
  HERO_DESCRIPTION,
  HERO_HEADING,
} from "../../utility/constant";
import { useRouter } from "next/navigation";
import HeroTableForAllBooking from "../table/HerorTableForAllBooking";
import Cookies from "js-cookie";
import { Button } from "antd";
import LiveTable from "../table/LiveTable";
const Hero = () => {
  const router = useRouter();
  const checkout = (checkoutUrl: string) => {
    router.push(checkoutUrl);
  };

  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userToken = Cookies.get("userToken");
      // const userData = Cookies.get("userInfo");
      setIsUserLoggedIn(!!userToken);
      // setUserInfo(userData ? JSON.parse(userData) : { name: "", email: "" });
    }
  }, []);

  return (
    <>
      <div className="flex flex-col-reverse lg:flex-row justify-between items-center m-10 p-4 rounded-lg h-screen">
        {/* Text Section */}
        <div
          className="lg:w-1/2 flex flex-col justify-center items-center text-center mb-6 lg:mb-0"
          data-aos="fade-right"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold text-primary">
            {HERO_HEADING}
          </h1>

          {/* Meeting Description Paragraph */}
          <p className="text-lg sm:text-xl md:text-2xl lg:text-xl mt-4 max-w-md text-justify">
            {HERO_DESCRIPTION}
          </p>

          {/* Call to Action Button */}
          <button
            className="bg-primary text-white py-2 px-4 rounded-lg mt-8 "
            onClick={() => checkout("/main")}
          >
            {HERO_ACTION_BUTTON}
          </button>
        </div>

        {/* Image Section */}
        <div className="lg:w-1/2 flex justify-center items-center ">
          <Image
            src={appointmentImage}
            data-aos="fade-left"
            alt="Hero"
            width={500}
            height={500}
            className="w-full h-auto max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl fade-left"
          />
        </div>
      </div>

      <div className="m-20">
        {isUserLoggedIn ? (
          <>
            <div className=" m-auto lg:w-1/2 w-3/4">
              <div className=" p-4 border border-gray-300  rounded-lg shadow-2xl">
                <div className="flex justify-center items-center ">
                  <h4 className="text-2xl font-bold text-primary">
                    Show Live Meeting Status
                  </h4>
                </div>
              </div>
            </div>
            <br />
            <LiveTable />
            <br />
            <div className=" m-auto lg:w-1/2 w-3/4">
              <div className=" p-4 border border-gray-300  rounded-lg shadow-2xl">
                <div className="flex justify-center items-center ">
                  <h4 className="text-2xl font-bold text-primary">
                    Show Upcoming Meetings
                  </h4>
                </div>
              </div>
            </div>
            <br />
            <HeroTableForAllBooking />{" "}
            <div className="postion-absolute bottom-0">
              <Button type="primary" onClick={() => checkout("/showdata")}>
                Show All Data
              </Button>
            </div>
          </>
        ) : null}
      </div>
    </>
  );
};

export default Hero;
