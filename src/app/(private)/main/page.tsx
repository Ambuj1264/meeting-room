"use client";
import { Button } from "@nextui-org/button";
import React, { Suspense } from "react";
import BookingForm from "../../../components/forms/BookingForm";
import { useRouter } from "next/navigation";
import Loader from "../../../utility/loader/loading";
import { useSelector } from "react-redux";


const Main = () => {
  const {isAuthenticated} = useSelector((state:any)=>state.auth);
  const router = useRouter();
  const sumbitData = () => {
    console.log("data submitted");
    router.push("/showdata");
  };
  return (
    isAuthenticated &&
    <Suspense fallback={<Loader />}>
    <div className="flex flex-col flex-wrap">
      <div  className="mt-20 ">
      <div className=" m-auto lg:w-1/2 w-3/4">
        <div className=" p-8 border border-gray-300  rounded-lg shadow-2xl">
          <div className="flex justify-between items-center ">
            <h4 className="text-2xl font-bold text-primary">
              See All Bookings
            </h4>
            <Button className="bg-success text-white py-2 px-6 rounded-lg hover:bg-success-dark transition-colors duration-300" onClick={sumbitData}>
              See All
            </Button>
          </div>
        </div>
      </div>
      </div>
      {/* form here */}
      <BookingForm />
    </div>
    </Suspense>
  );
};

export default Main;
