"use client";
import { Button } from "@components/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import React from "react";

const HomePage = () => {
  const { data } = useSession();
  return (
    <div className=" ">
      {JSON.stringify(data)}
      <div>
        <Button onClick={() => signOut()}>Logout</Button>
      </div>
    </div>
  );
};

export default HomePage;
