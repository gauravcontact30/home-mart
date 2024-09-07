import { NextResponse } from "next/server";

export const GET = (req: Request) => {
  return NextResponse.json({ ok: true, from: "From api" });
};
