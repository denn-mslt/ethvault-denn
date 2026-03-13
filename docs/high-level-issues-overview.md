# High-Level Issues Overview

- [No Tests](#1-no-tests) — zero coverage on FE and BE
- [Frontend Code Quality](#2-frontend-code-quality) — god component, excessive console.logs, no API layer
- [FE ↔ BE Integration](#3-fe--be-integration) — frontend never calls backend; disconnected systems
- [Backend Endpoint Security](#4-backend-endpoint-security) — mixed auth coverage, reviews endpoint unprotected
- [Secrets Committed](#5-secrets-committed) — `.env` with credentials in git
- [Dead / Stub Code](#6-dead--stub-code) — unused Stripe stubs, duplicate component
- [Backend Architecture](#7-backend-architecture) — duplicate model files, bug in middleware
- [No CI/CD](#8-no-cicd) — linting configured but not enforced
- [Dependency Hygiene](#9-dependency-hygiene) — duplicate dep, unpinned `ethers`

---

## 1. No Tests

- Zero test files in the project (no `*.test.*` or `*.spec.*`)
- No test runner configured (no Jest, Vitest, or similar in `package.json`)
- No `test` script in `package.json`
- Need test coverage on both **frontend** and **backend**

## 2. Frontend Code Quality

- **`web3-provider.tsx` is a god component (~495 lines)** — mixes wallet connection, contract init, balance fetching, event listeners, and periodic polling into one monolithic context provider
- **Excessive `console.log`** — debug logging scattered across all components (30+ calls in web3-provider alone), should use a proper logger or be removed for production
- **No API/service layer** — contract calls are made directly inside components with duplicated try/catch/toast patterns
- **Duplicated balance-checking logic** — `getEthBalanceDirectly()` creates a new `JsonRpcProvider` on every call instead of reusing the existing one
- **Contract re-instantiation** — `refreshBalances()` and `connectWallet()` both create new contract instances instead of reusing state
- **`Number.parseFloat` for token amounts** — used throughout for comparisons (`deposit-withdraw.tsx`, `stake-unstake.tsx`, `governance.tsx`). Floating-point math is unsafe for financial values; should use BigInt/BigNumber comparisons
- **Non-English comments** — `stake-unstake.tsx` has Indonesian comments mixed with English code
- **Unused state** — `setActiveTab` in `deposit-withdraw.tsx` and `stake-unstake.tsx` is set but never read
- **`removeAllListeners()`** — cleanup in `web3-provider.tsx:428` removes ALL ethereum listeners, not just the ones this component added

## 3. FE ↔ BE Integration

- **Frontend never calls backend** — zero `axios`, `fetch()`, or API calls from any `.ts`/`.tsx` file
- Backend has full REST API (users, products, orders, payments) but FE only talks to smart contracts via ethers.js
- No shared types or API client between FE and BE
- These are effectively **two disconnected applications** shipped together

## 4. Backend Endpoint Security

- Auth middleware (`isAuthenticatedUser`) uses JWT from cookies — decent pattern
- Role-based access (`authorizeRoles`) on admin routes — good
- **Issues:**
  - `GET /admin/reviews` — **no auth middleware**, anyone can read all reviews
  - `DELETE /admin/reviews` — has `isAuthenticatedUser` but **no `authorizeRoles("admin")`**
  - `GET /products`, `GET /products/all`, `GET /product/:id` — public (may be intentional but worth verifying)
  - No rate limiting on any endpoints
  - No input validation middleware on routes (validator exists but unclear if wired up)
  - CORS `method` should be `methods` (typo in `cors.js:6`)

## 5. Secrets Committed

- `backend/.env` is checked into git with real/example credentials (DB passwords, API keys, JWT secrets, AWS keys, Stripe keys)
- Should be in `.gitignore` and replaced with `.env.example` containing placeholder values

## 6. Dead / Stub Code

- `backend/middlewares/helpers/price.js` — references `stripe` (never imported) and `sendCryptoTransaction` (never defined)
- `components/ui/use-mobile.tsx` — duplicate of `hooks/use-mobile.tsx`, marked as unused

## 7. Backend Architecture

- Duplicate model files (e.g., `orderModel.js` + `Order.js`, `userModel.js` + `User.js`) — unclear which is canonical
- `backend/middlewares/user_actions/userHas.js` — had a duplicate key bug (fixed via TODO comment)

## 8. No CI/CD

- No GitHub Actions, no pipeline config
- Linting (`eslint`, `prettier`) and `lint-staged` are configured but no automated enforcement

## 9. Dependency Hygiene

- `concurrently` listed in both `dependencies` and `devDependencies`
- `ethers: "latest"` — unpinned dependency, could break at any time
