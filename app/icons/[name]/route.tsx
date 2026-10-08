import { ImageResponse } from "next/og";

// Icons are drawn with shapes (no fonts or binary assets) and cached for a year.
const ICONS: Record<string, { size: number; maskable: boolean }> = {
  "icon-192.png": { size: 192, maskable: false },
  "icon-512.png": { size: 512, maskable: false },
  "maskable-512.png": { size: 512, maskable: true },
  "apple-touch-icon.png": { size: 180, maskable: true },
};

export const dynamic = "force-static";

export function generateStaticParams() {
  return Object.keys(ICONS).map((name) => ({ name }));
}

export async function GET(_req: Request, ctx: RouteContext<"/icons/[name]">) {
  const { name } = await ctx.params;
  const icon = ICONS[name];
  if (!icon) return new Response("Not found", { status: 404 });

  const { size, maskable } = icon;
  // Maskable icons keep the artwork inside the central 80% safe zone.
  const art = size * (maskable ? 0.5 : 0.62);
  const bar = art * 0.14;
  const gold = "#c9a24b";

  return new ImageResponse(
    (
      <div
        style={{
          width: size,
          height: size,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0f1626",
          borderRadius: maskable ? 0 : size * 0.22,
        }}
      >
        <div style={{ position: "relative", width: art, height: art, display: "flex" }}>
          <div
            style={{
              position: "absolute",
              left: (art - bar) / 2,
              top: 0,
              width: bar,
              height: art,
              background: gold,
              borderRadius: bar / 3,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: art * 0.14,
              top: art * 0.3,
              width: art * 0.72,
              height: bar,
              background: gold,
              borderRadius: bar / 3,
            }}
          />
        </div>
      </div>
    ),
    { width: size, height: size, headers: { "Cache-Control": "public, max-age=31536000, immutable" } },
  );
}
