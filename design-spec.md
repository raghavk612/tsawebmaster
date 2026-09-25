# Neuron Quest — Design Spec

Style family: **playful × modern-minimal**. Friendly and encouraging (it's a learning
game for teens) but clean enough that reading lessons is comfortable. Think
"Duolingo's warmth, Linear's restraint".

## Tokens (`src/styles/tokens.css`)

### Color
| Token | Value | Use |
|---|---|---|
| `--ink` | `#17142E` | Body text, headings |
| `--ink-2` | `#4A4668` | Secondary text (8.4:1 on bg) |
| `--bg` | `#FAF8F4` | Page background (warm off-white) |
| `--surface` | `#FFFFFF` | Cards |
| `--line` | `#E7E3DA` | Borders, dividers |
| `--primary` | `#5536E8` | Primary actions, links, focus (6.8:1 on white) |
| `--primary-soft` | `#EEEAFE` | Selected / hover tints |
| `--m1` `--m2` `--m3` | `#5536E8` · `#0B7A5C` · `#C23A2F` (all ≥ 5.3:1 with white) | Module identity: Fundamentals (violet), Tools (green), Ethics (coral) |
| `--xp` | `#8A5A12` on `#FFF4DC` (5.4:1) | XP, levels, rewards |
| `--ok` / `--bad` | `#0B7A5C` / `#C23A2F` | Correct / incorrect feedback (always paired with icon + text) |

### Type
- Headings: **Bricolage Grotesque** (600/700), tight tracking.
- Body/UI: **Atkinson Hyperlegible** (400/700) — designed by the Braille Institute for
  low-vision readability; 18px base for lesson text, 16px for UI.
- Scale: 14 · 16 · 18 · 22 · 28 · 36 · 52.
- Reading measure: max 68ch.

### Space, radius, depth
- 4px base scale: 4 · 8 · 12 · 16 · 24 · 32 · 48 · 72.
- Radius: 10px controls, 18px cards, 999px pills.
- Shadow: one soft card shadow; interactive cards lift 2px on hover.
- Motion: 150–250ms ease-out; confetti/pop only when `prefers-reduced-motion: no-preference`.

### Icons
lucide-react (ISC license), 1.75 stroke, always paired with a text label except
universally known actions (close ×, menu).

## Component rules
- **Buttons**: primary (filled violet), secondary (outline), ghost. One primary per view.
- **Module card**: color stripe = module color, progress ring, lesson count, CTA.
- **Activity shell**: title, one-line instructions (L0), activity, feedback area,
  "Check" → feedback → "Continue". Never drag-only.
- **Quiz**: one question at a time, choose → Check → explanation → Next. Result screen
  with XP earned and a retry option.
- **Toasts**: bottom-right (bottom on mobile), announce via `aria-live="polite"`.

## Layout
- Container max 1120px, 16px gutters on mobile, 24px desktop.
- Nav: logo, Learn, Dashboard, Glossary, About, XP pill (links to Dashboard). Collapses
  to a menu button < 760px. Footer carries References & Copyright + Work Log links.
