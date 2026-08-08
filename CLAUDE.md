# CLAUDE.md
This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Important: You are the orchestrator. subagents execute. you should NOT build, verify, or code inline (if possible). your job is to plan, prioritize & coordinate the acitons of your subagents

Keep your replies extremely concise and focus on providing necessary information.

Put all pictures / screenshots you take with the mcp plugin in the "pics" subfolder, under the .claude folder in THIS project.

Do NOT commit anything to GitHub. The user will control all commits to GitHub. Do NOT edit or in any way change the user's Git history or interact with GitHub.

If you make a mistake and the user points it out or corrects you, please make note of it here, so you can avoid that mistake in the future.

# discord-bot-openai-js

A Discord bot that integrates with OpenAI's chat completions API to provide conversational AI
responses in configured Discord channels. Built with discord.js v14 (ESM) and the OpenAI Node
SDK v7. Model is configurable via the `MODEL` env var (defaults to `gpt-4o`).

## Quick Start

```bash
npm install
npm start        # runs: nodemon app.js
npm test         # runs: vitest run (fully mocked — no network, no tokens needed)
```

## Architecture

```
app.js               # Entry point — Discord client init, event wiring
src/
  discord-msg.js     # Message filtering, conversation context builder, response chunking
  api.js             # OpenAI API call (sendToOpenAI)
  util.js            # Username sanitizer, typing indicator, system prompt
tests/               # Vitest suite — mocks discord.js and openai entirely
vitest.config.js     # Vitest config (node environment)
.env                 # NOT in repo (gitignored) — all config lives here, loaded via dotenv
```

## Configuration

All config comes from a `.env` file in the project root, loaded by `dotenv` in `app.js`:

- `DISCORD_TOKEN` — Discord bot token (required)
- `OPENAI_KEY` — OpenAI API key (required)
- `CHANNEL_1`, `CHANNEL_2`, … — One whitelisted channel ID per numbered var (pattern `CHANNEL_<n>`)
- `PREFIX` — Command prefix (default `!`)
- `MODEL` — OpenAI model (default `gpt-4o`)
- `CHUNK_SIZE_LIMIT` — Discord message limit (default `2000`)
- `TYPING_INTERVAL` — Typing indicator interval in ms (default `5000`)

## Key Behaviors

- Bot responds only in whitelisted channels (`CHANNEL_<n>` env vars), and only to prefixed messages or @mentions
- Builds a 10-message conversation history (last 15 minutes) as context for each API call
- Chunks AI responses into ≤2000 char Discord messages
- Shows typing indicator while processing; clears it on completion or error
- Usernames are sanitized (spaces → underscores, special chars stripped) for OpenAI compat
- 429 (rate limit) errors return a friendly humorous message instead of throwing

## Testing

- `npm test` runs 30 vitest tests across `tests/` — all external calls (Discord, OpenAI) are
  mocked, so the suite is safe to run offline with no `.env`
- There is no automated E2E test — a live check means running `node app.js` (bot goes online
  in real channels) and sending a prefixed message in a whitelisted channel (costs one API call)

## Gotchas

- Uses **discord.js v14** — app.js uses the `Events` enum (`Events.ClientReady`, `Events.MessageCreate`) and `GatewayIntentBits` (not v13's `Intents.FLAGS`)
- Package is `"type": "module"` — all files use ESM (`import`/`export`), not CommonJS
- `.env` is gitignored and must be created manually — there is no `.env.example` in the repo
- OpenAI SDK is v7 — API surface same as v5 for our usage (`openai.chat.completions.create`); requires Node 22+
- System prompt lives in `src/util.js` (`defineSystemPrompt`) — a commented alternate "argument mode" prompt is also there
