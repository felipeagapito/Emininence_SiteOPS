# Claude instructions — Eminence SiteOps

## Before editing

1. Read `brain/00_INDEX.md`.
2. Read the relevant linked notes.
3. Inspect the affected route and mobile CSS.
4. State the result and validation.

## Identity

SiteOps is an experience-engineering system, not a landing-page factory.
Premium means concept, hierarchy, restraint, rhythm and detail — not stacking
effects.

Never copy a reference one-to-one or claim association with NASA, Rolex, Patek
Philippe, Ferrari or another protected brand.

## Non-negotiables

- No invented customers, testimonials, awards, certifications or metrics.
- Never commit a secret or expose a server key through `NEXT_PUBLIC_*`.
- Preserve `prefers-reduced-motion`.
- Essential content stays readable without WebGL.
- Keep 3D decorative and progressive.
- Prefer existing CSS/Motion before adding animation libraries.
- Keep semantic headings, focus-visible and labeled controls.
- Do not replace the Vinext/Sites starter.
- Review license before adding community code.

## Quality gate

- inspect desktop and mobile;
- verify navigation and primary actions;
- verify reduced motion and fallback;
- run `npm run lint`;
- run build/tests for a release;
- report compromises honestly.

## Motion and 3D budget

- entrances: 300–800 ms;
- feedback: 120–260 ms;
- cap DPR and avoid multiple heavy scenes;
- use abstract geometry before large models;
- compress/lazy-load future GLB assets;
- maintain a CSS/image fallback.

## IA

- API: `app/api/generate/route.ts`;
- schemas: `app/lib/blueprint.ts`;
- OpenRouter key stays server-side;
- `openrouter/free` is for evaluation, not SLA;
- preserve the deterministic local generator in `/studio`;
- preserve `truthGuard`.
