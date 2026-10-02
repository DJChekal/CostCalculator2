# Aug Prep Tuition Calculator

## Pre-filling the calculator from the Halda form (URL parameters)

The calculator reads URL query parameters on load and pre-populates the matching
fields, so families don't have to re-enter answers they already gave in the Halda form.
Any parameter can be omitted; missing or unrecognized values simply leave that field blank.

| Field | Parameter (any of these names) | Accepted values |
|---|---|---|
| Campus | `campus`, `school`, `location` | anything containing `north` or `south` (e.g. `Aug Prep North`) |
| Lives in City of Milwaukee | `milwaukee`, `mke`, `milwaukee_resident`, `city_of_milwaukee`, `residency` | `yes`/`no`, `y`/`n`, `true`/`false`, `1`/`0` |
| Household size | `household_size`, `household`, `family_size` | `1`–`10` (e.g. `4` or `4 people`) |
| Annual household income | `income`, `annual_income`, `household_income` | a number; `$` and `,` are ignored (e.g. `$85,000`) |
| Student grade | `grade`, `grade_level`, `entering_grade`, `student_grade` | `K4`/`4K`/`Pre-K`, `K5`/`5K`/`K`/`Kindergarten`, `1`–`12`, `1st`…`12th`, `9th Grade` |
| Siblings enrolling | `sibling`, `siblings`, `sibling_discount` | `yes`/`no`, `true`/`false`, `1`/`0` |
| Show results immediately | `calculate` | `yes`/`true`/`1` — only runs when all five required fields are present |

Parameter names are case-insensitive and ignore `_`, `-`, `.` and spaces
(`household_size`, `householdSize` and `Household-Size` are equivalent).

Example:

```
https://<calculator-url>/?campus=north&milwaukee=yes&household_size=4&income=85000&grade=9th&siblings=no&calculate=yes
```

If the calculator is embedded in another page via an `<iframe>`, the parameters must be
added to the iframe's `src` URL (or forwarded from the parent page's URL to the iframe).

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
