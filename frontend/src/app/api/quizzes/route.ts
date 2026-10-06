import { proxyToExpress } from "@/lib/proxyToExpress";

export async function GET() {
  return proxyToExpress("/quizzes");
}

export async function POST(request: Request) {
  const body = await request.text();
  return proxyToExpress("/quizzes", { method: "POST", body });
}
