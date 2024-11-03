"use client";
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';

const Layout = ({children}:{children:React.ReactNode}) => {
    const router = useRouter();
    const {isAuthenticated} = useSelector((state:any)=>state.auth);
    console.log(isAuthenticated, "isAuthenticated"), 
    useEffect(() => {
      if (!isAuthenticated) {
        router.push("/login");
      }
    }, [isAuthenticated, router]);
  return (
    <>{children}</>
  )
}

export default Layout