# OpenDeFi

A simplified DeFi analytics platform built with Next.js, TypeScript, and ethers.js. Features real-time token analytics, liquidity pool tracking, and price monitoring using Uniswap V2 smart contracts. Includes token metadata retrieval, multicall optimization, and shadcn/ui components. It follows the tutorial from [The Halftime Code](https://www.thehalftimecode.com/open-defi-learn-how-poocoin-dextools-and-dexscreener-work/) on how to build a DeFi platform.

## Features

- Real-time token price tracking and analytics
- Liquidity pool discovery and analysis
- Token metadata and supply tracking
- Burn address monitoring
- Multicall optimization for efficient data fetching
- WETH price oracle integration
- Responsive UI with shadcn/ui components

## Tech Stack

- Next.js 15 with TypeScript
- ethers.js v6 for blockchain interactions
- Multicall provider for batched requests
- ShadCN/UI for modern components
- Uniswap V2 smart contracts

## Quick Start

```bash
pnpm create next-app opendefi --template typescript
cd opendefi
pnpm add ethers@^6.0.0 @ethers-ext/provider-multicall
npx shadcn@latest init
npx shadcn@latest add input button card alert table skeleton
```

## Environment Setup

Create a `.env.local` file:

```bash
NEXT_PUBLIC_RPC_URL=https://go.getblock.io/YOUR_API_KEY
```

You can create a free RPC at [GetBlocks](https://account.getblock.io/sign-in?ref=MzZhNDk3YzItOWI1Zi01YmM0LWFjNzYtZGRhYzY5OTEwNTJj)

## Project Structure

```
opendefi/
├── src/
│   ├── services/
│   │   ├── token-service.ts
│   │   └── constants.ts
│   ├── types/
│   │   └── token.ts
│   └── app/
│       ├── api/
│       │   └── token/
│       │       └── route.ts
│       └── page.tsx
├── package.json
└── tsconfig.json
```

## Development

```bash
pnpm dev
```

## Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add `NEXT_PUBLIC_RPC_URL` to Vercel environment variables
4. Deploy

## Tutorial

For a detailed walkthrough of building this project, including token service implementation, UI components, and deployment instructions, check out the full tutorial at [The Halftime Code](https://www.thehalftimecode.com/open-defi-learn-how-poocoin-dextools-and-dexscreener-work/).

## License

MIT
