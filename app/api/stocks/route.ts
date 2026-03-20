import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.FINNHUB_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "API key not configured" },
      { status: 500 }
    );
  }

  const res = await fetch(
    `https://finnhub.io/api/v1/stock/symbol?exchange=US&token=${apiKey}`
  );

  const data = await res.json();

  return NextResponse.json(data);
}