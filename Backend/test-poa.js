/**
 * One-time script to test POA flow with Pass@gmail.com
 * Run: node test-poa.js
 */
require("dotenv").config();

const BASE = "http://localhost:3000";

async function test() {
  try {
    console.log("1. Logging in...");
    const loginRes = await fetch(`${BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "Pass@gmail.com", password: "Pass@123" }),
    });
    const login = await loginRes.json();
    if (!login.token) {
      console.error("Login failed:", login);
      return;
    }
    console.log("   Logged in as", login.name, login.email);

    const token = login.token;

    console.log("\n2. Fetching workspaces...");
    const wsRes = await fetch(`${BASE}/workspace/all`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const workspaces = await wsRes.json();
    const workspaceId = workspaces[0]?._id || workspaces[0]?.id;
    if (!workspaceId) {
      console.error("No workspace found. Create one first.");
      return;
    }
    console.log("   Workspace ID:", workspaceId);

    console.log("\n3. Generating POA...");
    const poaRes = await fetch(`${BASE}/poa/${workspaceId}/generate`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    const poa = await poaRes.json();
    if (poaRes.status !== 200) {
      console.error("POA failed:", poa);
      return;
    }
    console.log("   POA generated:", poa.data?.length || 0, "events");
    if (poa.data?.length) {
      console.log("\n   Sample event:", JSON.stringify(poa.data[0], null, 2));
    }
    console.log("\nDone.");
  } catch (err) {
    console.error("Error:", err.message);
  }
}

test();
