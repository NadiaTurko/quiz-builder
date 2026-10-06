const EXPRESS_URL = process.env.API_URL ?? "http://localhost:4000";

export async function proxyToExpress(path: string, init?: RequestInit): Promise<Response> {
  const response = await fetch(`${EXPRESS_URL}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
    signal: init?.signal ?? AbortSignal.timeout(10_000),
  });

  if (response.status === 204) {
    return new Response(null, { status: 204 });
  }

  const body = await response.text();

  return new Response(body, {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("Content-Type") ?? "application/json",
    },
  });
}
