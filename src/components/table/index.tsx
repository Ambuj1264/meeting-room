"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  Input,
  DatePicker,
  TimePicker,
  Button,
  Space,
  Modal,
  Form,
  Select,
  Switch,
  message,
} from "antd";
import type { GetProp, TableProps } from "antd";
import type { SorterResult } from "antd/es/table/interface";
import qs from "qs";
import Cookies from "js-cookie";
import { MdDeleteSweep } from "react-icons/md";
const { RangePicker: TimeRangePicker } = TimePicker;
const { Option } = Select;

type ColumnsType<T extends object = object> = TableProps<T>["columns"];
type TablePaginationConfig = Exclude<
  GetProp<TableProps, "pagination">,
  boolean
>;

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
  pagination?: TablePaginationConfig;
  sortField?: SorterResult<any>["field"];
  sortOrder?: SorterResult<any>["order"];
  filters?: Parameters<GetProp<TableProps, "onChange">>[1];
}

const columns: ColumnsType<DataType> = [
  { title: "Name", dataIndex: "name", width: "20%" },
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
];

const Example: React.FC = () => {
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: { current: 1, pageSize: 10 },
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<[string, string] | null>(null);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<DataType | null>(null);
  const [roomData, setRoomData] = useState<{ id: string; name: string }[]>([]);
  const [form] = Form.useForm();

  const fetchRoomData = async () => {
    const userInfo = Cookies.get("userInfo")
      ? JSON.parse(Cookies.get("userInfo") || "")
      : null;
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

  const fetchData = () => {
    setLoading(true);
    const userData = Cookies.get("userInfo")
      ? JSON.parse(Cookies.get("userInfo") || "")
      : null;
    const queryParams = {
      search: searchTerm,
      date: selectedDate,
      startTime: timeRange ? timeRange[0] : undefined,
      endTime: timeRange ? timeRange[1] : undefined,
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
        setData(results?.data);
        setLoading(false);
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: results?.totalCount || 200,
          },
        });
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

      if (!response.ok) {
        throw new Error("Failed to delete meeting");
        return;
      }
      message.success("Meeting deleted successfully");
      fetchData();
    } catch (error) {
      message.error("Failed to delete meeting");
    }
  };

  useEffect(fetchData, [
    tableParams.pagination?.current,
    tableParams.pagination?.pageSize,
    tableParams.sortOrder,
    tableParams.sortField,
    searchTerm,
    selectedDate,
    timeRange,
  ]);

  // useEffect(fetchRoomData, []);

  const handleTableChange: TableProps<DataType>["onChange"] = (
    pagination,
    filters,
    sorter
  ) => {
    setTableParams({
      pagination,
      filters,
      sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
      sortField: Array.isArray(sorter) ? undefined : sorter.field,
    });
  };

  return (
    <div>
      <Space
        style={{ marginBottom: 16, display: "flex", justifyContent: "end" }}
      >
        <Input.Search
          placeholder="Search by name or email"
          onSearch={setSearchTerm}
          style={{ width: 200 }}
        />
        <DatePicker
          placeholder="Select Date"
          onChange={(date, dateString: any) =>
            setSelectedDate(dateString || null)
          }
        />
        <TimeRangePicker
          placeholder={["Start Time", "End Time"]}
          onChange={(times, timeStrings) =>
            setTimeRange(
              timeStrings[0] && timeStrings[1]
                ? [timeStrings[0], timeStrings[1]]
                : null
            )
          }
        />
        <Button type="primary" onClick={fetchData}>
          Filter
        </Button>
      </Space>
      <Table<DataType>
        columns={[
          ...columns,
          {
            title: "Actions",
            render: (text, record) => (
              <Space>
                <Button danger onClick={() => handleDelete(record)}>
                  <MdDeleteSweep />
                </Button>
              </Space>
            ),
          },
        ]}
        rowKey={(record: DataType) => record._id}
        dataSource={data}
        pagination={tableParams.pagination}
        loading={loading}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default Example;
