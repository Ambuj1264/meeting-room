"use client";
import React, { useEffect, useState } from "react";
import { Table, Input, DatePicker, TimePicker, Button, Space } from "antd";
import type { GetProp, TableProps } from "antd";
import type { SorterResult } from "antd/es/table/interface";
import qs from "qs";
import Cookies from "js-cookie";
const { RangePicker: TimeRangePicker } = TimePicker;

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
}

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: SorterResult<any>["field"];
  sortOrder?: SorterResult<any>["order"];
  filters?: Parameters<GetProp<TableProps, "onChange">>[1];
}

// const columns: ColumnsType<DataType> = [
//   { title: 'Name', dataIndex: 'name', width: '20%' },
//   { title: 'Email', dataIndex: 'email' },
//   { title: 'Date', dataIndex: 'date' },
//   { title: 'Start Time', dataIndex: 'startTime' },
//   { title: 'End Time', dataIndex: 'endTime' },
//   { title: 'Meeting Room', dataIndex: 'meetingId', render: (meetingId) => meetingId?.name || '' },
// ];
const columns: ColumnsType<DataType> = [
  { title: "Agenda of Meeting", dataIndex: "subject", width: "30%" },
  { title: "Name", dataIndex: "name"},
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

const HeroTableForAllBooking: React.FC = () => {
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: { current: 1, pageSize: 10 },
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<[string, string] | null>(null);

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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(fetchData, [
    tableParams.pagination?.current,
    tableParams.pagination?.pageSize,
    tableParams.sortOrder,
    tableParams.sortField,
    searchTerm,
    selectedDate,
    timeRange,
  ]);

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
      <Table<DataType>
        columns={columns}
        rowKey={(record: DataType) => record._id}
        dataSource={data}
        loading={loading}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default HeroTableForAllBooking;
