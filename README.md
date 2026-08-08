# HH Goa 2026 — visual v2

This version is intentionally redesigned around the supplied HH Goa screenshots:
- dark Goa-green landing/dashboard
- oversized yellow HACKER HOUSE masthead
- Goa pink/yellow sticker
- centered upload card with Choose Image + Webcam
- Builder ID Card / PFP Frame selector
- illustrated cream ID card with Goa/postcard/palm/stamp/signage motifs
- real PNG output
- HEIC/HEIF conversion
- client-side photo processing
- native mobile share with generated PNG
- desktop X intent fallback

Run:
npm install
npm run dev

Build:
npm run build

Vercel:
Framework Vite
Build command npm run build
Output directory dist
No environment variables.


## v3 reference-matched card
The generator now uses the supplied HH Goa 2026 reference artwork as the base template and replaces the sample portrait/name/role/lower ID-card fields at generation time. The supplied artwork is included at `public/hh-goa-reference.png`.
