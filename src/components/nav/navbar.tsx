"use client";
import React, { useEffect, useState, Suspense, useMemo } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@nextui-org/react";
import Cookies from "js-cookie";
import { AcmeLogo } from "./AcmeLogo";
import { ThemeSwitcher } from "../themes/ThemeSwitcher";
import { BRAND_NAME } from "../../utility/constant";
import { toPascalCase } from "../../utility/case";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../utility/redux/slices/feature/auth";
import Loader from "../../utility/loader/loading";
import { Dropdown, Menu, Space } from "antd";

export default function FullNavbar() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: "", email: "", role: "" });

  const result = useSelector((state: any) => state.counter);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    console.log("second");
    if (typeof window !== "undefined") {
      console.log("first");
      const userToken = Cookies.get("userToken");
      const userData = Cookies.get("userInfo");
      setIsUserLoggedIn(!!userToken);
      setUserInfo(userData ? JSON.parse(userData) : { name: "", email: "" });
    }
  }, [result?.value]);

  const handleLogout = () => {
    Cookies.remove("userToken");
    Cookies.remove("userInfo");
    setIsUserLoggedIn(false);
    dispatch(logout());
    router.push("/login");
  };

  const menuItems = isUserLoggedIn
    ? userInfo?.role === "admin"
      ? [
          { name: "Upcoming Booking", href: "/showdata" },
          { name: "Create Booking", href: "/main" },
          { name: "Create Team", href: "/createUsers" },
          { name: "Contact Us", href: "/contact" },
        ]
      : [
          { name: "Home", href: "/" },
          { name: "Upcoming Booking", href: "/showdata" },
          { name: "Create Booking", href: "/main" },
          { name: "Contact Us", href: "/contact" },
        ]
    : [
        { name: "Home", href: "/" },
        { name: "About", href: "/about" },
        { name: "Contact Us", href: "/contact" },
      ];

  const profileMenu = (
    <Menu>
      <Menu.Item key="profile">
        <Link href="/profile">Profile</Link>
      </Menu.Item>
      <Menu.Item key="logout" onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Suspense fallback={<Loader />}>
      <Navbar
        isBordered
        className="absolute inset-x-0 top-0 z-50"
        classNames={{
          item: [
            "flex",
            "h-full",
            "items-center",
            "data-[active=true]:after:content-['']",
            "data-[active=true]:after:absolute",
            "data-[active=true]:after:bottom-0",
            "data-[active=true]:after:left-0",
            "data-[active=true]:after:right-0",
            "data-[active=true]:after:h-[2px]",
            "data-[active=true]:after:rounded-[2px]",
            "data-[active=true]:after:bg-primary",
          ],
        }}
      >
        <NavbarMenuToggle aria-label="Open menu" className="sm:hidden" />
        <NavbarBrand>
          <Link color="foreground" href="/">
            <AcmeLogo />
            <p className="font-bold text-inherit text-primary">{BRAND_NAME}</p>
          </Link>
        </NavbarBrand>
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          {menuItems?.map((item) => (
            <NavbarItem key={item.name}>
              <Link
                color="foreground"
                // href={item.href}
                style={{ cursor: "pointer" }}
                className="text-primary font-medium"
                onClick={() => router.push(item.href)}
              >
                {item.name}
              </Link>
            </NavbarItem>
          ))}
        </NavbarContent>
        <NavbarContent justify="end">
          <NavbarItem>
            {isUserLoggedIn ? (
              <Dropdown overlay={profileMenu} trigger={["click"]}>
                <Button className="text-primary font-medium">
                  <Space>{toPascalCase(userInfo.name)}</Space>
                </Button>
              </Dropdown>
            ) : (
              <Button
                as={Link}
                href="/login"
                variant="flat"
                className="text-primary font-medium"
              >
                Login
              </Button>
            )}
          </NavbarItem>
          &nbsp; <ThemeSwitcher />
        </NavbarContent>
        <NavbarMenu>
          {menuItems.map((item) => (
            <NavbarMenuItem key={item.name}>
              <Link
                color="foreground"
                className="w-full text-primary font-medium"
                href={item.href}
                size="lg"
              >
                {item.name}
              </Link>
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
      </Navbar>
    </Suspense>
  );
}
