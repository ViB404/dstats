# @dstats/discord.js

<div align="center">

The official Discord.js adapter for **DStats**.

Automatically tracks your bot's guild joins and guild leaves with almost zero configuration.

> 🚧 **This package is currently in active development. APIs may change until the first stable release.**

[![npm](https://img.shields.io/npm/v/@dstats/discord.js?style=for-the-badge)](https://www.npmjs.com/package/@dstats/discord.js)
[![License](https://img.shields.io/npm/l/@dstats/discord.js?style=for-the-badge)](https://github.com/ViB404/dstats/blob/main/LICENSE)
[![Discord.js](https://img.shields.io/badge/Discord.js-v14-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.js.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![GitHub](https://img.shields.io/badge/GitHub-dstats-181717?style=for-the-badge&logo=github)](https://github.com/ViB404/dstats)

</div>

---

## Features

- 🚪 Automatic guild join tracking
- 📉 Automatic guild leave tracking
- ⚡ Zero configuration
- 🔒 Secure API authentication
- 💙 Fully typed
- 🔌 Built specifically for Discord.js

---

## Installation

### npm

```bash
npm install @dstats/sdk @dstats/discord.js
```

### pnpm

```bash
pnpm add @dstats/sdk @dstats/discord.js
```

### Yarn

```bash
yarn add @dstats/sdk @dstats/discord.js
```

---

## Quick Start

```ts
import { Client } from "discord.js";
import { Stats } from "@dstats/sdk";
import { DiscordJSAdapter } from "@dstats/discord.js";

const client = new Client({
  intents: [],
});

new Stats({
  apiKey: process.env.DSTATS_API_KEY!,
  adapter: new DiscordJSAdapter(client),
});

await client.login(process.env.DISCORD_TOKEN);
```

That's it.

The adapter automatically begins tracking:

- Guild joins
- Guild leaves

---

## Requirements

- Node.js 20+
- discord.js v14+
- @dstats/sdk

---

## Dashboard

View your analytics from the DStats dashboard.

Dashboard

https://dstats.havochz.xyz/dashboard

Generate an API Key

https://dstats.havochz.xyz/dashboard/api-keys

---

## Related Packages

| Package       | Description |
| ------------- | ----------- |
| `@dstats/sdk` | Core SDK    |

---

## Documentation

For complete documentation, guides, and examples:

https://github.com/ViB404/dstats

---

## License

MIT
