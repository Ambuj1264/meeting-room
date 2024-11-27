"use client";
import React, { useState } from "react";
import { Button, Input } from "@nextui-org/react";
import Link from "next/link";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { errorToast, successToast } from "../../../utility/toast";
import { useDispatch } from "react-redux";
import { increment } from "../../../utility/redux/slices/feature/counter";
import { login } from "../../../utility/redux/slices/feature/auth";
import { PiRocketLaunchThin } from "react-icons/pi";
const Login = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    }),
    onSubmit: async (values, { setSubmitting, setStatus, resetForm }) => {
      setSubmitting(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/users/sentMail`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          }
        );

        const data = await response.json();
        setStatus({ success: data.status === "SUCCESS" });
        if (data.status === "SUCCESS") {
          successToast("Mail send Successfully please check your mail");
          resetForm();
        } else {
          errorToast(data.message);
        }
      } catch (error: any) {
        errorToast("Something went wrong: " + error.message);
        setStatus({ success: false });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="flex w-full justify-center items-center h-screen">
      <form
        onSubmit={formik.handleSubmit}
        className="flex flex-col gap-7 p-10 border border-gray-300 rounded-lg shadow-lg lg:w-1/3 md:w-1/2 w-full"
      >
        <h1 className="text-3xl font-bold text-primary">Forgot Password</h1>
        <div>
          <Input
            type="email"
            label="Email"
            placeholder="Enter your email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="email"
          />
          <p
            className="text-red-500 text-sm mt-1 mx-1"
            style={{ minHeight: "20px" }}
          >
            {formik.touched.email && formik.errors.email
              ? formik.errors.email
              : ""}
          </p>
        </div>
        <Button
          type="submit"
          color="primary"
          variant="shadow"
          disabled={formik.isSubmitting || !formik.isValid}
        >
          Sent Mail{" "}
          <span className="font-bold text-2xl">
            <PiRocketLaunchThin />
          </span>
        </Button>
      </form>
    </div>
  );
};

export default Login;
