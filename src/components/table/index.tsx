"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  Input,
  DatePicker,
  TimePicker,
  Button,
  Space,
  message,
} from "antd";
import type { TableProps } from "antd";
import type { FilterValue, SorterResult } from "antd/es/table/interface";
import qs from "qs";
import Cookies from "js-cookie";
import { MdDeleteSweep } from "react-icons/md";

const { RangePicker: TimeRangePicker } = TimePicker;

interface DataType {
  _id: string;
  email: string;
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  meetingId: { name: string };
  companyId: { _id: string };
}

interface TableParams {
  pagination?: {
    current: number;
    pageSize: number;
    total?: number;
  };
  sortField?: SorterResult<any>["field"];
  sortOrder?: SorterResult<any>["order"];
  filters?: Record<string, FilterValue | null>;
}

const Example: React.FC = () => {
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: { current: 1, pageSize: 10 },
  });
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<any>(null);
  const [timeRange, setTimeRange] = useState<[string, string] | null>(null);

  const fetchData = () => {
    setLoading(true);
    const userData = Cookies.get("userInfo")
      ? JSON.parse(Cookies.get("userInfo") || "")
      : null;

    const queryParams = {
      search: searchTerm,
      date: selectedDate,
      startTime: timeRange?.[0],
      endTime: timeRange?.[1],
      page: tableParams.pagination?.current,
      pageSize: tableParams.pagination?.pageSize,
      sortField: tableParams.sortField,
      sortOrder: tableParams.sortOrder,
    };

    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/booking/getAll/${
        userData?.companyId
      }?${qs.stringify(queryParams)}`
    )
      .then((res) => res.json())
      .then((results) => {
        setData(results?.data || []);
        setTableParams((prev) => ({
          ...prev,
          pagination: {
            ...prev.pagination,
            total: results?.totalCount || 0,
            current: prev.pagination?.current || 1,
            pageSize: prev.pagination?.pageSize || 10, // Ensure pageSize is always a number
          },
        }));
        setLoading(false);
      })
      .catch(() => {
        message.error("Failed to fetch data");
        setLoading(false);
      });
  };

  const handleDelete = async (record: DataType) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/booking/deleteMeeting/${record._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
          body: JSON.stringify({
            email: record.email,
            companyId: record.companyId?._id,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to delete meeting");

      message.success("Meeting deleted successfully");
      fetchData();
    } catch (error) {
      message.error("Failed to delete meeting");
    }
  };

  const handleTableChange: TableProps<DataType>["onChange"] = (
    pagination,
    filters,
    sorter
  ) => {
    setTableParams({
      pagination: {
        current: pagination.current!,
        pageSize: pagination.pageSize || 10, // Ensure pageSize is always a number
        total: pagination.total,
      },
      filters,
      sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
      sortField: Array.isArray(sorter) ? undefined : sorter.field,
    });
  };

  const disabledDate = (current: any) => {
    // return current && current <= new Date(); // Disable dates before today
    return current && current < new Date().setHours(0, 0, 0, 0);
  };

  const applyFilters = () => {
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [
    tableParams.pagination?.current,
    tableParams.pagination?.pageSize,
    tableParams.sortOrder,
    tableParams.sortField,
    searchTerm,
  ]);

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Agenda of Meeting",
      dataIndex: "subject",
      width: "30%",
    },
    { title: "Name", dataIndex: "name" },
    { title: "Email", dataIndex: "email" },
    { title: "Date", dataIndex: "date" },
    {
      title: "Meeting Room",
      dataIndex: "meetingId",
      render: (meetingId) => meetingId?.name || "",
    },
    {
      title: "Start Time",
      dataIndex: "startTime",
      render: (text: string) => (
        <span
          style={{
            backgroundColor: "#3fd14d",
            color: "white",
            padding: "4px 8px",
            borderRadius: "4px",
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: "End Time",
      dataIndex: "endTime",
      render: (text: string) => (
        <span
          style={{
            backgroundColor: "red",
            color: "white",
            padding: "4px 8px",
            borderRadius: "4px",
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Button danger onClick={() => handleDelete(record)}>
          <MdDeleteSweep />
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Space
        style={{ marginBottom: 16, display: "flex", justifyContent: "end" }}
      >
        <Input.Search
          placeholder="Search by name or email"
          onSearch={setSearchTerm}
          style={{ width: 300 }}
        />
        <DatePicker
          //disable previous dates
          disabledDate={disabledDate}
          placeholder="Select Date"
          onChange={(date, dateString) => setSelectedDate(dateString || null)}
        />
        <TimeRangePicker
          placeholder={["Start Time", "End Time"]}
          format="HH:mm" // This ensures only hours and minutes are shown
          onChange={(times, timeStrings) =>
            setTimeRange(
              timeStrings[0] && timeStrings[1]
                ? [timeStrings[0], timeStrings[1]]
                : null
            )
          }
        />

        <Button type="primary" onClick={applyFilters}>
          Filter
        </Button>
      </Space>
      <Table<DataType>
        columns={columns}
        rowKey={(record) => record._id}
        dataSource={data}
        pagination={tableParams.pagination}
        loading={loading}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default Example;
