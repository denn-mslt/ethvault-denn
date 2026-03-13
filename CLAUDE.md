# CLAUDE.md

## Project Description

ETHVault is a decentralized Ethereum staking and governance platform. Users connect their wallet to deposit ETH, receive dETH tokens, stake dETH for sETH, earn rewards, and vote on governance proposals. Targets the Holesky testnet.

## Architecture

### Frontend (Next.js 15 + React 18 + TypeScript)

- **App Router** (`app/`): Pages — home, deposit, stake, governance, leaderboard
- **Components** (`components/`): Feature components (deposit-withdraw, stake-unstake, governance, leaderboard, staking-dashboard) + shared (header, web3-provider, theme-provider)
- **Hooks** (`hooks/`): `use-toast`, `use-mobile`, `use-media-query`
- **Lib** (`lib/`): Utilities + contract ABIs (`lib/abis/`)
- **Styling**: Tailwind CSS + shadcn/ui (Radix primitives)
- **Blockchain**: ethers.js via `web3-provider.tsx` context

### Smart Contracts (`contracts/`) — Solidity

| Contract | Token | Purpose |
|---|---|---|
| `dETH.sol` | dETH (ERC20) | Deposit ETH, receive dETH |
| `sETH.sol` | sETH (ERC20) | Stake dETH, receive sETH |
| `Governance.sol` | — | Proposal creation, voting, execution |
| `StakingDashboard.sol` | — | Stats & leaderboard |

### Backend (`backend/`) — Express.js + MongoDB

- MVC pattern: `routes/` → `controllers/` → `models/` (Mongoose)
- Auth via JWT (`utils/jwtToken.js`, `middlewares/user_actions/auth.js`)
- File uploads, image compression, email (SendGrid)

### Running

```bash
pnpm install
pnpm dev          # starts both frontend (Next.js) and backend (Express) via concurrently
```

---

## Rules

### Core Rules

1. **Never commit or push without explicit user approval.** Always ask before running `git commit`, `git push`, or any destructive git operation.
2. **Follow user instructions exactly.** Do not make major changes, refactors, or architectural decisions without user approval. When in doubt — ask.
3. **Split work into small todos.** Break every task into small, trackable steps. Complete and verify each step before moving on.

### AI-Augmented Development Rules

4. **Read before you write.** Always read and understand existing code before proposing changes. Never guess at file contents or project conventions.
5. **Minimal diffs.** Change only what is necessary. Do not refactor surrounding code, add comments to untouched code, or "improve" things that weren't asked for.
6. **One concern per change.** Each change should address a single concern. Don't bundle unrelated fixes together.
7. **Always run linter and tests after changing code.** After every code change, run the linter and test suite before considering the task done. Fix any issues before moving on.
8. **Verify, don't assume.** If no tests exist for the area you changed, suggest adding them.
8. **Preserve existing patterns.** Match the style, naming conventions, and architecture already in the codebase. Don't introduce new patterns without discussion.
9. **Be explicit about uncertainty.** If you're unsure about the impact of a change or the correct approach, say so. Propose options rather than guessing.
10. **No secrets in code.** Never hardcode API keys, private keys, passwords, or other secrets. Use environment variables.

---

## Best Practices

### Code Quality

- **TypeScript strict mode** — avoid `any`; use proper types and interfaces
- **Components** — keep them small and single-responsibility; extract reusable logic into hooks
- **Naming** — descriptive variable/function names; no abbreviations unless universally understood
- **Error handling** — handle errors at system boundaries (API calls, wallet interactions); show user-friendly messages

### Web3 / Blockchain

- **Always validate wallet connection** before contract calls
- **Handle transaction failures gracefully** — users should see clear feedback on tx status
- **Use BigNumber / BigInt** for all token amounts — never use floating point for financial math
- **Display amounts in human-readable format** (e.g., format wei to ETH with proper decimals)

### Frontend

- **Server components by default** — only use `"use client"` when you need browser APIs or interactivity
- **Colocation** — keep page-specific logic close to the page; shared logic in `lib/` or `hooks/`
- **Accessibility** — use semantic HTML, proper ARIA attributes (shadcn/ui handles most of this)
- **Responsive design** — mobile-first; test on small viewports

### Git & Workflow

- **Atomic commits** — each commit should be a single logical change that builds and works
- **Commit messages fromat** — ALWAYS use use Conventional Commits for commit messages. ALWAYS state domain in ().
- **Descriptive commit messages** — explain *why*, not just *what*
- **Branch per feature** — don't work directly on `main` for non-trivial changes
- **Update CHANGELOG.md** for every user-facing change
