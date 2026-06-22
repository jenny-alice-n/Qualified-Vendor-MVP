import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parser limit increased for larger payloads
  app.use(express.json({ limit: "15mb" }));

  // API Proxy endpoint to hit the live system bypassing browser CORS
  app.post("/api/query-vendors", async (req, res) => {
    try {
      const {
        endpointUrl,
        apiKey,
        apiKeyHeaderName,
        ...requestPayload
      } = req.body;

      if (!endpointUrl) {
        return res.status(400).json({ error: "No endpoint URL specified." });
      }

      console.log(`[Proxy] Fetching vendors from live URL: ${endpointUrl}`);
      
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (apiKey && apiKeyHeaderName) {
        headers[apiKeyHeaderName] = apiKey;
        // Also support standard Bearer token fallback if the header is Authorization
        if (apiKeyHeaderName.toLowerCase() === "authorization" && !apiKey.toLowerCase().startsWith("bearer ")) {
          headers[apiKeyHeaderName] = `Bearer ${apiKey}`;
        }
      }

      const response = await fetch(endpointUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(requestPayload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[Proxy Error] Status: ${response.status}. Payload: ${errorText}`);
        return res.status(response.status).json({
          error: `External API responded with status ${response.status}`,
          details: errorText,
        });
      }

      const data = await response.json();
      return res.json(data);
    } catch (e: any) {
      console.error("[Proxy Exception]", e);
      return res.status(500).json({
        error: "Internal server error occurred when proxying your request.",
        details: e.message || String(e),
      });
    }
  });

  // Vite middleware setup for Development
  if (process.env.NODE_ENV !== "production") {
    console.log("[Server] Launching in DEVELOPMENT mode with Vite Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production setup serving built files
    console.log("[Server] Launching in PRODUCTION mode serving /dist directory...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server Ready] Listening at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Critical server bootstrap failure:", err);
});
