<div align="center">

# DStats

**Simple, privacy-first Discord bot analytics.**

[![Discord.js](https://img.shields.io/badge/Discord.js-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.js.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MIT License](https://img.shields.io/github/license/ViB404/dstats?style=for-the-badge)](https://github.com/ViB404/dstats/blob/main/LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/ViB404/dstats?style=for-the-badge&logo=github)](https://github.com/ViB404/dstats/stargazers)
[![GitHub Issues](https://img.shields.io/github/issues/ViB404/dstats?style=for-the-badge&logo=github)](https://github.com/ViB404/dstats/issues)

Track guild joins, guild leaves, and growth with almost zero setup.

</div>

---

## About

DStats is a lightweight analytics platform for Discord bots.

Instead of building your own analytics pipeline, DStats lets you collect useful statistics with a few lines of code.

Current features include:

- Guild join tracking
- Guild leave tracking
- Analytics dashboard
- API key authentication
- Discord.js adapter

---

## Features

- 📈 Guild growth analytics
- 🚪 Guild join & leave tracking
- ⚡ Simple SDK
- 🔒 Secure API key authentication
- 📊 Clean web dashboard
- 🦀 Rust backend
- 💙 Open source

---

## Installation (Not Sure Will can be updated)

```bash
npm install @dstats/sdk @dstats/discord.js
```

or

```bash
pnpm add @dstats/sdk @dstats/discord.js
```

or

```bash
yarn add @dstats/sdk @dstats/discord.js
```

---

## Quick Start

```ts
import { Client } from "discord.js";
import { DiscordJSAdapter } from "@dstats/discord.js";
import { Stats } from "@dstats/sdk";

const client = new Client({
    intents: []
});

new Stats({
    apiKey: "your_api_key",
    adapter: new DiscordJSAdapter(client)
});

client.login(process.env.TOKEN);
```

That's it.

Guild joins and leaves are automatically tracked.

---

## Dashboard

The dashboard provides:

- Bot overview
- Total guild count (Not working for now)
- Join history
- Leave history

---

## Architecture

```
Discord Bot
      │
      ▼
Discord.js Adapter
      │
      ▼
DStats SDK
      │
      ▼
DStats API
      │
      ▼
PostgreSQL
      │
      ▼
Dashboard
```

---

## Packages

| Package | Description |
|---------|-------------|
| `@dstats/sdk` | Core SDK |
| `@dstats/discord.js` | Discord.js adapter |

More adapters are planned 🥲.

---

## API

Current endpoints

```
POST /v1/register

POST /v1/guild/join
POST /v1/guild/leave

GET /v1/bot
GET /v1/guilds
```

---

## Tech Stack

### Backend

- Rust
- Axum
- SQLx
- PostgreSQL

### Frontend

- Next.js
- React
- Tailwind CSS

### SDK

- TypeScript

---

## Roadmap

- [x] Guild join tracking
- [x] Guild leave tracking
- [x] Dashboard
- [x] API authentication
- [x] Discord.js adapter
- [ ] Charts
- [ ] Daily analytics
- [ ] Slash command analytics
- [ ] Command usage analytics
- [ ] Member growth
- [ ] Invite tracking
- [ ] Webhooks
- [ ] Additional adapters
- [ ] Public API

---

## Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Open a Pull Request.

Please keep pull requests focused and descriptive.

---

## Privacy

DStats only stores the information required to provide analytics.

We do not inspect message content or collect unnecessary user data.

---

## License

This project is licensed under the MIT License.

---

## Support

If you find DStats useful, consider supporting the project.

- GitHub Star ⭐
- Report bugs
- Suggest new features
- Contribute code

---

<div align="center">

Made with ❤️ for Discord bot developers.

</div>
