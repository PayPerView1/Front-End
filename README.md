# PayPerView Frontend

Localized Next.js 16 App Router frontend for the PayPerView platform. Browser requests go through the centralized Axios client to the Main Backend; the frontend never calls the AI Service directly.

## Local development

1. Install dependencies with `npm install`.
2. Copy `.env.development.example` to `.env.local` if the local Main Backend is not already configured. The local backend origin is `http://localhost:5000`.
3. Start the frontend with `npm run dev` and open `http://localhost:3000`.

`NEXT_PUBLIC_API_URL` is the Main Backend **origin**. Service functions add `/api/v1` to endpoint paths. Do not put credentials, AI service URLs, or API keys in this variable. The backend API reference is available at `http://localhost:5000/docs` while the local backend is running.

## Production configuration

Set `NEXT_PUBLIC_API_URL` in the production build environment to the deployed Main Backend origin before running `npm run build`. Next.js inlines `NEXT_PUBLIC_*` variables at build time, so changing the deployment variable after the build does not change the client bundle. See `.env.production.example` for the expected variable.

## Existing feature structure

- `src/app/[locale]`: localized authentication, advertiser, creator, campaign, wallet, and account settings screens.
- `src/services`: domain API services for auth, profile, campaigns, applications, submissions, notifications, chat, and wallet.
- `src/features`: wallet and profile feature components/services.
- `src/lib/axiosInstance.js`: Main Backend origin, bearer-token attachment, timeout, session-expiry handling, and normalized API errors.
- `API_CONTRACT_SPRINT5.md` and `New Updates.md`: supplied backend contract notes.
- `docs/FRONTEND_INTEGRATION_AUDIT.md`: audit findings, implemented integrations, verification status, and backend blockers.

## Verification commands

`package.json` currently defines `dev`, `build`, and `start`; it does not define a test or lint script. Use `npm run build` for the production compilation check. Authenticated workflow checks require a non-production backend account and the relevant payment/provider setup.
