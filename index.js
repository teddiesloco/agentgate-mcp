#!/usr/bin/env node
/**
 * AgentGate x402 MCP Server Bridge
 * Exposes AgentGate clean-markdown, domain-intel, prompt-guard, and solana-security tools to MCP hosts.
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

const GATEWAY_URL = process.env.AGENTGATE_URL || "https://x402.agentsea.vn";

const server = new Server(
  {
    name: "agentgate-x402",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// 1. List Available Tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "agentgate_scrape_clean_markdown",
        description: "Fetch web pages and extract ultra-clean, noise-free Markdown. Strips headers, footers, and tracking scripts to save up to 80% LLM context window tokens. Pay-per-use via x402.",
        inputSchema: {
          type: "object",
          properties: {
            url: { type: "string", description: "Public URL to scrape" },
          },
          required: ["url"],
        },
      },
      {
        name: "agentgate_enrich_domain",
        description: "Enrich domain intelligence: DNS records, SSL validity, IP geolocation, and detected tech stack.",
        inputSchema: {
          type: "object",
          properties: {
            domain: { type: "string", description: "Target domain name (e.g. stripe.com)" },
          },
          required: ["domain"],
        },
      },
      {
        name: "agentgate_prompt_injection_guard",
        description: "Deterministic firewall check for adversarial jailbreak attempts and system prompt overrides in untrusted inputs.",
        inputSchema: {
          type: "object",
          properties: {
            text: { type: "string", description: "Untrusted prompt or text to analyze" },
          },
          required: ["text"],
        },
      },
      {
        name: "agentgate_solana_anti_rug_audit",
        description: "Sub-second security check on Solana tokens (LP locked status, honeypot score, freeze authority, and top holder concentration).",
        inputSchema: {
          type: "object",
          properties: {
            mint: { type: "string", description: "Solana SPL token mint address" },
          },
          required: ["mint"],
        },
      }
    ],
  };
});

// 2. Call Tools Handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  let endpoint = "";
  let payload = {};

  if (name === "agentgate_scrape_clean_markdown") {
    endpoint = `${GATEWAY_URL}/v1/scrape/clean-markdown`;
    payload = { url: args.url };
  } else if (name === "agentgate_enrich_domain") {
    endpoint = `${GATEWAY_URL}/v1/intel/enrich-domain`;
    payload = { domain: args.domain };
  } else if (name === "agentgate_prompt_injection_guard") {
    endpoint = `${GATEWAY_URL}/v1/guard/prompt-injection-check`;
    payload = { text: args.text };
  } else if (name === "agentgate_solana_anti_rug_audit") {
    endpoint = `${GATEWAY_URL}/v1/solana/token-security`;
    payload = { mint: args.mint };
  } else {
    throw new Error(`Unknown tool: ${name}`);
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  } catch (error) {
    return {
      isError: true,
      content: [
        {
          type: "text",
          text: `AgentGate Gateway Error: ${error.message}`,
        },
      ],
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
