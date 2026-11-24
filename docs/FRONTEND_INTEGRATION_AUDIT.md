# PayPerView Frontend Integration Audit

**Date:** 2026-11-22  
**Scope:** Phase 1 audit of the outer repository at `C:\Users\Jebril\Desktop\PayPerView`. No application code was modified during the audit.

## Repository and runtime

- Next.js 16.3.0 App Router, React 19, JavaScript, `next-intl`, Tailwind CSS 4, and Axios.
- Existing route groups cover localized authentication, BRAND/advertiser workflows, CLIPPER/creator workflows, shared account settings, wallet, and chat. There is no `/admin` route group or admin dashboard.
- The outer repository is the requested workspace. A second Git checkout exists at `PayPerView/`; it has a separate remote and a large uncommitted change set. It was treated as a separate checkout and left untouched.
- The Main Backend is listening at `http://localhost:5000`. `GET /docs` and `GET /openapi.json` return the live Main Backend API documentation. OpenAPI declares `/api/v1` as its server prefix, matching the service paths when the base URL is the origin `http://localhost:5000`.
- The outer repository has no `.env*` file. The central Axios client defaults to `https://platform.apps.taqat.academy`, while several components use a different production host. `NEXT_PUBLIC_API_URL=http://localhost:5000` is the appropriate local origin for this checkout; it must not include a secret.
- A read-only CORS preflight from `http://localhost:3000` to the profile route returned 204 and allowed that origin, the required HTTP methods, and `Authorization`/`Content-Type` headers.
- The backend OpenAPI spec exposes route and request-schema information, but its operations do not declare auth/security requirements or role permissions consistently. Role checks must be confirmed with backend behavior or backend documentation.

## Existing integration map

| Area | Existing frontend coverage | Audit result |
| --- | --- | --- |
| Authentication | Registration, login, Google callback, logout, email verification, forgot/reset password, profile retrieval, localized protected routes | Main routes exist. `auth.js` and `authService.js` overlap. JWT is duplicated in `localStorage` and a JavaScript-readable cookie; no refresh endpoint exists in the live spec. Middleware checks the cookie while layouts make a second client-side role decision. The live spec includes `PATCH /auth/change-password`, but the account settings UI does not call it. |
| BRAND campaigns | Campaign list/create/edit/drafts, applications, clip review, campaign analytics, budgets, wallet, transactions, notifications | Most core endpoint families have service functions and appear in the live spec. Draft/campaign services turn API failures into local data or success-shaped responses, so a failed write can look successful. Several API implementations are duplicated. |
| CLIPPER | Profile, recommendations/discovery, applications/favorites, source materials, submission drafts, verification, submission/review status, content performance, earnings, withdrawals, notifications | Main campaign and submission flows have service coverage. Content performance fetches submissions, but creator earnings/audience screens remain sample-driven. `getSubmission` can send a `mockStatus` query that is not in OpenAPI. |
| ADMIN | Report, wallet review, withdrawal, view-snapshot review, and manual submission review service functions/endpoints exist in some domains | No admin page, dashboard, or protected admin layout exists. This is a UI gap, not a missing-backend-route conclusion. Sprint 8–10 restrictions prohibit adding a page without approval. |
| Wallet/payments | Funding, PayPal capture, bank transfer, Moyasar invoice redirect, transaction details, filtering, Excel/PDF export, refunds | Service functions include `MOYASAR`, new transaction filters, PDF export, and refund APIs. Transaction success polls the backend transaction endpoint. Refund screens currently render amount fields but do not present the newly documented `fee` and `netAmount` breakdown. Full live payment workflows need credentials and provider callbacks. |
| Notifications | Pull notifications, unread count, mark-read and mark-all-read | Backend services exist. The context also has local notification injection helpers and sample notification definitions; those must not be treated as persisted backend events. |
| AI chat | Thread create/list/delete, message history, and replies through `/api/v1/chat/threads` | The assistant uses Main Backend routes. Separate `MessagesContext`/`ConversationList` is seeded with hard-coded conversations and is not the AI thread store. Backend owns thread access. |
| Campaign AI | Campaign AI review and creator campaign recommendations | The existing review/recommendation services call Main Backend endpoints. Live OpenAPI also exposes draft AI assistance, campaign AI insights, and applicant ranking; no frontend calls for those routes were found. |
| Content/video AI | Submission detail can display backend-provided checks and score | Several result/review components substitute example score/check values when backend data is absent. No authenticated Main Backend video summary/scene-analysis route appears in OpenAPI, so those AI Service capabilities cannot be wired directly from the browser. |
| Wallet/earnings/fraud AI | Main Backend exposes wallet intelligence, creator earnings prediction, withdrawal intelligence, and flagged-view review routes | No frontend calls for these intelligence endpoints were found. Backend report triage exists, but there is no existing admin report queue page to host it. |

## Findings to address

### P0 — false or misleading platform state

- `src/services/drafts.js` and `src/services/campaignApi.js` contain local fallback behavior for drafts and success-shaped results for failed campaign mutations. Some submission and delete paths therefore report success without server confirmation.
- Sample records are embedded in creator earnings, audience insights, campaign clip overviews, creator discovery/detail, notification/message contexts, and transaction lists. A few are displayed by default rather than being gated as demo data.
- Submission result/review UI contains a `mockStatus` query path and default AI scores/check claims (for example, `96`/`100`) that can be mistaken for verified backend results.

### P1 — API and authentication consolidation

- API origins are inconsistent: `src/lib/axiosInstance.js` and multiple components use different hard-coded production origins; the local root environment is not configured.
- Direct API requests bypass the shared Axios client in profile/dashboard components. `ExplanationModal` calls `/api/clips/explanation`; no matching Next route or Main Backend operation is present in the outer repository/OpenAPI spec.
- API code is duplicated across `services/auth.js`/`authService.js`, campaign services and aliases, applications/creator campaign clients, and wallet services.
- The Axios client has no request timeout or refresh flow. Its current 401 redirect is global; there is no dedicated 403/timeout/network normalization beyond a shared error helper. The backend spec has no refresh-token endpoint.
- Browser-readable/localStorage token storage increases exposure to script injection. Moving to an HttpOnly cookie requires backend cookie/CSRF support and is a coordination item; frontend role checks remain presentation logic only.

### P1 — missing backend-backed features in existing interfaces

- Account settings does not call the live change-password endpoint.
- Brand campaign details/statistics do not call live AI ranking/insights routes; draft cards do not call AI assistance.
- Creator earnings and withdrawals do not use `/creator/earnings`, `/creator/earnings/prediction`, `/creator/withdrawals`, or withdrawal intelligence.
- Wallet UI does not call wallet intelligence, despite the backend route being present. Refund screens omit `fee` and `netAmount`.
- There is no UI for admin review workflows. Do not add a new page under the current Sprint restriction; document this dependency.

### Contract verification notes

- Live Main Backend route inventory and the checked Sprint 5/wallet notes agree on the core route families, including Moyasar funding, transaction PDF export, content submissions, and manual review.
- OpenAPI confirms `POST /auth/register` supports JSON and multipart, campaign create/draft routes use multipart, and profile update supports JSON and multipart.
- `GET /submissions/{id}` has no `mockStatus` query parameter in OpenAPI. The frontend-only query is a contract mismatch and should be removed.
- `/api/clips/explanation` is not present in Main Backend OpenAPI or as an outer-repository Next API route. It must be removed or documented as blocked unless the backend supplies a supported route.
- The backend UI docs and route schema establish the backend origin and API prefix, but do not prove authenticated request/response behavior for each role. No write or authenticated workflow was exercised during Phase 1.

## Integration plan

1. **Configuration and API client:** add safe environment examples for local and production, centralize the API origin, remove component-level origins, set timeout and normalized network/HTTP errors, and keep all browser traffic on Main Backend routes. Do not introduce refresh behavior unless the backend adds a refresh contract.
2. **Authentication:** consolidate duplicate auth paths; align route checks, login/logout, profile hydration, and localized 401 behavior; connect change-password within existing settings; retain server authorization as the security boundary. Coordinate any token-cookie migration with the backend.
3. **Core flows:** remove fake-success write fallbacks; map requests/responses against live OpenAPI; connect existing campaign, application, submission, wallet, withdrawal, and notification screens; add real loading/error/empty/success states within current pages.
4. **AI flows:** connect only documented Main Backend endpoints in existing interfaces (draft assistance, campaign review/insights/ranking, recommendations, persisted content checks, wallet/earnings/withdrawal intelligence, chat). Label predictions as estimates and use verified platform facts only for confirmed metrics. Do not call the AI Service from browser code.
5. **Unhosted items:** document video summaries/scene analysis if no Main Backend proxy exists; keep admin review UI blocked under the no-new-page restriction; do not invent endpoints or AI responses.
6. **Verification:** run the project build/lint tooling and use the live backend OpenAPI for route/payload checks. Exercise complete user workflows only where non-production test accounts/payment callbacks are available. Record unavailable workflows and credentials as not fully tested rather than claiming completion.

## Phase 1 disposition

The audit and implementation plan are complete. No application source code has been changed as part of Phase 1. Backend route/payload work can now proceed against the live Main Backend contract and within the existing page structure.

## Implementation and verification status

The work below was completed after Phase 1 in the existing route structure. It uses the Main Backend only; no frontend calls to an AI Service were added.

| Area | Status | Evidence and limits |
| --- | --- | --- |
| API origin and session handling | **Implemented; production build passed** | Browser requests use the shared Axios client and `NEXT_PUBLIC_API_URL`. The client has request timeouts, normalized errors, bearer-token handling, and expired-session cleanup. The Main Backend CORS preflight and OpenAPI docs were reachable locally. No refresh-token route is documented; the current token remains JavaScript-readable pending a backend cookie/CSRF contract. |
| Authentication and profile | **Connected in existing screens; workflow not fully tested** | Change-password uses `PATCH /api/v1/auth/change-password`. Existing login, profile, and protected route flows remain in place. No authenticated test account was supplied. |
| Campaigns and drafts | **Connected in existing screens; workflow not fully tested** | Draft create, auto-save, submit, list, delete, campaign copy, analytics, AI review/assistance/insights, and applicant ranking use documented Main Backend route families. Draft writes no longer fall back to browser storage or report success after an API failure. Multipart draft payloads follow the live contract. |
| Submissions and review | **Connected in existing screens; workflow not fully tested** | Existing creator and advertiser review screens use Main Backend submissions/review services. Unsupported clip-explanation requests were removed. Submission detail no longer invents an unknown status or platform, adds earnings from view snapshots, or displays TikTok-specific retry/error claims. |
| Wallet, refunds, and creator earnings | **Connected in existing screens; workflow not fully tested** | Existing funding, transaction, refund, budget, earnings, withdrawal, and supported intelligence services use the shared client. Refund calculations and transaction fields are displayed only when returned by the API; sample wallet balances and transaction records were removed. No payment-provider callback or authenticated payment flow was exercised. |
| Chat and notifications | **Connected in existing screens; workflow not fully tested** | Persisted chat threads and notifications use backend service calls. Local UI-only message or notification helpers are not treated as server events. |
| Creator audience insights | **Blocked: backend endpoint missing** | The existing screen explains that verified audience metrics are unavailable because the live OpenAPI spec has no matching endpoint. |
| Video summary and scene analysis | **Blocked: backend proxy missing** | No supported Main Backend endpoint exists in the live spec. Browser code does not call the AI Service directly. |
| Admin review UI | **Not implemented** | Admin API/service coverage exists in some domains, but this repository has no admin route or dashboard. No new page was added under the supplied scope constraint. |

### Verification performed

- Confirmed the local Main Backend API docs/OpenAPI and `/api/v1` server prefix, and a successful CORS preflight from the local frontend origin.
- Matched changed route families and request payloads against the live OpenAPI contract, including password change, multipart drafts, campaign copy, campaign date filters, refund requests, and submission views.
- `npm run build` passed on 2026-11-22: Next.js compiled successfully, TypeScript completed, and all routes were generated.
- `package.json` defines only `dev`, `build`, and `start`; there is no test or lint script.
- Full authenticated workflows remain **not fully tested** because no non-production account, role credentials, or payment-provider setup was available. Build success does not verify server-side authorization or provider behavior.

### Remaining integration dependencies

- Configure `NEXT_PUBLIC_API_URL` to the deployed Main Backend origin in the production build environment; the production example intentionally does not guess a host.
- Backend support is required before migrating bearer tokens to HttpOnly cookies and adding CSRF handling or refresh-token behavior.
- Backend must add the creator audience and video summary/scene analysis routes before those interfaces can show live data.
- Add or authorize an existing admin UI destination before exposing admin review workflows in the frontend.
