# RentSphere Frontend

Angular application for the RentSphere real-estate rental marketplace.

## Tech Stack

- Angular 17+ (Standalone Components)
- TypeScript
- SCSS (with design system)
- Angular Router
- Reactive Forms
- RxJS
- AuthGuard / RoleGuard (planned)

## Design System

The design uses a modern SaaS aesthetic with:

| Token | Value |
|-------|-------|
| Primary | `#2563EB` |
| Secondary | `#7C3AED` |
| Accent | `#06B6D4` |
| Font | Inter |

Theme files are in `src/styles/`:
- `_variables.scss` — Colors, spacing, shadows, radii
- `_typography.scss` — Font sizes, weights, Google Fonts import
- `_mixins.scss` — Responsive breakpoints, button/card patterns
- `_components.scss` — Reusable utility classes

## Folder Structure

```
src/
├── app/
│   ├── core/           # Guards, interceptors, services, models
│   ├── shared/         # Shared components, pipes, directives
│   ├── layouts/        # Public, dashboard, admin layouts
│   └── features/       # Feature modules (auth, public, renter, etc.)
├── environments/       # Environment configs
├── styles/             # Design system partials
├── index.html
├── main.ts
└── styles.scss
```

## Development

```bash
npm install
ng serve
```

Opens at `http://localhost:4200`.
