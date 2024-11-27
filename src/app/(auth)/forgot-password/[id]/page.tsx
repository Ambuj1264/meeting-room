"use client";
import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { errorToast, successToast } from "@/utility/toast";

const ForgetFinalPage = () => {
  const { id } = useParams();

  useEffect(() => {
    const handleReset = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/users/checkTokenIsValid/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          successToast(data.message);
        }
      } catch (error) {
        console.log(error);
        errorToast("Token is not valid");
      }
    };

    handleReset();
  }, [id]);
  return <div>hhh</div>;
};

export default ForgetFinalPage;
