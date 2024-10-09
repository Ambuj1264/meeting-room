"use client";
import React from "react";
import { Button, Input } from "@nextui-org/react";
import Link from "next/link";
import { useFormik } from "formik";
import * as Yup from "yup";

const Login = () => {
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
    onSubmit: (values) => {
      // Handle form submission
      console.log(values);
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
          {/* Added minHeight to prevent form size change */}
          <p
            className="text-red-500 text-sm mt-1 mx-1"
            style={{ minHeight: "20px" }}
          >
            {formik.touched.email && formik.errors.email ? formik.errors.email : ""}
          </p>
        </div>
        <div>
          <Input
            type="password"
            label="Password"
            placeholder="Enter your password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="password"
          />
          {/* Added minHeight to prevent form size change */}
          <p
            className="text-red-500 text-sm mt-1"
            style={{ minHeight: "20px" }}
          >
            {formik.touched.password && formik.errors.password ? formik.errors.password : ""}
          </p>
        </div>
        <Button
          type="submit"
          color="primary"
          variant="shadow"
          disabled={formik.isSubmitting || !formik.isValid}
        >
          Login
        </Button>
        <p>
          Don't have an account?{" "}
          <Link
            className="text-primary cursor-pointer font-medium"
            href="/signup"
          >
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
