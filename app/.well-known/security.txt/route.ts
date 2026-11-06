import { CONTACT_EMAIL, SITE_URL } from "@/lib/site";

/** RFC 9116 security contact. `Expires` is always a year out; 404 until NEXT_PUBLIC_CONTACT_EMAIL is set. */
export function GET() {
  if (!CONTACT_EMAIL) return new Response("Not found", { status: 404 });

  const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
  const body = [
    `Contact: mailto:${CONTACT_EMAIL}`,
    `Expires: ${expires}`,
    "Preferred-Languages: en",
    `Canonical: ${SITE_URL}/.well-known/security.txt`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=86400" },
  });
}
