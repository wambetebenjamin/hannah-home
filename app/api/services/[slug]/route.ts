import { getService } from "@/lib/catalog";
export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const service = getService((await params).slug);
  return service ? Response.json({ service }) : Response.json({ error: "Service not found." }, { status: 404 });
}
