export const isStaticDemo = process.env.NEXT_PUBLIC_STATIC_DEMO === "1";

export function quizDetailHref(id: string) {
  return isStaticDemo ? `/quiz/?id=${encodeURIComponent(id)}` : `/quizzes/${id}`;
}
