"use client";

import { notFound, redirect, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "react-toastify";

interface Props {
  searchParams: {
    token: string;
    userId: string;
  };
}

const Verify = (props: Props) => {
  const { token, userId } = props.searchParams;
  const router = useRouter();

  //Verify the token and userId

  useEffect(() => {
    fetch("/api/users/verify", {
      method: "POST",
      body: JSON.stringify({ token, userId }),
    }).then(async (res) => {
      const apiRes = await res.json();

      const { message, error } = apiRes as { message: string; error: string };
      if (res.ok) {
        //success
        toast.success(message);
        router.replace("/");
      }

      if (!res.ok && error) {
        //Error
        toast.error(error);
      }
    });
  }, []);

  if (!token || !userId) return notFound(); //redirect("/");

  return (
    <div className="text-3xl opacity-70 text-center p-5 animate-pulse">
      Please wait...
      <p>We are verifying your email</p>
    </div>
  );
};

export default Verify;
