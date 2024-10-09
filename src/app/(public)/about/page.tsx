import Image from "next/image";
import React from "react";
import appointmentImage from "../../../../public/appointment-booking-mobile-concept.png";
import { HERO_ACTION_BUTTON, HERO_HEADING } from "../../../utility/constant";

const About = () => {
  return (
    <div className="flex flex-col-reverse lg:flex-row justify-between items-center m-10 p-4 rounded-lg">
      {/* Text Section */}
      <div
        className="lg:w-1/2 flex flex-col justify-center items-center text-center mb-6 lg:mb-0"
        data-aos="fade-right"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold text-primary">
            About Us
        </h1>

        {/* Meeting Description Paragraph */}
        <p className="text-lg sm:text-xl md:text-2xl lg:text-xl mt-4 text-justify">
          Welcome to Meeting Room, the ultimate solution for seamless conference
          room and meeting space bookings. Whether you're managing a bustling
          office or organizing an event in any location, our app simplifies the
          process of reserving the perfect space. At Meeting Room, we understand
          that finding the right venue can be time-consuming, which is why we’ve
          designed an intuitive platform to streamline your room booking
          experience.
        </p>
        <p className="text-lg sm:text-xl md:text-2xl lg:text-xl mt-4 text-justify">
          With a user-friendly interface, customizable features, and real-time
          availability, Meeting Room ensures you never miss out on securing a
          spot for your next meeting or gathering. From corporate boardrooms to
          creative co-working spaces, we connect you to a variety of options,
          making room management hassle-free.
        </p>
       
       
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
  );
};

export default About;
