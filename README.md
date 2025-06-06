# MCP Server Integrations with External APIs

This project demonstrates how to build and run custom MCP (Model Context Protocol) servers that connect external data sources—such as public APIs—directly into your developer environment using URI-like resource requests.

## 🔧 What This Project Does

- Implements MCP servers using JavaScript and the `@modelcontextprotocol/sdk` package.
- Connects to public APIs (e.g. Open-Meteo, AgroMonitoring) to fetch live data.
- Defines `resource()` and `tool()` interfaces accessible via MCP URIs.
- Enables structured responses directly inside tools that support MCP (like VS Code).
- Uses GitHub Copilot to accelerate code generation and improve developer productivity.

## 🧪 Examples

- `greeting://maria` → returns a dynamic greeting
- `agro://polygons` → fetches polygon data from the AgroMonitoring API
- `weather://{city}` (planned) → real-time weather info via Open-Meteo

## 🚀 Tech Stack

- JavaScript (Node.js)
- MCP SDK
- Zod for schema validation
- GitHub Copilot (for assisted code authoring)
- APIs: Open-Meteo, AgroMonitoring, etc.

## 📦 How to Run

1. Install dependencies:
   ```bash
   npm install
