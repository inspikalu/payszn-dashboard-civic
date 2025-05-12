"use client";
import React, { useState, useEffect } from "react";
import LandingPage from "./LandingPage";

const Page = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <div className="w-full">
        <LandingPage />
      </div>
    </>
  );
};

export default Page;
