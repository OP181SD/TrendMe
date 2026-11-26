# TrendMe — Brand / Art Direction Prompt

Design prompt extracted from the codebase (`src/styles.css`, `src/routes/__root.tsx`, logo asset). Paste into any AI design tool. oklch values are the source of truth; hex are approximations.

## Direction artistique (DA)

Clean, premium SaaS / social-analytics feel. Warm off-white canvas, deep near-black ink text, a single vivid royal-blue accent. Soft and friendly: very round corners (radius 1.5rem), glow/aurora gradients, orbiting imagery, subtle shiny-text shimmer. Light, airy, generous whitespace. One accent color only — blue carries everything. Motion is ambient (aurora drift, orbit, shimmer) and respects `prefers-reduced-motion`.

Keywords: rounded, soft, premium, airy, blue-accent, glow, editorial, modern-SaaS.

## Logo

- Wordmark `trendme`, all-lowercase, rounded sans, heavy weight, in ink (near-black).
- The `m` is drawn as a wave / trend-line (upward curve) — the brand concept.
- Dot of the `i` is a solid blue circle (primary blue) — the only color spot.
- File: `src/assets/logo-trendme.png` (1152×576, transparent). Displayed `h-16 md:h-20`.
- Alt text / name: "TrendMe".

## Typographie

- **Display + Sans**: `Satoshi` (400, 500, 700, 900) — via Fontshare `https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900`. Fallback `system-ui, sans-serif`.
- **Mono**: `Departure Mono` (self-hosted, `/fonts/DepartureMono-Regular.woff2`). Fallback `ui-monospace, monospace`. Use for stats, numbers, labels, technical accents.

## Couleurs (light theme, oklch)

| Role | oklch | ~hex | Usage |
|------|-------|------|-------|
| background | `0.975 0.003 90` | `#f7f6f3` | warm off-white canvas |
| foreground | `0.17 0.005 260` | `#1f2024` | main text |
| card / popover | `1 0 0` | `#ffffff` | surfaces |
| **primary** | `0.58 0.2 258` | `#3b5bf5` | royal blue — buttons, accent, logo dot |
| primary-glow | `0.76 0.14 245` | `#6aa8ef` | sky blue — gradient end, glows |
| secondary / muted | `0.94 0.004 90` | `#eeede9` | subtle fills |
| muted-foreground | `0.5 0.01 260` | `#767680` | secondary text |
| accent | `0.93 0.03 255` | `#dde4f2` | tinted-blue fills |
| accent-foreground | `0.4 0.15 255` | `#3350a0` | text on accent |
| destructive | `0.65 0.2 25` | `#e5563f` | errors / danger |
| ink | `0.11 0.005 260` | `#141519` | near-black (logo, dark blocks) |
| border / input | `0 0 0 / 10%` | `rgba(0,0,0,.1)` | hairlines |
| ring | `0.66 0.19 255` | `#4f7bf0` | focus |

Charts (blue mono-ramp): `0.66 0.19 255`, `0.76 0.14 245`, `0.5 0.12 255`, `0.85 0.08 250`, `0.4 0.08 255`.

Sidebar: background `0.985 0.002 90` (near-white), primary `0.66 0.19 255` (blue).

## Tokens

- **Radius**: base `1.5rem` (very round). Scale sm→4xl = base ±.
- **Gradient primary**: `linear-gradient(135deg, primary, primary-glow)` — blue to sky blue, 135°.
- **Shadow elegant**: `0 20px 50px -24px oklch(0 0 0 / 25%)` — soft, deep, diffuse.
- **Spotlight**: `color-mix(primary 28%, transparent)`.
- **Signature effects**: `.aurora` (blurred blue radial glows, 60px blur, slow drift), `.shiny-text` (shimmer sweep across text), `.orbit` (images rotating around hero).

## One-line brief

> Modern social-analytics SaaS. Warm off-white background, near-black `Satoshi` text, one vivid royal-blue accent. Very rounded corners, soft deep shadows, blue aurora glows, `Departure Mono` for numbers. Friendly, premium, airy. Logo: lowercase rounded `trendme` wordmark, `m` as a trend-wave, blue dot on the `i`.
