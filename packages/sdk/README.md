# @dstats/sdk

<div align="center">

The official SDK for **DStats**.

Build analytics integrations using a simple, adapter-based API.

> 🚧 **This package is currently in active development. APIs may change until the first stable release.**

[![npm](https://img.shields.io/npm/v/@dstats/sdk?style=for-the-badge)](https://www.npmjs.com/package/@dstats/sdk)
[![License](https://img.shields.io/npm/l/@dstats/sdk?style=for-the-badge)](https://github.com/ViB404/dstats/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![GitHub](https://img.shields.io/badge/GitHub-dstats-181717?style=for-the-badge&logo=github)](https://github.com/ViB404/dstats)

</div>

---

## Features

- ⚡ Lightweight SDK
- 🔌 Adapter-based architecture
- 💙 Fully typed
- 🌍 Framework agnostic

---

## Installation

### npm

```bash
npm install @dstats/sdk
```

### pnpm

```bash
pnpm add @dstats/sdk
```

### Yarn

```bash
yarn add @dstats/sdk
```

---

## Quick Start

The SDK works with adapters.

Install the official Discord.js adapter:

```bash
npm install @dstats/sdk @dstats/discord.js
```

```ts
import { Client } from "discord.js";
import { DiscordJSAdapter } from "@dstats/discord.js";
import { Stats } from "@dstats/sdk";

const client = new Client({
  intents: [],
});

await new Stats({
  apiKey: process.env.DSTATS_API_KEY!,
  adapter: new DiscordJSAdapter(client),
});

await client.login(process.env.DISCORD_TOKEN);
```

That's it.

Guild joins and guild leaves are automatically tracked.

---

## Available Adapters

| Package              | Status      |
| -------------------- | ----------- |
| `@dstats/discord.js` | ✅ Official |
| More adapters        | 🚧 Planned  |

---

## Dashboard

Manage your bots and view analytics from the DStats dashboard.

- Dashboard: https://dstats.havochz.xyz/dashboard
- Generate an API Key: https://dstats.havochz.xyz/dashboard/api-keys

---

## Documentation

Complete documentation, guides, and examples are available in the main repository.

https://github.com/ViB404/dstats

---

## Requirements

- Node.js 20+
- TypeScript 5+

---

## License

MIT
