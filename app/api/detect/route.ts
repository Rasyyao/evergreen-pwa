import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { Detection, DetectionResult } from "@/lib/detection";

async function blobToDataUrl(blob: Blob): Promise<string> {
  const buffer = Buffer.from(await blob.arrayBuffer());
  return `data:${blob.type || "image/jpeg"};base64,${buffer.toString("base64")}`;
}

export async function POST(req: NextRequest) {
  const aiEndpoint = process.env.AI_ENDPOINT;
  if (!aiEndpoint) {
    return NextResponse.json(
      { error: "AI_ENDPOINT belum dikonfigurasi di server." },
      { status: 500 }
    );
  }

  const formData = await req.formData();
  const image = formData.get("image");
  if (!image) {
    return NextResponse.json({ error: "Gambar tidak ditemukan." }, { status: 400 });
  }

  const forwardData = new FormData();
  forwardData.append("image", image);

  let upstream: Response;
  try {
    upstream = await fetch(`${aiEndpoint.replace(/\/$/, "")}/detect`, {
      method: "POST",
      body: forwardData,
    });
  } catch {
    return NextResponse.json(
      { error: "Tidak dapat menghubungi server AI. Pastikan server deteksi aktif." },
      { status: 502 }
    );
  }

  const text = await upstream.text();

  if (!upstream.ok) {
    return new NextResponse(text, {
      status: upstream.status,
      headers: { "Content-Type": "application/json" },
    });
  }

  let result: DetectionResult;
  try {
    result = JSON.parse(text);
  } catch {
    return new NextResponse(text, {
      status: upstream.status,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const imageDataUrl = await blobToDataUrl(image as Blob);
    const top: Detection | undefined = result.detections[0];

    const { data, error } = await supabase
      .from("detections")
      .insert({
        image_data_url: imageDataUrl,
        summary: result.summary,
        detection_count: result.count,
        top_species: top?.display_name ?? null,
        top_confidence: top?.confidence ?? null,
        top_severity: top?.severity ?? null,
        detections: result.detections,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Gagal menyimpan hasil deteksi ke Supabase:", error.message);
    } else if (data) {
      result.id = data.id;
    }
  } catch (err) {
    console.error("Gagal menyimpan hasil deteksi ke Supabase:", err);
  }

  return NextResponse.json(result, { status: upstream.status });
}
