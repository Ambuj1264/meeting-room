"use client";
import { useRouter } from 'next/navigation';
import React, { Suspense, useEffect } from 'react'
import { useSelector } from 'react-redux';
import Loader from '../../utility/loader/loading';

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
    <Suspense fallback={<Loader />}  >{children}</Suspense>
  )
}

export default Layout