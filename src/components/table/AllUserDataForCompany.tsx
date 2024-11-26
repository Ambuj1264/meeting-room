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
  companyId: { _id: string };
  role: string;
}

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: SorterResult<any>["field"];
  sortOrder?: SorterResult<any>["order"];
  filters?: Parameters<GetProp<TableProps, "onChange">>[1];
}

const columns: ColumnsType<DataType> = [
  { title: "Name", dataIndex: "name", width: "40%" },
  { title: "Email", dataIndex: "email", width: "40%" },
];

const AllUserDataForCompany: React.FC = () => {
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
      page: tableParams.pagination?.current,
      pageSize: tableParams.pagination?.pageSize,
      sortField: tableParams.sortField,
      sortOrder: tableParams.sortOrder,
    };
    fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/booking/getAllUsers/${
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
    console.log(record, "=================");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/booking/deleteUser/${record._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
          body: JSON.stringify({
            id: record._id,
            companyId: record.companyId,
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
      </Space>
      <Table<DataType>
        columns={[
          ...columns,
          {
            title: "Actions",
            render: (text, record) =>
              record &&
              record?.role !== "admin" && (
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

export default AllUserDataForCompany;
