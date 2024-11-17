"use client";
import React, { useEffect, useState, Suspense } from "react";
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

export default function FullNavbar() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: "", email: "", role: "" });
  const [showPopup, setShowPopup] = useState(false);

  const result = useSelector((state: any) => state.counter);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userToken = Cookies.get("userToken");
      const userData = Cookies.get("userInfo");
      setIsUserLoggedIn(!!userToken);
      setUserInfo(userData ? JSON.parse(userData) : { name: "", email: "" });
    }
  }, [result?.value]);

  const togglePopup = () => setShowPopup((prev) => !prev);

  const handleLogout = () => {
    Cookies.remove("userToken");
    Cookies.remove("userInfo");
    setIsUserLoggedIn(false);
    setShowPopup(false);
    dispatch(logout());
    router.push("/login");
  };

  const menuItems = isUserLoggedIn
    ? userInfo?.role === "admin"
      ? [
          // { name: "Home", href: "/" },
          { name: "Upcoming Booking", href: "/showdata" },
          { name: "Create Booking", href: "/main" },
          {
            name: "Create Team",
            href: "/createUsers",
          },
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
          {menuItems.map((item) => (
            <NavbarItem key={item.name}>
              <Link
                color="foreground"
                href={item.href}
                className="text-primary font-medium"
              >
                {item.name}
              </Link>
            </NavbarItem>
          ))}
        </NavbarContent>
        <NavbarContent justify="end">
          <NavbarItem>
            {isUserLoggedIn ? (
              <>
                <Button
                  as="button"
                  variant="flat"
                  className="text-primary font-medium"
                  onClick={togglePopup}
                >
                  {toPascalCase(userInfo.name)}
                </Button>
                {showPopup && (
                  <div className="absolute top-12 right-20 bg-white p-4 shadow-lg rounded-md">
                    <Button
                      onClick={handleLogout}
                      variant="flat"
                      className="text-danger font-medium"
                    >
                      Logout
                    </Button>
                  </div>
                )}
              </>
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
