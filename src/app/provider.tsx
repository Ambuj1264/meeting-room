// app/providers.tsx
"use client";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
// import { Provider } from "react-redux";
// import store from "@/redux/Store";
// import CheckAuth from "@/components/auth/CheckAuth";
export function Providers({ children }: { children: React.ReactNode }) {
//   CheckAuth()
  return (
    // <Provider store={store}>
        <NextUIProvider>
          <NextThemesProvider attribute="class" defaultTheme="light">
            <Toaster />
            {children}
          </NextThemesProvider>
        </NextUIProvider>
    // </Provider>
  );
}