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
│   └── web/                    # Next.js 15 frontend
│       └── src/
│           ├── app/            # App Router pages
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
- Docker (for PostgreSQL)
- [Foundry](https://book.getfoundry.sh/getting-started/installation) (for contracts)

## Quick start

### 1. Install dependencies

```bash
npm install
```

### 2. Start PostgreSQL

```bash
docker compose up -d
```

### 3. Configure environment

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
```

### 4. Database setup

```bash
npm run db:push
npm run db:seed
```

### 5. Run development servers

```bash
# Both API (port 4000) and web (port 3000)
npm run dev

# Or separately:
npm run dev:api
npm run dev:web
```

Open [http://localhost:3000](http://localhost:3000).

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

1. Set `NEXT_PUBLIC_API_URL` to your API origin.
2. Set `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`.
3. Run `npm run build -w @vaultscout/web`.
4. Deploy to Vercel or any Node host (`npm run start -w @vaultscout/web`).

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
