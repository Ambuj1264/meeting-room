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
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { RiLoginCircleFill } from "react-icons/ri";
const Login = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values, { setSubmitting, setStatus, resetForm }) => {
      setSubmitting(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/users/login`,
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
          Cookies.set("userToken", data.data.token, { expires: 1 });
          Cookies.set("userInfo", JSON.stringify(data.data), { expires: 1 });
          successToast("Login Successful");
          resetForm();
          dispatch(increment());
          dispatch(login());
          router.push("/main");
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
        <h1 className="text-3xl font-bold text-primary">Login</h1>
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
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            label="Password"
            placeholder="Enter your password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="password"
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
          <p className="text-red-500 text-sm mt-1" style={{ minHeight: "5px" }}>
            {formik.touched.password && formik.errors.password
              ? formik.errors.password
              : ""}
          </p>
        </div>
        <Button
          type="submit"
          color="primary"
          variant="shadow"
          disabled={formik.isSubmitting || !formik.isValid}
        >
          Login <RiLoginCircleFill />
        </Button>
        <p>
          Don&apos;t have an account?{" "}
          <Link
            className="text-primary cursor-pointer font-medium"
            href="/signup"
          >
            Sign up
          </Link>
        </p>
        <Link
          className="text-primary cursor-pointer font-medium"
          href="/forgetPassword"
        >
          Forgot Password
        </Link>
      </form>
    </div>
  );
};

export default Login;
