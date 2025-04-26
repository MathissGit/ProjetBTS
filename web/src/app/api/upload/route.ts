import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const productId = formData.get("productId") as string;

    if (!file || !productId) {
      return NextResponse.json({ error: "Fichier ou productId manquant" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const dirPath = path.join(process.cwd(), "public", "produits");

    await mkdir(dirPath, { recursive: true });

    const filePath = path.join(dirPath, `${productId}.png`);
    await writeFile(filePath, buffer);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur upload serveur:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
