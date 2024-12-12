"use client";
import React, { Suspense, useEffect, useState } from "react";
import { Card, Descriptions, Avatar, Button, Row, Col } from "antd";
import { EditOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";
import { ImUserTie } from "react-icons/im";
import Loader from "../../../utility/loader/loading";
import Cookies from "js-cookie";
import { errorToast } from "@/utility/toast";
const UserDetails: React.FC = () => {
  const primaryColor = "#1677ff";
  const [loader, setLoader] = React.useState(false);
  const [user, setUserData] = useState<any>({});
  const [fullUserDetails, setFullUserDetails] = useState<any>({});

  useEffect(() => {
    const userInfo = Cookies.get("userInfo")
      ? JSON.parse(Cookies.get("userInfo") || "")
      : null;

    setUserData(userInfo);
    setLoader(true);

    const fetchUserDetails = async () => {
      if (!userInfo || !userInfo.email) {
        console.error("User info is missing!");
        setLoader(false);
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/users/getMe`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: userInfo._id,
            }),
          }
        );
        if (!response.ok) {
          errorToast("Something went wrong");
        }
        const data = await response.json();
        console.log(data);
        setFullUserDetails(data);
        setLoader(false);
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoader(false);
      }
    };

    fetchUserDetails();
  }, []);

  if (loader) {
    return <Loader />;
  }
  return (
    <Suspense fallback={<Loader />}>
      <div className="m-20">
        <div
          style={{
            backgroundColor: "#f4f6f8",
            padding: "40px",
            minHeight: "100vh",
          }}
        >
          <Row justify="center">
            <Col xs={24} sm={22} md={18} lg={14}>
              <Card
                bordered={false}
                style={{
                  borderRadius: "10px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Row gutter={[16, 16]} align="middle">
                  {/* Avatar Section */}
                  <Col xs={24} sm={8} style={{ textAlign: "center" }}>
                    {/* <Avatar
                      size={120}
                      src={}
                      style={{
                        border: `4px solid ${primaryColor}`,
                      }}
                    /> */}
                    <ImUserTie size={120} color="#1677ff" />
                  </Col>

                  {/* User Info Section */}
                  <Col xs={24} sm={16}>
                    <Descriptions
                      title={
                        <div style={{ fontSize: "1.5rem", fontWeight: 600 }}>
                          Hi, {user.name}!
                        </div>
                      }
                      column={1}
                      labelStyle={{ fontWeight: 500 }}
                      contentStyle={{
                        fontWeight: 400,
                        color: "#333",
                      }}
                    >
                      <Descriptions.Item label="Email">
                        <MailOutlined
                          style={{ color: primaryColor, marginRight: 8 }}
                        />
                        {user.email}
                      </Descriptions.Item>
                      <Descriptions.Item label="Organization">
                        {/* <OrganizationOutlined
                          style={{ color: primaryColor, marginRight: 8 }}
                        /> */}
                        {fullUserDetails &&
                          fullUserDetails.data &&
                          fullUserDetails?.data?.[0]?.company[0]?.name}
                        {}
                      </Descriptions.Item>
                      <Descriptions.Item label="role">
                        {user.role}
                      </Descriptions.Item>
                    </Descriptions>
                    <div style={{ marginTop: "20px", textAlign: "right" }}>
                      <Button
                        type="primary"
                        icon={<EditOutlined />}
                        style={{
                          backgroundColor: primaryColor,
                          borderColor: primaryColor,
                          borderRadius: "8px",
                        }}
                      >
                        Edit Details
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </Suspense>
  );
};

export default UserDetails;
