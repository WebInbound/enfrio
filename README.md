# Enfrio

Engine cooling for Power Generation and Datacenter — corporate site of [Enfrio Srl](https://www.enfrio.it).

## Stack

- Next.js 16 (App Router) with React 19
- Static prerendering for every page; client interactions live in `src/components/SiteShell.tsx` and `src/components/MTowerSizer.tsx`
- Deployed on Vercel; the production domain is `www.enfrio.it`

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
```

## Routes

| Path | Source |
| --- | --- |
| `/` | `src/app/page.tsx` |
| `/solutions` | `src/app/solutions/page.tsx` |
| `/technology` | `src/app/technology/page.tsx` |
| `/industries` | `src/app/industries/page.tsx` |
| `/projects` | `src/app/projects/page.tsx` |
| `/company` | `src/app/company/page.tsx` |
| `/contact` | `src/app/contact/page.tsx` |
| `/tower-m` | `src/app/tower-m/page.tsx` (with M Tower sizing simulator) |
| `/qhse` | `src/app/qhse/page.tsx` |
| `/legal` | `src/app/legal/page.tsx` |
