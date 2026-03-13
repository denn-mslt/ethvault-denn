# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

- Default `.gitignore` for Next.js, Node.js, and environment files
- Prettier with default rules and `pnpm format` command
- ESLint with separate configs and commands for frontend and backend
  - `lint:fe`: TypeScript-ESLint + Next.js core-web-vitals rules
  - `lint:be`: ESLint recommended with Node.js/browser globals
  - `lint`: runs both

### Fixed

- Removed unused variables and imports across frontend components
- Replaced empty interfaces with type aliases (`InputProps`, `TextareaProps`)
- Replaced `require()` with ESM import in `tailwind.config.ts`
- Inlined `actionTypes` const as a type in `use-toast.ts`
- Replaced `any` casts with proper types in `staking-dashboard.tsx` and `web3-provider.tsx`

## [0.1.0] - 2026-03-13

### Initial commit, copy of repo.

- Initial project setup with Next.js 15, React 18, TypeScript, and Tailwind CSS
- Web3 provider integration with ethers.js for Ethereum wallet connectivity
- DepositETH (dETH) ERC20 token contract for ETH deposits
- StakedETH (sETH) ERC20 token contract for staking dETH
- Governance contract for proposal creation, voting, and execution
- StakingDashboard contract for statistics and leaderboard
- UI components built with shadcn/ui and Radix primitives
- Custom React hooks for blockchain interactions
- Express.js backend server
- Holesky testnet support
- Dark/light theme support via next-themes
