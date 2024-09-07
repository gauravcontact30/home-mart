import EmailVerificationToken from "@/app/models/emailVerificationToken";
import { NewUserRequest } from "@/app/types";
import startDb from "@lib/db";
import UserModel from "@models/userModel";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import crypto from "crypto";

export const POST = async (req: Request) => {
  const body = (await req.json()) as NewUserRequest;
  await startDb();
  const newUser = await UserModel.create({ ...body });

  // console.log(await newUser.comparePassword("12345678")); //true
  // console.log(await newUser.comparePassword("123456@@##")); //false

  const token = crypto.randomBytes(36).toString("hex");

  await EmailVerificationToken.create({
    user: newUser._id,
    token,
  });

  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "df41de71300b47",
      pass: "b277ff9a0d4a8f",
    },
  });
  const verificationUrl = `http://localhost:3000/verify?token=${token}&userId=${newUser._id}`;

  transport.sendMail({
    from: "verification@nextcomm.com",
    to: newUser.email,
    html: `<h1>Please, verify your email by clicking on <a href=${verificationUrl}>This link</a></h1>`,
  });

  return NextResponse.json({ message: "Please check your email!" });
};
