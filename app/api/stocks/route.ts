import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;

  const res = await fetch(
    `https://finnhub.io/api/v1/stock/symbol?exchange=US&token=${apiKey}`
  );

  const data = await res.json();

  return NextResponse.json(data);
}