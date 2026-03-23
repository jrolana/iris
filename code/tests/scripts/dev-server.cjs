const { spawn } = require("node:child_process");

const command = process.execPath;
const args = [require.resolve("next/dist/bin/next"), "dev", "--port", "3000"];

const child = spawn(command, args, {
  stdio: "inherit",
  shell: false,
  env: {
    ...process.env,
    PLAYWRIGHT_TEST: "true",
    NEXT_PUBLIC_PLAYWRIGHT_TEST: "true",
  },
});

const stopChild = () => {
  if (!child.killed) {
    child.kill("SIGTERM");
  }
};

process.on("SIGINT", stopChild);
process.on("SIGTERM", stopChild);
process.on("exit", stopChild);

child.on("exit", (code) => {
  process.exit(code ?? 0);
});
