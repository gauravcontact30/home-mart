import PasswordResetTokenModel from "@/app/models/passwordResetTokenModel";
import UserModel from "@/app/models/userModel";
import { ForgetPasswordRequest } from "@/app/types";
import { NextResponse } from "next/server";
import crypto from "crypto";
import nodemailer from "nodemailer";
import startDb from "@/app/lib/db";
import "dotenv/config";

export const POST = async (req: Request) => {
  try {
    const { email } = (await req.json()) as ForgetPasswordRequest;

    if (!email) return NextResponse.json({ error: "Invalid email!" }, { status: 401 });

    await startDb();

    const user = await UserModel.findOne({ email });

    if (!user) return NextResponse.json({ error: "user not found!" }, { status: 404 });

    //generate the token and send the link to the given email
    await PasswordResetTokenModel.findOneAndDelete({ user: user._id });
    const token = crypto.randomBytes(36).toString("hex");
    await PasswordResetTokenModel.create({
      user: user._id,
      token,
    });

    //Send the link to the given email
    const resetPassLink = `${process.env.PASSWORD_RESET_URL}?token=${token}&userId=${user._id}`;

    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "df41de71300b47",
        pass: "b277ff9a0d4a8f",
      },
    });

    transport.sendMail({
      from: "verification@nextcomm.com",
      to: user.email,
      html: `<h1>Click on <a href=${resetPassLink}>This link</a> to reset your password.</h1>`,
    });

    return NextResponse.json({ message: "Please check your email!" });
  } catch (error) {
    return NextResponse.json({ error: (error as any).message }, { status: 500 });
  }
};
