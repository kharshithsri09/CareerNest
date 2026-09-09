# CareerNest

Your Career. One Home. — a local-first personal career and job-application tracker.

## Run it

1. Unzip this folder and open it in VS Code.
2. Open a terminal in VS Code (Terminal → New Terminal).
3. Install dependencies:
   ```
   npm install
   ```
4. Start the dev server:
   ```
   npm run dev
   ```
5. Open the URL it prints (usually http://localhost:5173).

Data is saved to your browser's local storage under the key `careernest-data-v1`, so it persists between visits on the same browser. Use Profile → Export Career Data to back it up as a JSON file.

## Project structure

- `src/App.jsx` — the entire application (dashboard, applications, stages, resumes, archive, profile)
- `src/main.jsx` — React entry point
- `src/index.css` — Tailwind import
- `vite.config.js` — Vite + Tailwind plugin config
