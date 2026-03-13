# Work Done

I've decided to go an extra mile on this assessment, and demonstrate all steps I would have done if that was a real project.

Main points:

- Project lacked basic tooling for code quality, tests and CI/CD. So I added it all.
- Refactored "god component" `web3-provider`, moved it to `components/providers`
- Finally, added missing logic on balance
- Added Balance component

There is still a lot of room for improvements, of course, but all main pain points are fixed. This amount of work would be impossible to do in 2 hours without Claude Code, which was heavily used for refactoring and tooling.

I hope this demonstrates my approach to work and my system thinking.

===

## Setup & DX

- Added `.gitignore` for Next.js/Node.js
- Added `CLAUDE.md` with project description, architecture, rules, and best practices
- Added `CHANGELOG.md` (Keep a Changelog format)
- Configured Vitest with stub tests for FE and BE
- Added GitHub Actions CI workflow (lint + tests)
- Added Husky + lint-staged pre-commit hooks

## Analysis

- Created `docs/high-level-issues-overview.md` — identified 9 issues across FE, BE, security, DX

## Core Task — Real-time Token Balances

- Added `ethBalance`, `dETHBalance`, `sETHBalance` as live state in web3 provider
- Balances update on connect, every 15s, and on account/chain change
- Created `<Balance />` component with `formatBalance` utility (8 decimals)
- Wired into navbar desktop dropdown and mobile wallet menu

## Refactoring

- Split `web3-provider.tsx` (~495 → ~260 lines) into `lib/web3/`:
  - `config.ts` — addresses, chain config, network params
  - `types.ts` — Web3ContextType, Contracts, Balances
  - `contracts.ts` — initContracts(), verifyContract()
  - `balances.ts` — fetchBalances() with parallel RPC calls
  - `ethereum.d.ts` — window.ethereum type declaration
- Moved providers to `components/providers/`
- Removed 30+ console.log calls from web3-provider
- Fixed `removeAllListeners()` → targeted `removeListener()`
- Marked dead `header.tsx` as unused
