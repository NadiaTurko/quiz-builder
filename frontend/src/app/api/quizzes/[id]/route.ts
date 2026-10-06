import { proxyToExpress } from "@/lib/proxyToExpress";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = await params;
  return proxyToExpress(`/quizzes/${id}`);
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { id } = await params;
  return proxyToExpress(`/quizzes/${id}`, { method: "DELETE" });
}
