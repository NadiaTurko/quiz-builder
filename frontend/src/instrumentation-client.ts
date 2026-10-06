const originalLog = console.log;

console.log = (...args: Parameters<typeof console.log>) => {
  const [first] = args;
  if (typeof first === "string" && first.startsWith("[Fast Refresh]")) {
    return;
  }

  originalLog(...args);
};
