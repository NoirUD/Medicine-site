import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getExternalReviews } from "@/lib/reviews/fetch-reviews";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const refresh = searchParams.get("refresh") === "true";
  const isAdmin = await isAdminAuthenticated();

  if (refresh && !isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cache = await getExternalReviews(refresh);
  return NextResponse.json(cache);
}

export async function POST() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cache = await getExternalReviews(true);
  return NextResponse.json(cache);
}
