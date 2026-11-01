## graphify

When source code is present and indexed, this project uses the graph at graphify-out/ for cross-file relationships.

When the user invokes `$graphify`, use the installed Graphify skill before exploring code. The skill is available at `C:\Users\User\.agents\skills\graphify\SKILL.md`.

Rules:
- Confirm the project root, Graphify CLI version/help, and whether graphify-out/graph.json matches this project and is current before querying it.
- For codebase questions, first run `graphify query "<question>" --graph .\graphify-out\graph.json` when the graph exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. Confirm important results in source files.
- If there is no graph and source code exists, create a local AST graph with `graphify extract . --code-only`.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to refresh the graph using local AST extraction. Do not run the app, builds, or tests unless separately requested.

## yt-raw

When the user invokes `$yt-raw`, use the installed skill at `C:\Users\User\.codex\skills\yt-raw\SKILL.md`. Keep `YT_RAW.md` at the project root as a short, chronological development log. Append only relevant project changes after their result is known; preserve earlier entries.
## Project memory

Before project changes, read memory/README.md, memory/PROJECT_STATE.md, and memory/KNOWN_ISSUES.md. Append completed relevant changes to memory/CHANGELOG.md without rewriting earlier history. For bugs, record symptom, reproduction, confirmed root cause, fix, regression protection, and validation using memory/INCIDENT_TEMPLATE.md. Do not mark tests, builds, or deploys as successful without observed results. Keep YT_RAW.md as the short chronological log.
