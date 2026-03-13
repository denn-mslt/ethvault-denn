# High-Level Issues Overview

- [No Tests](#1-no-tests) — DONE (framework + stubs)
- [Frontend Code Quality](#2-frontend-code-quality) — PARTIALLY DONE (web3-provider refactored, console.logs removed, listeners fixed)
- [FE ↔ BE Integration](#3-fe--be-integration) — not addressed (BE is unrelated e-commerce app)
- [Backend Endpoint Security](#4-backend-endpoint-security) — not addressed
- [Secrets Committed](#5-secrets-committed) — not addressed
- [Dead / Stub Code](#6-dead--stub-code) — PARTIALLY DONE (header marked unused)
- [Backend Architecture](#7-backend-architecture) — not addressed
- [No CI/CD](#8-no-cicd) — DONE (GitHub Actions)
- [Dependency Hygiene](#9-dependency-hygiene) — not addressed

---

## 1. No Tests — DONE

- ~~Zero test files in the project (no `*.test.*` or `*.spec.*`)~~
- ~~No test runner configured (no Jest, Vitest, or similar in `package.json`)~~
- ~~No `test` script in `package.json`~~
- ~~Need test coverage on both **frontend** and **backend**~~
- Vitest configured with stub tests for FE and BE. Full coverage still needed.

## 2. Frontend Code Quality — PARTIALLY DONE

- ~~**`web3-provider.tsx` is a god component (~495 lines)**~~ — refactored to ~260 lines, logic extracted to `lib/web3/`
- ~~**Excessive `console.log`**~~ — removed 30+ calls from web3-provider
- **No API/service layer** — contract calls still made directly in components
- ~~**Duplicated balance-checking logic**~~ — consolidated into `fetchBalances()` with parallel requests
- ~~**Contract re-instantiation**~~ — consolidated into `initContracts()`
- **`Number.parseFloat` for token amounts** — still used in components for comparisons
- **Non-English comments** — `stake-unstake.tsx` still has Indonesian comments
- **Unused state** — `setActiveTab` still unused in deposit-withdraw and stake-unstake
- ~~**`removeAllListeners()`**~~ — fixed to use targeted `removeListener()`

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

## 6. Dead / Stub Code — PARTIALLY DONE

- `backend/middlewares/helpers/price.js` — references `stripe` (never imported) and `sendCryptoTransaction` (never defined)
- ~~`components/ui/use-mobile.tsx` — duplicate of `hooks/use-mobile.tsx`, marked as unused~~
- `components/_header.tsx` — marked as unused (renamed with `_` prefix + TODO)

## 7. Backend Architecture

- Duplicate model files (e.g., `orderModel.js` + `Order.js`, `userModel.js` + `User.js`) — unclear which is canonical
- `backend/middlewares/user_actions/userHas.js` — had a duplicate key bug (fixed via TODO comment)

## 8. No CI/CD — DONE

- ~~No GitHub Actions, no pipeline config~~
- ~~Linting (`eslint`, `prettier`) and `lint-staged` are configured but no automated enforcement~~
- GitHub Actions workflow added (lint + tests on push/PR)
- Husky + lint-staged pre-commit hook added

## 9. Dependency Hygiene

- `concurrently` listed in both `dependencies` and `devDependencies`
- `ethers: "latest"` — unpinned dependency, could break at any time
