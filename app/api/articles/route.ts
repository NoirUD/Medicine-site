import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/auth";
import { getSiteData, saveSiteData } from "@/lib/storage";
import type { Article } from "@/lib/types";

function revalidateArticles() {
  revalidatePath("/articles");
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { title?: string; content?: string; date?: string };
  const title = String(body.title ?? "").trim();
  const content = String(body.content ?? "").trim();
  const date = String(body.date ?? "").trim() || new Date().toISOString();

  if (!title) {
    return NextResponse.json({ error: "Заголовок обязателен" }, { status: 400 });
  }

  const article: Article = {
    id: `article-${Date.now()}`,
    title,
    content,
    date,
  };

  const site = await getSiteData();
  site.articles = [article, ...site.articles];
  await saveSiteData(site);
  revalidateArticles();

  return NextResponse.json(article);
}

export async function PATCH(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    id?: string;
    title?: string;
    content?: string;
    date?: string;
  };
  const id = body.id?.trim();
  const title = String(body.title ?? "").trim();
  const content = String(body.content ?? "").trim();
  const date = String(body.date ?? "").trim();

  if (!id) {
    return NextResponse.json({ error: "ID обязателен" }, { status: 400 });
  }

  const site = await getSiteData();
  const index = site.articles.findIndex((a) => a.id === id);
  if (index === -1) {
    return NextResponse.json({ error: "Статья не найдена" }, { status: 404 });
  }

  site.articles[index] = {
    ...site.articles[index],
    title,
    content,
    date,
  };
  await saveSiteData(site);
  revalidateArticles();

  return NextResponse.json(site.articles[index]);
}

export async function DELETE(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "ID обязателен" }, { status: 400 });
  }

  const site = await getSiteData();
  const article = site.articles.find((item) => item.id === id);
  if (!article) {
    return NextResponse.json({ error: "Статья не найдена" }, { status: 404 });
  }

  site.articles = site.articles.filter((item) => item.id !== id);
  await saveSiteData(site);
  revalidateArticles();

  return NextResponse.json({ ok: true });
}