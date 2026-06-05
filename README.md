# VaultScout

Production-ready DeFi application for tracking profitable on-chain wallets and subscribing to their strategies.

## Architecture

Monorepo with **clean architecture** on the API layer:

```
VaultScout/
├── apps/
│   ├── api/                    # Express + Prisma backend
│   │   ├── prisma/             # Database schema & migrations
│   │   └── src/
│   │       ├── config/         # Environment validation
│   │       ├── domain/         # Interfaces & domain contracts
│   │       ├── application/    # Business logic services
│   │       ├── infrastructure/ # Prisma, repositories, external IO
│   │       └── presentation/   # Routes, middleware, HTTP app
│   └── web/                    # Vite + React SPA
│       └── src/
│           ├── pages/          # Route pages
│           ├── components/     # UI + system gate
│           ├── contexts/       # BackendStatusProvider, Auth
│           └── lib/            # API client, utilities
├── packages/shared/            # Shared TypeScript DTOs
├── contracts/                  # Foundry Solidity
└── docker-compose.yml          # PostgreSQL
```

## Features

| Feature | Implementation |
|---------|----------------|
| Wallet authentication | SIWE (Sign-In with Ethereum) + session tokens |
| Dashboard | Top wallets, strategies overview |
| Wallet tracking | CRUD via `/api/wallets` |
| Transaction indexing | Background `IndexerService` (viem) |
| Strategy engine | Subscriptions, rules JSON, signals table |
| Notifications | Per-user notification feed |
| One-click execution | `/api/executions` + `StrategyExecutor.sol` |
| Admin panel | `/api/admin/*` (ADMIN role) |
| Backend health gate | `BackendStatusProvider` + fullscreen modal |

## Backend connectivity (required behavior)

1. On startup, the frontend calls `GET /api/system/status` (proxied to Express).
2. If unavailable, a **fullscreen modal** blocks all pages.
3. After a successful response, the app renders normally.
4. Health checks run every **10 seconds** via `BackendStatusProvider`.

## Prerequisites

- Node.js 20+
- [Foundry](https://book.getfoundry.sh/getting-started/installation) (optional, for contracts)

Local development uses **SQLite** (no Docker required). For production, use PostgreSQL and set `DATABASE_URL` accordingly.

## Quick start (Windows / local)

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
```

Set `VITE_WALLETCONNECT_PROJECT_ID` in `apps/web/.env.local` from [dashboard.reown.com](https://dashboard.reown.com) for the wallet modal.

### 3. Database setup (SQLite file at `apps/api/prisma/dev.db`)

```bash
npm run setup
```

### 4. Run development servers

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). API runs on port **4000**.

If ports are stuck from a previous run, `npm run predev` frees 3000 and 4000 before starting.

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/system/status` | Health & service status |
| GET | `/api/auth/nonce/:address` | SIWE nonce |
| POST | `/api/auth/verify` | Verify signature, issue token |
| GET | `/api/auth/me` | Current user (auth required) |
| GET | `/api/wallets` | List public tracked wallets |
| GET | `/api/wallets/:id/transactions` | Indexed transactions |
| POST | `/api/wallets` | Track new wallet |
| GET | `/api/strategies` | List strategies |
| POST | `/api/strategies/:id/subscribe` | Subscribe |
| GET | `/api/notifications` | User notifications |
| POST | `/api/executions` | Queue one-click execution |
| GET | `/api/admin/stats` | Admin metrics |

## Smart contracts

```bash
cd contracts
forge install OpenZeppelin/openzeppelin-contracts --no-commit
forge test
```

Deploy:

```bash
export DEPLOYER_PRIVATE_KEY=0x...
forge script script/Deploy.s.sol --rpc-url $RPC_URL_MAINNET --broadcast
```

## Production deployment

### API

1. Set `DATABASE_URL`, `CORS_ORIGIN`, `SIWE_DOMAIN`, `SIWE_URI` in production env.
2. Run `npm run build -w @vaultscout/api`.
3. Run `npx prisma migrate deploy` against production DB.
4. Start with `npm run start -w @vaultscout/api`.

### Web

1. Set `VITE_API_URL` to your API origin (production).
2. Set `VITE_WALLETCONNECT_PROJECT_ID`.
3. Run `npm run build -w @vaultscout/web`.
4. Serve the `apps/web/dist` folder with any static host, or `npm run preview -w @vaultscout/web`.

### Database

Use managed PostgreSQL (Neon, RDS, Supabase). Run migrations before starting the API.

## Testing

```bash
# API unit tests
npm run test

# Contracts
npm run test:contracts
```

## Default seed data

- Admin wallet: `0x0000000000000000000000000000000000000001`
- Sample alpha wallet and "ETH Momentum Mirror" strategy

## License

MIT
