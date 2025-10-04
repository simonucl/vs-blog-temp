import type { APIRoute } from "astro";
import { generateOgImageForSite } from "@/utils/generateOgImages";

// 1x1 transparent PNG fallback
const FALLBACK_1x1_PNG = Uint8Array.from([
  137,80,78,71,13,10,26,10,0,0,0,13,73,72,68,82,
  0,0,0,1,0,0,0,1,8,6,0,0,0,31,21,196,
  137,0,0,0,1,115,82,71,66,0,174,206,28,233,0,0,0,10,
  73,68,65,84,120,156,99,96,0,0,0,2,0,1,226,33,191,164,
  0,0,0,0,73,69,78,68,174,66,96,130
]);

export const GET: APIRoute = async () => {
  try {
    const buffer = await generateOgImageForSite();
    return new Response(new Uint8Array(buffer), {
      headers: { "Content-Type": "image/png" },
    });
  } catch {
    return new Response(FALLBACK_1x1_PNG, {
      headers: { "Content-Type": "image/png" },
      status: 200,
    });
  }
};
