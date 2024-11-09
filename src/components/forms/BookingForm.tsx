"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Tabs,
  Tab,
  Input,
  Button,
  Card,
  CardBody,
  Autocomplete,
  AutocompleteItem,
} from "@nextui-org/react";
import { errorToast, successToast } from "../../utility/toast";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Loader from "@/utility/loader/loading";
export default function BookingForm() {
  const [selected, setSelected] = useState<string | number>("Book a Meeting Room");
  const [userData, setUserData] = useState<any>(null);
  const [roomData, setRoomData] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const userInfo = Cookies.get("userInfo") ? JSON.parse(Cookies.get("userInfo") || "") : null;
    setUserData(userInfo);

    const fetchRoomData = async () => {
      if (userInfo) {
        try {
          const response = await fetch(`http://localhost:8000/booking/findRoomsByCompanyId/${userInfo.companyId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          const data = await response.json();
          setRoomData(data.data || []);
        } catch (error) {
          console.error("Error fetching room data:", error);
        }
      }
    };

    fetchRoomData();
  }, []);

  const getISTTime = () => {
    const currentTime = new Date();
    const offset = currentTime.getTimezoneOffset();
    const istOffset = 330;
    const totalOffset = istOffset + offset;
    const istTime = new Date(currentTime.getTime() + totalOffset * 60 * 1000);
    return istTime.toTimeString().slice(0, 5);
  };

  const startOfToday = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  };

  const formik = useFormik({
    initialValues: {
      name: userData?.name,
      companyId: userData?.companyId,
      email: userData?.email,
      date: "",
      startTime: "",
      endTime: "",
      meetingId: "",
    },
    enableReinitialize: true, // Enables form to update initial values when userData loads
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Email is required"),
      date: Yup.date()
        .required("Date is required")
        .min(startOfToday(), "Date cannot be in the past")
        .typeError("Invalid date format"),
      startTime: Yup.string()
        .required("Start time is required")
        .test("is-after-current-time", "Start time cannot be in the past", function (value) {
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
            const istTime = getISTTime();
            return value > istTime;
          }
          return true;
        }),
      endTime: Yup.string()
        .required("End time is required")
        .test("is-greater", "End time must be later than start time", function (value) {
          const { startTime } = this.parent;
          return startTime && value ? value > startTime : true;
        }),
      meetingId: Yup.string().required("Meeting room is required"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/booking/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });
        const data = await response.json();
        if (data.status !== "SUCCESS") {
          errorToast(data.message);
        } else {
          successToast(data.message);
          formik.resetForm();
          router.push("/showdata");
        }
      } catch (error) {
        console.error("Submission error:", error);
      }
    },
  });

  return (
    <Suspense fallback={<Loader />}>
    <div className="flex justify-center items-center flex-col w-full">
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
              <form className="flex flex-col gap-4" onSubmit={formik.handleSubmit}>
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
                  })}
                />
                {formik.touched.date && formik.errors.date ? (
                  <span className="text-red-500 px-3 text-xs">{formik.errors.date}</span>
                ) : null}

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
                  <span className="text-red-500 px-3 text-xs">{formik.errors.startTime}</span>
                ) : null}

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
                  <span className="text-red-500 px-3 text-xs">{formik.errors.endTime}</span>
                ) : null}

                <Autocomplete
                  label="Meeting Room"
                  placeholder="Select a meeting room"
                  defaultItems={roomData}
                  onSelectionChange={(selectedValue) =>
                    formik.setFieldValue("meetingId", selectedValue)
                  }
                >
                  {(item: any) => (
                    <AutocompleteItem key={item._id} value={item._id}>
                      {item.name}
                    </AutocompleteItem>
                  )}
                </Autocomplete>
                {formik.touched.meetingId && formik.errors.meetingId ? (
                  <span className="text-red-500 px-3 text-xs">{formik.errors.meetingId}</span>
                ) : null}

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
    </Suspense>
  );
}
