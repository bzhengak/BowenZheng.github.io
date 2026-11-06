# Visual inspection workflow (self-browsing, no manual screenshots)

When the user wants you to look at the running site, do NOT ask them to paste
screenshots. Use the browser MCP tools to browse it yourself:

1. Make sure the dev server is running (`npm run dev` → http://localhost:5173).
2. `browser_open(url="http://localhost:5173")` to open a persistent session.
3. Capture: `browser_screenshot(return_inline=true)` when your current model can
   read images directly; otherwise `browser_screenshot(return_inline=false)`
   to get a file path.
4. If your model is text-only (cannot view images), pass that file path to
   `zen_vision.describe_image` (or `ocr_image` for text) so the free vision
   model `mimo-v2.5-free` turns it into a text description you can reason about.
5. Iterate: make edits, then re-open/re-screenshot and re-describe to verify the
   visual result before reporting done.
