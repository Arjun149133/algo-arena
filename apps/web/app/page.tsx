"use client";
import { useSession } from "next-auth/react";
import React from "react";

const HomePage = () => {
  const { data } = useSession();
  return <div className=" ">{JSON.stringify(data)}</div>;
};

export default HomePage;
