import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const GuestLayout = async ({ children }: Props) => {
  const session = await auth();
  console.log("Guest Auth -> session:", session);
  if (session) {
    redirect("/");
  }
  return <div>{children}</div>;
};

export default GuestLayout;
