"use client";
import React from "react";
import { Button, Input, Textarea } from "@nextui-org/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { errorToast, successToast } from "../../../utility/toast";

interface ContactData {
  email: string;
  name: string;
  message: string;
}

async function ContactAPI(newPostData: ContactData): Promise<any> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/contact/us`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newPostData),
  });

  if (!response.ok) {
    throw new Error("Failed to send message");
  }

  return response.json();
}

const Contact = () => {
  const mutation = useMutation({
    mutationFn: ContactAPI,
    onSuccess: async () => {
      formik.resetForm();
      successToast("Message sent successfully");
    },
    onError: (error: Error) => {
      errorToast(error.message);
    },
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      name: "",
      message: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      name: Yup.string().required("Name is required"),
      message: Yup.string().required("Message is required"),
    }),
    onSubmit: (values: ContactData) => {
      mutation.mutate(values, {
        onSettled: () => {
          formik.setSubmitting(false); // Allow re-submission after the request completes
        },
      });
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
            placeholder="Enter your name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="name"
          />
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
          isLoading ={mutation.isPending}
        >
          Submit
        </Button>
      </form>
    </div>
  );
};

export default Contact;
