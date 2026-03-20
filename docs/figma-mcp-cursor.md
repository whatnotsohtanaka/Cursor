# Figma MCP → Cursor (bring designs into the editor)

Use Figma’s **remote MCP server** so Cursor can read frames, variables, and layout—not screenshots.

## 1. Connect Figma MCP in Cursor

### Option A — Recommended: Figma plugin (MCP + skills + rules)

In **Cursor’s agent chat**, run:

```text
/add-plugin figma
```

That installs MCP config, skills, and rules for Figma workflows.

### Option B — Manual install (one click)

1. Open Cursor **Settings → MCP** (or use Cursor’s MCP panel).
2. Use Figma’s install flow, or add a server that points at:

   **MCP URL:** `https://mcp.figma.com/mcp`

3. **Authenticate** when prompted (Figma OAuth). You must allow access once.

**Deep link (opens Cursor MCP install):**  
[Figma MCP in Cursor](cursor://anysphere.cursor-deeplink/mcp/install?name=Figma&config=eyJ1cmwiOiJodHRwczovL21jcC5maWdtYS5jb20vbWNwIn0%3D)

*(If the link doesn’t open, add the server manually with `url`: `https://mcp.figma.com/mcp`, type **http**.)*

### Option C — Figma Desktop (local MCP)

If you use **Figma desktop**: **Preferences → Enable Dev Mode MCP Server**  
Server runs at `http://127.0.0.1:3845/mcp` — add that URL as an MCP server in Cursor instead of the remote URL.

---

## 2. How you use it for every new design

1. In **Figma**, select the **frame** (or layer) you want built.
2. **Copy link** (Share → Copy link). The URL must include `node-id=…`.
3. In **Cursor chat**, paste the link and ask clearly, e.g.  
   *“Implement this frame in `helloworld.html` using the Figma MCP design context.”*

The agent uses MCP to pull **that node’s** specs; the browser URL alone isn’t enough for the AI without MCP.

---

## 3. Better output

- Figma: **[Improving MCP output / example rules](https://developers.figma.com/docs/figma-mcp-server/add-custom-rules/)**
- Tools & prompts: **[Figma MCP tools](https://developers.figma.com/docs/figma-mcp-server/tools-and-prompts/)**

---

## Quick reference

| What              | Value                                      |
|-------------------|--------------------------------------------|
| Remote MCP URL    | `https://mcp.figma.com/mcp`                |
| Desktop MCP URL   | `http://127.0.0.1:3845/mcp`               |
| Cursor plugin cmd | `/add-plugin figma`                        |

After MCP is connected and authenticated, **future designs** = copy frame link → paste in Cursor + your file/task.
