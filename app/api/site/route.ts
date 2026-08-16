import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/auth";
import { getSiteData, saveSiteData } from "@/lib/storage";
import type { SiteData } from "@/lib/types";

export async function GET() {
  const data = await getSiteData();
  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as SiteData;
  await saveSiteData(body);
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/services");
  revalidatePath("/gallery");
  return NextResponse.json({ ok: true });
}
