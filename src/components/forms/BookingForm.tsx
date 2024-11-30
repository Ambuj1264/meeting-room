import React, { useState, useEffect, Suspense } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Tabs,
  Input,
  Button,
  Card,
  DatePicker,
  TimePicker,
  Select,
  Spin,
} from "antd";
import { errorToast, successToast } from "../../utility/toast";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Loader from "@/utility/loader/loading";

const { TabPane } = Tabs;
const { Option } = Select;

export default function BookingForm() {
  const [selected, setSelected] = useState("1");
  const [userData, setUserData] = useState<any>(null);
  const [roomData, setRoomData] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const userInfo = Cookies.get("userInfo")
      ? JSON.parse(Cookies.get("userInfo") || "")
      : null;
    setUserData(userInfo);

    const fetchRoomData = async () => {
      if (userInfo) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/booking/findRoomsByCompanyId/${userInfo.companyId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
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
    const istOffset = 330;
    const totalOffset = istOffset + currentTime.getTimezoneOffset();
    const istTime = new Date(currentTime.getTime() + totalOffset * 60 * 1000);
    return istTime.toTimeString().slice(0, 5);
  };

  const startOfToday = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  };

  const formik = useFormik({
    initialValues: {
      subject: "",
      name: userData?.name || "",
      companyId: userData?.companyId || "",
      email: userData?.email || "",
      date: "",
      startTime: "",
      endTime: "",
      meetingId: "", // Initially empty
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      subject: Yup.string()
        .required("Subject is required")
        .max(100, "Max length is 100 characters"),
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
            const currentDate = new Date().toISOString().split("T")[0]; // Get today's date in 'yyyy-mm-dd' format
            const currentISTTime = getISTTime();

            if (date === currentDate) {
              if (value <= currentISTTime) {
                return this.createError({
                  message: "Start time cannot be earlier than the current time",
                });
              }
            }
            return true;
          }
        ),
      endTime: Yup.string()
        .required("End time is required")
        .test(
          "is-after-start-time",
          "End time must be later than start time",
          function (value) {
            const { date, startTime } = this.parent;
            const currentDate = new Date().toISOString().split("T")[0];
            const currentISTTime = getISTTime();

            // Check if the date is today and validate the endTime
            if (date === currentDate && value <= currentISTTime) {
              return this.createError({
                message: "End time cannot be earlier than the current time",
              });
            }

            // Check if endTime is after startTime
            if (startTime && value <= startTime) {
              return this.createError({
                message: "End time must be later than start time",
              });
            }
            return true;
          }
        ),
      meetingId: Yup.string().required("Meeting room is required"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/booking/create`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          }
        );
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
          <Tabs
            activeKey={selected}
            onChange={(key) => setSelected(key)}
            centered
          >
            <TabPane tab="Book a Meeting Room" key="1">
              <form
                className="flex flex-col gap-4"
                onSubmit={formik.handleSubmit}
              >
                <Input
                  size="large"
                  name="subject"
                  placeholder="Agenda of Meeting"
                  value={formik.values.subject}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.subject && formik.errors.subject && (
                  <span className="text-red-500 px-3 text-xs">
                    {formik.errors.subject}
                  </span>
                )}
                <DatePicker
                  size="large"
                  name="date"
                  defaultValue={null}
                  onChange={(date, dateString) =>
                    formik.setFieldValue("date", dateString)
                  }
                  onBlur={formik.handleBlur}
                  style={{ width: "100%" }}
                  placeholder="Select date"
                  disabledDate={(current) =>
                    current && current.isBefore(startOfToday(), "day")
                  }
                />
                {formik.touched.date && formik.errors.date && (
                  <span className="text-red-500 px-3 text-xs">
                    {formik.errors.date}
                  </span>
                )}

                <TimePicker
                  size="large"
                  name="startTime"
                  defaultValue={null}
                  onChange={(time, timeString) =>
                    formik.setFieldValue("startTime", timeString)
                  }
                  onBlur={formik.handleBlur}
                  style={{ width: "100%" }}
                  placeholder="Select start time"
                  format="HH:mm"
                />
                {formik.touched.startTime && formik.errors.startTime && (
                  <span className="text-red-500 px-3 text-xs">
                    {formik.errors.startTime}
                  </span>
                )}

                <TimePicker
                  size="large"
                  name="endTime"
                  defaultValue={null}
                  onChange={(time, timeString) =>
                    formik.setFieldValue("endTime", timeString)
                  }
                  onBlur={formik.handleBlur}
                  style={{ width: "100%" }}
                  placeholder="Select end time"
                  format="HH:mm"
                />
                {formik.touched.endTime && formik.errors.endTime && (
                  <span className="text-red-500 px-3 text-xs">
                    {formik.errors.endTime}
                  </span>
                )}

                <Select
                  size="large"
                  value={formik.values.meetingId || undefined} // Ensure the value is undefined when not selected
                  onChange={(value) => formik.setFieldValue("meetingId", value)}
                  onBlur={formik.handleBlur}
                  style={{ width: "100%" }}
                  placeholder="Select a meeting room"
                >
                  {roomData.map((item: any) => (
                    <Option key={item._id} value={item._id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
                {formik.touched.meetingId && formik.errors.meetingId && (
                  <span className="text-red-500 px-3 text-xs">
                    {formik.errors.meetingId}
                  </span>
                )}

                <div className="flex gap-2 justify-end">
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ width: "100%" }}
                    loading={formik.isSubmitting}
                  >
                    Book Now
                  </Button>
                </div>
              </form>
            </TabPane>
          </Tabs>
        </Card>
      </div>
    </Suspense>
  );
}
