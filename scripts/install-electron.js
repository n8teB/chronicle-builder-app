#!/usr/bin/env node

import { spawn } from "child_process";
import fs from "fs";
import path from "path";

console.log("🔧 Installing Electron dependencies...");

// Install Electron dependencies
const electronDeps = [
  "electron@^28.0.0",
  "electron-builder@^24.9.1",
  "concurrently@^8.2.2",
  "wait-on@^7.2.0",
  "electron-reload@^1.5.0",
];

const installProcess = spawn(
  "npm",
  ["install", "--save-dev", ...electronDeps],
  {
    stdio: "inherit",
    shell: true,
  },
);

installProcess.on("close", (code) => {
  if (code === 0) {
    console.log("✅ Electron dependencies installed successfully!");
    console.log("\n📖 Getting started with Electron:");
    console.log("  npm run electron-dev    - Start development mode");
    console.log("  npm run electron-pack   - Build desktop app");
    console.log("\n🚀 Ready to build your desktop app!");
  } else {
    console.error("❌ Failed to install Electron dependencies");
    process.exit(1);
  }
});
