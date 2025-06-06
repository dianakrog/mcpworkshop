import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import http from "http";


const server = new McpServer({
  name: "AgroPolygons",
  version: "1.0.0"
});


server.tool("add",
  { a: z.number(), b: z.number() },
  async ({ a, b }) => ({
    content: [{ type: "text", text: String(a + b) }]
  })
);

server.resource(
  "agro-polygons",
  new ResourceTemplate("agro://polygons", { list: undefined }),
  async (uri, _params) => {
    const url = `http://api.agromonitoring.com/agro/1.0/polygons?appid=test`;

    const data = await new Promise((resolve, reject) => {
      http.get(url, (res) => {
        let body = "";
        res.on("data", chunk => body += chunk);
        res.on("end", () => {
          try {
            resolve(JSON.parse(body));
          } catch (err) {
            reject(err);
          }
        });
      }).on("error", reject);
    });

    return {
      contents: [{
        uri: uri.href,
        text: `Agromonitoring polygons:\n\n${JSON.stringify(data, null, 2)}`
      }]
    };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);