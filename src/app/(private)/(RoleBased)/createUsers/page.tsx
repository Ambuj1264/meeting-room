"use client";
import React, { useState, useEffect } from "react";
import { Button, Input } from "@nextui-org/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { errorToast, successToast } from "@/utility/toast";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import AllUserDataForCompany from "@/components/table/AllUserDataForCompany";

const CreateUser = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const userInfo = Cookies.get("userInfo")
      ? JSON.parse(Cookies.get("userInfo") || "")
      : null;
    setUserData(userInfo);
  }, []);

  // Yup validation schema
  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
  });

  // Initial form values
  const initialValues = {
    name: "",
    email: "",
    password: "",
    role: "user",
    company: userData?.companyId || "", // set company dynamically based on userData
  };

  // Form submit handler
  const onSubmit = (values: any, { resetForm }: { resetForm: () => void }) => {
    setIsLoading(true);
    console.log(values, "values============");
    // Handle form submission here
    const sendToDatabase = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/users/create`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          }
        );
        const data = await response.json();
        setIsLoading(false);
        if (data.status !== "SUCCESS") {
          if (data.message === "Email already exists") {
            return errorToast("Email already exists");
          }
          errorToast(data.message);
        } else {
          successToast(data.message);
          window.location.reload();
        }
      } catch (error) {
        setIsLoading(false);
        console.log("Error:", error);
      }
    };

    sendToDatabase();
    resetForm();
  };

  return (
    <>
      <div className="m-auto">
        <div className="flex justify-center items-center h-auto overflow-y-auto z-10 mt-24">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            enableReinitialize // reinitialize form values when initialValues changes
          >
            {({ errors, touched }) => (
              <Form className="flex flex-col gap-7 p-10 border border-gray-300 rounded-lg shadow-lg lg:w-1/3 md:w-1/2 w-full">
                <h1 className="text-3xl font-bold text-primary">Create Team</h1>

                <div className="flex flex-col">
                  <Field
                    name="name"
                    as={Input}
                    type="text"
                    label="Name"
                    placeholder="Enter your name"
                    error={errors.name && touched.name}
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-500 text-sm mt-1 mx-2 min-h-5"
                  />
                </div>
                <div className="flex flex-col">
                  <Field
                    name="email"
                    as={Input}
                    type="email"
                    label="Email"
                    placeholder="Enter your email"
                    error={errors.email && touched.email}
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm mt-1 mx-2 min-h-5"
                  />
                </div>

                <div className="flex flex-col relative">
                  <Field
                    name="password"
                    as={Input}
                    type={showPassword ? "password" : "text"}
                    label="Password"
                    placeholder="Enter your password"
                    error={errors.password && touched.password}
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
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm mt-1 mx-2 min-h-5"
                  />
                </div>

                <Button
                  type="submit"
                  color="primary"
                  variant="shadow"
                  isLoading={isLoading}
                >
                  Create
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      <div className="m-20">
        <h3 className="text-2xl font-bold text-primary">All Users</h3>{" "}
        <AllUserDataForCompany />
      </div>
    </>
  );
};

export default CreateUser;
