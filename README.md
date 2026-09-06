# AgentGate x402 Model Context Protocol (MCP) Server

<p align="center">
  <img src="https://x402.agentsea.vn/og-image.png" alt="AgentGate x402 — Machine-to-Machine Utility Tollbooth" width="100%" style="border-radius: 8px;">
</p>

[![Smithery](https://smithery.ai/badge/@teddiesloco/agentgate-mcp)](https://smithery.ai/server/@teddiesloco/agentgate-mcp)

Zero-subscription, machine-payable AI utility microservices powered by HTTP 402 on Base and Solana.

## Tools Provided

1. **`scrape_clean_markdown`** ($0.005 USDC)
   - Ultra-fast, noise-free Markdown extraction from any web URL. 50% cheaper than Firecrawl. Strips navigation, ads, and HTML boilerplate.
2. **`check_prompt_injection`** ($0.002 USDC)
   - Deterministic adversarial prompt injection, jailbreak, and system prompt override detector.
3. **`audit_solana_token`** ($0.01 USDC)
   - Sub-second anti-rug check for Solana SPL tokens (Pump.fun, Raydium). Checks LP lock status, top 10 holder concentration, mint and freeze authorities.
4. **`enrich_domain`** ($0.01 USDC)
   - Instant domain intelligence: DNS, SSL, IP geolocation, and detected technology stack.

## Installation & Usage

### Claude Desktop

Add this to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "agentgate": {
      "command": "npx",
      "args": [
        "-y",
        "@teddiesloco/agentgate-mcp",
        "--gateway",
        "https://x402.agentsea.vn"
      ]
    }
  }
}
```

### Cursor & Cline

Add to `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "agentgate": {
      "command": "node",
      "args": ["path/to/index.js", "--gateway", "https://x402.agentsea.vn"]
    }
  }
}
```

## Gateway & Spec

- Gateway: https://x402.agentsea.vn
- Manifest: https://x402.agentsea.vn/.well-known/x402
- Networks: Base L2 (`eip155:8453`) & Solana
- Facilitator: PayAI Network (`facilitator.payai.network`)
- Sui Agent ID: [#513 on t2000.ai](https://t2000.ai/513)

## License
MIT