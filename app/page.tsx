"use client";
import React from "react";
import { usePrivy } from "@privy-io/react-auth";
import LandingPage from "./LandingPage";
import Test from "@/components/test-component";

const Page = () => {

  const privy = usePrivy();
  // console.log(privy.authenticated);
  return (
    <>
      <div>{/* <LandingPage /> */}</div>
      {/* <div className="w-full h-screen fixed top-0 left-0 z-50 bg-black"> */}
      <Test />
      {/* </div> */}
    </>
  );
};

export default Page;
