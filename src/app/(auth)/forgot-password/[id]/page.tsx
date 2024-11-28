"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button, Input } from "@nextui-org/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { errorToast, successToast } from "@/utility/toast";
import { useDispatch } from "react-redux";
import { increment } from "@/utility/redux/slices/feature/counter";
import { login } from "@/utility/redux/slices/feature/auth";

import { BsFillSendFill } from "react-icons/bs";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const ForgetFinalPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { id } = useParams();
  const [tokenIsNotValid, setTokenIsNotValid] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      newPassword: Yup.string()
        .min(6, "New password must be at least 6 characters")
        .required("New password is required"),
      confirmPassword: Yup.string()
        .min(6, "Confirm password must be at least 6 characters")
        .required("Confirm password is required")
        .oneOf([Yup.ref("newPassword")], "Passwords do not match"),
    }),
    onSubmit: async (values, { setSubmitting, setStatus, resetForm }) => {
      setSubmitting(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/users/resetPassword/${id}`,
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
          successToast("Password Reset Successful");
          resetForm();
          router.push("/login");
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
          successToast(data.message);
        } else {
          setTokenIsNotValid(true);
        }
      } catch (error) {
        console.log(error);
        errorToast("Something went wrong");
      }
    };

    handleReset();
  }, [id]);

  if (tokenIsNotValid) {
    errorToast("Token is not valid");
    return null;
  }

  return (
    <div className="flex w-full justify-center items-center h-screen">
      <form
        onSubmit={formik.handleSubmit}
        className="flex flex-col gap-7 p-10 border border-gray-300 rounded-lg shadow-lg lg:w-1/3 md:w-1/2 w-full"
      >
        <h1 className="text-3xl font-bold text-primary">Change Password</h1>

        <div>
          <Input
            type="password"
            label="New Password"
            placeholder="Enter your new password"
            value={formik.values.newPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="newPassword"
          />
          <p className="text-red-500 text-sm mt-1 mx-1">
            {formik.touched.newPassword && formik.errors.newPassword
              ? formik.errors.newPassword
              : ""}
          </p>
        </div>

        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            label="Confirm Password"
            placeholder="Confirm your password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="confirmPassword"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          >
            {showPassword ? (
              <AiFillEyeInvisible size={20} />
            ) : (
              <AiFillEye size={20} />
            )}
          </button>
          <p className="text-red-500 text-sm mt-1 mx-1">
            {formik.touched.confirmPassword && formik.errors.confirmPassword
              ? formik.errors.confirmPassword
              : ""}
          </p>
        </div>

        <Button
          type="submit"
          color="primary"
          variant="shadow"
          disabled={formik.isSubmitting || !formik.isValid}
        >
          Submit <BsFillSendFill />
        </Button>
      </form>
    </div>
  );
};

export default ForgetFinalPage;
