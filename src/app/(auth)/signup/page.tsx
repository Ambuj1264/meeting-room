"use client";
import React from "react";
import { Button, Input } from "@nextui-org/react";
import Link from "next/link";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// Generate a unique ID for each meeting room (you can use libraries like uuid for this)
const generateId = () => `room_${Math.random().toString(36).substr(2, 9)}`;

const SignUp = () => {
  // Yup validation schema
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    company: Yup.string()
      .required("Company name is required"),
    numberofmeetingroom: Yup.number()
      .required("Number of meeting rooms is required")
      .min(1, "Number of meeting rooms should be at least 1")
      .max(10, "Number of meeting rooms should be less than or equal to 10"),
    meetingRooms: Yup.array()
      .of(
        Yup.object().shape({
          name: Yup.string().required("Meeting room name is required"),
        })
      )
      .min(1, "At least 1 meeting room is required"),
  });

  // Initial form values
  const initialValues = {
    email: "",
    password: "",
    company: "",
    numberofmeetingroom: '', // Default to 1 meeting room
    meetingRooms: [], // This will store an array of objects with id and name
  };

  // Form submit handler
  const onSubmit = (values: any) => {
    console.log("Form data", values);
    // Handle form submission here
  };

  return (
    <div className="m-auto">
      <div className="flex justify-center items-center h-auto overflow-y-auto z-10 mt-24">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ values, setFieldValue, errors, touched }) => (
            <Form className="flex flex-col gap-7 p-10 border border-gray-300 rounded-lg shadow-lg lg:w-1/3 md:w-1/2 w-full">
              <h1 className="text-3xl font-bold text-primary">Sign Up</h1>

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

              <div className="flex flex-col">
                <Field
                  name="password"
                  as={Input}
                  type="password"
                  label="Password"
                  placeholder="Enter your password"
                  error={errors.password && touched.password}
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1 mx-2 min-h-5"
                />
              </div>

              <div className="flex flex-col">
                <Field
                  name="company"
                  as={Input}
                  type="text"
                  label="Company Name"
                  placeholder="Enter your company name"
                  error={errors.company && touched.company}
                />
                <ErrorMessage
                  name="company"
                  component="div"
                  className="text-red-500 text-sm mt-1 mx-2 min-h-5"
                />
              </div>

              <div className="flex flex-col">
                <Field
                  name="numberofmeetingroom"
                  as={Input}
                  type="number"
                  label="Number of Meeting Rooms"
                  placeholder="Number of Meeting Rooms"
                  onChange={(e: any) => {
                    const numRooms = parseInt(e.target.value) || 0;
                    setFieldValue("numberofmeetingroom", numRooms);

                    // Generate an array of objects with id and empty name
                    setFieldValue(
                      "meetingRooms",
                      Array.from({ length: numRooms }, () => ({
                        id: generateId(),
                        name: "",
                      }))
                    );
                  }}
                  error={errors.numberofmeetingroom && touched.numberofmeetingroom}
                />
                <ErrorMessage
                  name="numberofmeetingroom"
                  component="div"
                  className="text-red-500 text-sm mt-1 mx-2 min-h-5"
                />
              </div>

              {/* Dynamic inputs for meeting rooms */}
              {values.meetingRooms.length > 0 && values.meetingRooms.length < 11 && (
                <div>
                  <h3 className="text-lg font-semibold mt-4">Meeting Rooms:</h3>
                  {values.meetingRooms.map((room:any, index) => (
                    <div key={room.id} className="flex flex-col mt-2">
                      <Field
                        name={`meetingRooms[${index}].name`}
                        as={Input}
                        type="text"
                        label={`Meeting Room ${index + 1} Name`}
                        placeholder={`Enter name for meeting room ${index + 1}`}
                      />
                      <ErrorMessage
                        name={`meetingRooms[${index}].name`}
                        component="div"
                        className="text-red-500 text-sm mt-1 mx-2 min-h-5"
                      />
                    </div>
                  ))}
                </div>
              )}

              <Button type="submit" color="primary" variant="shadow">
                Sign Up
              </Button>
              <p>
                Already have an account?{" "}
                <Link
                  className="text-primary cursor-pointer font-medium"
                  href="/login"
                >
                  Login
                </Link>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default SignUp;
