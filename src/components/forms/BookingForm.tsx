"use client";
import React, { useState } from "react";
import { ErrorMessage, Field, useFormik } from "formik";
import * as Yup from "yup";
import { Tabs, Tab, Input, Button, Card, CardBody, Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { m } from "framer-motion";
import { errorToast, successToast } from "../../utility/toast";

export default function 
BookingForm() {
  const [selected, setSelected] = useState<string | number>(
    "Book a Meeting Room"
  );
  const animals = [
    { label: "Cat", value: "cat", description: "The second most popular pet in the world" },
    { label: "Dog", value: "dog", description: "The most popular pet in the world" },
    //...other animals
  ];


  // Convert UTC time to IST (UTC + 5:30)
  const getISTTime = () => {
    const currentTime = new Date();
    const offset = currentTime.getTimezoneOffset(); // Get the current timezone offset in minutes
    const istOffset = 330; // IST offset is +5:30 or 330 minutes
    const totalOffset = istOffset + offset;
    const istTime = new Date(currentTime.getTime() + totalOffset * 60 * 1000);
    return istTime.toTimeString().slice(0, 5); // Return the time in HH:MM format
  };
  const startOfToday = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  };
  // Formik configuration
  const formik = useFormik({
    initialValues: {
      email: "",
      date: "",
      startTime: "",
      endTime: "",
      meetingRoom: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
        date: Yup.date()
        .required("Date is required")
        .min(startOfToday(), "Date cannot be in the past")
        .typeError("Invalid date format"),
      startTime: Yup.string()
        .required("Start time is required")
        .test(
          "is-after-current-time",
          "Start time cannot be in the past",
          function (value) {
            const { date } = this.parent;
            if (
              date ===
              new Date().toLocaleDateString("en-CA", {
                timeZone: "Asia/Kolkata",
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })
            ) {
              // If the selected date is today, compare the current time with the selected startTime
              const istTime = getISTTime(); // Get the IST time
              return value > istTime; // Compare the selected startTime with IST
            }
            return true; // For dates other than today, no validation is needed
          }
        ),
      endTime: Yup.string()
        .required("End time is required")
        .test(
          "is-greater",
          "End time must be later than start time",
          function (value) {
            const { startTime } = this.parent;
            // Only validate if both startTime and endTime are present
            if (startTime && value) {
              return value > startTime;
            }
            return true;
          }
        ),
      meetingRoom: Yup.string().required("Meeting room is required"),
    }),
    onSubmit: async (values) => {
      if (values) {
        console.log(values, "Form values submitted");
        try {
          const response = await fetch("http://localhost:8000"+"/booking/create", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          });
          const data = await response.json();
          console.log(data, "Data sent to server");
          if(data.status !== "SUCCESS") {
            errorToast(data.message);
          } else {
            successToast(data.message);
            formik.resetForm();
          }
        } catch (error: any) {
          console.log(error.message);
        }
      }
    },
  });

  return (
    <div className="flex justify-center items-center  flex-col w-full">
      <Card className="max-w-full lg:w-1/2 w-3/4">
        <CardBody className="overflow-hidden">
          <Tabs
            fullWidth
            size="md"
            aria-label="Tabs form"
            selectedKey={selected}
            onSelectionChange={setSelected}
          >
            <Tab key="1" title="Book a Meeting Room">
              <form
                className="flex flex-col gap-4"
                onSubmit={formik.handleSubmit}
              >
                {/* Email input */}
                <Input
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isRequired
                  label="Email"
                  placeholder="Enter your email"
                  type="text"
                />
                {formik.touched.email && formik.errors.email ? (
                  <span className="text-red-500 px-3 text-xs">
                    {formik.errors.email}
                  </span>
                ) : null}

                {/* Date input */}
                <Input
                  name="date"
                  value={formik.values.date}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isRequired
                  label="Date"
                  placeholder="Select date"
                  type="date"
                  min={new Date().toLocaleDateString("en-CA", {
                    timeZone: "Asia/Kolkata",
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })} // Set the minimum date to today
                />
                {formik.touched.date && formik.errors.date ? (
                  <span className="text-red-500 px-3 text-xs">
                    {formik.errors.date}
                  </span>
                ) : null}

                {/* Start time input */}
                <Input
                  name="startTime"
                  value={formik.values.startTime}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isRequired
                  label="Start Time"
                  placeholder="Select start time"
                  type="time"
                />
                {formik.touched.startTime && formik.errors.startTime ? (
                  <span className="text-red-500 px-3 text-xs">
                    {formik.errors.startTime}
                  </span>
                ) : null}

                {/* End time input */}
                <Input
                  name="endTime"
                  value={formik.values.endTime}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isRequired
                  label="End Time"
                  placeholder="Select end time"
                  type="time"
                />
                {formik.touched.endTime && formik.errors.endTime ? (
                  <span className="text-red-500 px-3 text-xs">
                    {formik.errors.endTime}
                  </span>
                ) : null}
         <div className="flex flex-col">
         
                <Autocomplete
                  label="Meeting Room"
                  placeholder="Select a meeting room"
                  defaultItems={animals}
                  onSelectionChange={(selectedValue) => formik.setFieldValue("meetingRoom", selectedValue)}
                >
                  {(item) => (
                    <AutocompleteItem key={item.value} value={item.value}>
                      {item.label}
                    </AutocompleteItem>
                  )}
                </Autocomplete>
                {formik.touched.meetingRoom && formik.errors.meetingRoom ? (
                  <span className="text-red-500 px-3 text-xs">
                    {formik.errors.meetingRoom} 
                  </span>
                ) : null}
            </div>
                {/* Submit button */}
                <div className="flex gap-2 justify-end">
                  <Button fullWidth color="primary" type="submit">
                    Book Now
                  </Button>
                </div>
              </form>
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    </div>
  );
}
