"use client";
import React, { useEffect, useState } from 'react';
import type { GetProp, TableProps } from 'antd';
import { Table } from 'antd';
import type { SorterResult } from 'antd/es/table/interface';
import qs from 'qs';

type ColumnsType<T extends object = object> = TableProps<T>['columns'];
type TablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>;

interface DataType {
  _id: string;
  email: string;
  date: string;
  startTime: string;
  endTime: string;

}

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: SorterResult<any>['field'];
  sortOrder?: SorterResult<any>['order'];
  filters?: Parameters<GetProp<TableProps, 'onChange'>>[1];
}

const columns: ColumnsType<DataType> = [
  {
    title: 'Booking ID',
    dataIndex: '_id',
    sorter: true,
    render: (_id) => `${_id}`,
    width: '20%',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    sorter: true,
    // filters: [
    //   { text: 'Male', value: 'male' },
    //   { text: 'Female', value: 'female' },
    // ],
    width: '20%',
  },
  {
    title: 'Date',
    dataIndex: 'date',
    sorter: true,
  },
  {
    title: 'Start Time',
    dataIndex: 'startTime',
    sorter: true,
  }
  ,
  {
    title: 'End Time',
    dataIndex: 'endTime',
    sorter: true,
  },
  {
    title: "Meeting Room",
    dataIndex: "meetingRoom",
  }
];

const getRandomuserParams = (params: TableParams) => ({
  results: params.pagination?.pageSize,
  page: params.pagination?.current,
  ...params,
});

const Example: React.FC = () => {
  const [data, setData] = useState<DataType[]>();
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const fetchData = () => {
    setLoading(true);
    fetch(`http://localhost:8000/booking/getAll`)
      .then((res) => res.json())
      .then(( results ) => {
        console.log(results, "======================results")
        setData(results?.data);
        setLoading(false);
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: 200,
            // 200 is mock data, you should read it from server
            // total: data.totalCount,
          },
        });
      });
  };

  useEffect(fetchData, [
    tableParams.pagination?.current,
    tableParams.pagination?.pageSize,
    tableParams?.sortOrder,
    tableParams?.sortField,
    JSON.stringify(tableParams.filters),
  ]);

  const handleTableChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
      sortField: Array.isArray(sorter) ? undefined : sorter.field,
    });

    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setData([]);
    }
  };
console.log(data, "=========================data")
  return (
    <Table<DataType>
      columns={columns}
      rowKey={(record: DataType) => record._id}
      dataSource={data}
      pagination={tableParams.pagination}
      loading={loading}
      onChange={handleTableChange}
    />
  );
};

export default Example;