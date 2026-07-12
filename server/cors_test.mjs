const app = (await import("./src/app.js")).default;
const server = app.listen(0);
await new Promise((r) => server.once("listening", r));
const port = server.address().port;

// Simulate the exact browser preflight that failed for the user.
const preflight = await fetch(`http://localhost:${port}/api/dashboard`, {
  method: "OPTIONS",
  headers: {
    Origin: "http://localhost:5174",
    "Access-Control-Request-Method": "GET",
    "Access-Control-Request-Headers": "authorization",
  },
});
console.log("OPTIONS /api/dashboard ->", preflight.status);
console.log("  Access-Control-Allow-Origin:", preflight.headers.get("access-control-allow-origin"));

// A real GET with a bad/expired token, to see if CORS headers survive an error response.
const getReq = await fetch(`http://localhost:${port}/api/dashboard`, {
  method: "GET",
  headers: { Origin: "http://localhost:5174", Authorization: "Bearer garbage" },
});
console.log("GET /api/dashboard (bad token) ->", getReq.status);
console.log("  Access-Control-Allow-Origin:", getReq.headers.get("access-control-allow-origin"));

// Roles endpoint (public, no DB needed for the route to be reached)
const rolesReq = await fetch(`http://localhost:${port}/api/auth/roles`, {
  method: "GET",
  headers: { Origin: "http://localhost:5174" },
});
console.log("GET /api/auth/roles ->", rolesReq.status);
console.log("  Access-Control-Allow-Origin:", rolesReq.headers.get("access-control-allow-origin"));
const rolesBody = await rolesReq.text();
console.log("  body:", rolesBody.slice(0, 200));

server.close();
process.exit(0);
