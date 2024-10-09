"use client";
import React from "react";
import { Button, Input, Textarea } from "@nextui-org/react";
import { useFormik } from "formik";
import * as Yup from "yup";

const Contact = () => {
  const formik = useFormik({
    initialValues: {
      email: "",
      name: "",
      message: ""
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      name: Yup.string().required("name is required"),
      message: Yup.string().required("message is required"),
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
        <h1 className="text-3xl font-bold text-primary">Contact</h1>
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
            type="text"
            label="Name"
            placeholder="Enter your Name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="name"
          />
          {/* Added minHeight to prevent form size change */}
          <p
            className="text-red-500 text-sm mt-1"
            style={{ minHeight: "20px" }}
          >
            {formik.touched.name && formik.errors.name ? formik.errors.name : ""}
          </p>
        </div>
        <div>
          <Textarea
            label="Message"
            placeholder="Enter your message"
            value={formik.values.message}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="message"
          />
          {/* Added minHeight to prevent form size change */}
          <p
            className="text-red-500 text-sm mt-1"
            style={{ minHeight: "20px" }}
          >
            {formik.touched.message && formik.errors.message ? formik.errors.message : ""}
          </p>
        </div>
        <Button
          type="submit"
          color="primary"
          variant="shadow"
          disabled={formik.isSubmitting || !formik.isValid}
        >
          Submit
        </Button>
      </form>
    </div>
  );
};

export default Contact;
