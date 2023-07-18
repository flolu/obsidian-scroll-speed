<div align="center">
  <a href="https://github.com/flolu/obsidian-scroll-speed">
    <img width="150px" height="auto" src="./.github/mouse.png" />
  </a>
  <br>
  <h1>Obsidian Scroll Speed</h1>
  <p> Obsidian.md Plugin to Change Mouse Scroll Speed Inside Files </p>
</div>

# Features

**Scroll Speed**
Change the mouse scroll sensitivity to your likings. 1 is super slow and 10 is very fast.

# Installation

1. Go to latest [releases](https://github.com/flolu/obsidian-scroll-speed/releases/latest)
2. Download `main.js` and `manifest.json`
3. Create `.obsidian/plugins/scroll-speed` directory
4. Move `main.js` and `manifest.json` into `.obsidian/plugins/scroll-speed`
5. Restart Obsidian

# Usage

Access the plugin settings from `Settings` -> `Plugins Options` -> `Scroll Speed`

- Mouse Scroll Speed (`1` is the default Obsidian scroll speed, higher is faster)
- Alt Multiplier (Multiply scroll speed by this number when the `ALT` key is pressed)

# Development

1. Clone repository into `.obsidian/plugins/` directory
2. Install dependencies `npm install`
3. Run `npm run dev` and make changes
4. `CTRL+P` -> `Reload app without saving` to reload plugin in Obsidian

# Release

- Update `manifest.json` with new version
- Update `versions.json` with new version
- Push changes to GitHub
- `git tag X.X.X` (Tag current commit with new version)
- `git push --tags` (Push tags to GitHub)
- Add updated `manifest.json` and `main.js` as binary attachments to the GitHub release
- [Read more here](https://github.com/obsidianmd/obsidian-sample-plugin#releasing-new-releases)

# Credits

- Icons made by [Darius Dan](https://www.flaticon.com/authors/darius-dan) from [www.flaticon.com](https://www.flaticon.com)
