#!/bin/bash
# MARRYNOV — Installation des MCP servers
# Exécuter une seule fois depuis WSL2

echo "=== Installation MCP MARRYNOV ==="

# 1. Linear (officiel, remote, OAuth)
echo "[1/4] Linear MCP..."
claude mcp add --transport http linear https://mcp.linear.app/mcp --scope user
echo "=> Lancer /mcp dans Claude Code pour authentifier Linear"

# 2. Figma (officiel, remote, OAuth)
echo "[2/4] Figma MCP..."
claude mcp add --scope user --transport http figma https://mcp.figma.com/mcp
echo "=> Lancer /mcp dans Claude Code pour authentifier Figma"

# 3. GitHub (via npx, token requis)
echo "[3/4] GitHub MCP..."
echo "=> Remplace YOUR_GITHUB_TOKEN par ton Personal Access Token GitHub"
claude mcp add --transport stdio \
  --env GITHUB_PERSONAL_ACCESS_TOKEN=YOUR_GITHUB_TOKEN \
  --scope user \
  github -- npx -y @modelcontextprotocol/server-github

# 4. Notion (via npx, token requis)
echo "[4/4] Notion MCP..."
echo "=> Remplace YOUR_NOTION_TOKEN par ton Integration Token Notion"
claude mcp add --transport stdio \
  --env NOTION_API_TOKEN=YOUR_NOTION_TOKEN \
  --scope user \
  notion -- npx -y @modelcontextprotocol/server-notion

echo ""
echo "=== MCP installés ==="
echo "Ouvre Claude Code et tape /mcp pour vérifier et authentifier"
echo ""
echo "Tokens à récupérer :"
echo "- GitHub : https://github.com/settings/tokens (scopes: repo, issues, pull_requests)"
echo "- Notion : https://www.notion.so/my-integrations (type: Internal)"
echo "- Linear : OAuth automatique via /mcp"
echo "- Figma  : OAuth automatique via /mcp"
