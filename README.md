# QR Menu — Backend

Express + MongoDB API for the QR Menu platform. A restaurant owner signs up (which creates their
owner account and restaurant in one step), manages categories and menu items, and gets a public,
unauthenticated menu endpoint that the QR code links to.

## Local development

```bash
npm install
cp .env.example .env   # fill in MONGODB_URL and JWT_SECRET at minimum
npm run dev
```

Runs at `http://localhost:5050`. Health check: `GET /health`.

## Environment variables

See `.env.example`. Required: `MONGODB_URL`, `JWT_SECRET`. Optional: `CLOUDINARY_*` (image
uploads are skipped gracefully if unset — menu items/logos just won't have images), `FRONTEND_URL`
(comma-separated allowed CORS origins).

## API overview

All routes are prefixed `/api/v1`.

- `POST /auth/register` — sign up (creates owner + restaurant), `POST /auth/login`,
  `POST /auth/accesstoken` (refresh), `GET /auth/profile` (auth), `PUT /auth/password` (auth)
- `GET /restaurant/mine`, `PUT /restaurant/mine` (auth, multipart for logo)
- `GET /category/mine`, `POST /category`, `PUT /category/:id`, `DELETE /category/:id` (all auth)
- `GET /menu/mine`, `POST /menu`, `PUT /menu/:id`, `DELETE /menu/:id` (all auth, multipart for image)
- `GET /public/menu/:slug` — public, unauthenticated (the QR code destination)

Every write route other than `/auth/register` and `/auth/login` requires a `Bearer` access token.
Each owner has exactly one restaurant; ownership is derived from the token, never from a body/param.

## Deploy (Render)

`render.yaml` is set up for a one-click Render blueprint deploy. Otherwise, manually:

1. New Web Service, root directory `backend`.
2. Build command: `npm install`, start command: `npm start`.
3. Set env vars: `MONGODB_URL`, `JWT_SECRET` (generate a long random string), `FRONTEND_URL`
   (your deployed frontend origin), and `CLOUDINARY_*` if using image uploads.
4. Health check path: `/health`.

## Notes

- Passwords hashed with bcrypt; access tokens (15d) + refresh tokens (365d) via JWT.
- Rate limiting on `/api/v1/auth/*`, `helmet` security headers, CORS locked to `FRONTEND_URL`.
- Image uploads go to Cloudinary via in-memory multer + stream upload — nothing is written to disk.
