# Project Structure Analysis

## Project Overview
This is a Next.js frontend application for "QuoteChaser," an automated email follow-up service designed to manage and follow up on submitted business quotes. The application features:
- Authentication system
- Dashboard with metrics and quote tracking
- Quote management and editing
- Marketing landing page with pricing and features sections
- Legal terms and privacy policy pages

---

## 1. Project Structure

### Directory Layout
```
src/
├── app/
│   ├── error.tsx
│   ├── loading.tsx
│   ├── quote/[id]/page.tsx
│   ├── page.tsx
│   ├── dashboard/
│   │   ├── layout.tsx
│   │   ├── dashboard/
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── quote-detail.tsx
│   │   │   ├── quote-list.tsx
│   │   │   ├── metric-cards.tsx
│   │   │   ├── quote-list.tsx (duplicate)
│   │   │   ├── index.tsx
│   │   │   ├── quotes/
│   │   │   │   ├── quote-detail.tsx
│   │   │   │   ├── quote-list.tsx
│   │   │   │   └── index.tsx
│   │   └── settings/
│   │       ├── layout.tsx
│   │       ├── dashboard/
│   │       │   ├── dashboard/settings/page.tsx
│   │       │   ├── dashboard/settings/profile-form.tsx
│   │       └── quotes/
│   ├── marketing/
│   │   ├── page.tsx
│   │   ├── terms/page.tsx
│   │   ├── privacy/page.tsx
│   │   ├── landing-client.tsx
│   │   └── pricing-section.tsx
│   ├── auth/
│   │   ├── login/page.tsx
│   └── globals.css
├── components/
│   ├── ui/
│   │   ├── alert.tsx
│   │   ├── badge.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── input-group.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── message.tsx
│   │   ├── progress.tsx
│   │   ├── select.tsx
│   │   ├── separator.tsx
│   │   ├── sheet.tsx
│   │   └── tab.tsx
│   ├── dashboard/
│   │   ├── index.tsx
│   │   ├── metric-cards.tsx
│   │   ├── quote-detail.tsx
│   │   ├── quote-list.tsx
│   │   ├── mobile-nav.tsx
│   │   ├── sidebar-nav.tsx
│   │   ├── stripe-button.tsx
│   │   ├── quote-list.tsx (duplicate)
│   │   └── quote-detail.tsx
│   └── marketing/
│       ├── hero-section.tsx
│       ├── landing-client.tsx
│       ├── sections/
│       │   ├── about-section.tsx
│       │   ├── cta-section.tsx
│       │   ├── features-section.tsx
│       │   ├── hero-section.tsx
│       │   ├── pricing-section.tsx
│       │   └── site-footer.tsx
│       └── ui/
│           └── roll-text.tsx
├── lib/
│   ├── email.ts
│   ├── supabase/
│   │   ├── admin.ts
│   │   ├── client.ts
│   │   ├── proxy.ts
│   │   └── server.ts
│   └── utils.ts
├── components.json
└── package.json
```

---

## 2. Key Packages

### Frontend Stack
- **Next.js 13** - Server-side API with React Router
- **TypeScript** - Frontend development language
- **React** - UI library and component library
- **RSC (React Server Components)** - React 18+ native features
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **shadcn/ui** - Material UI components
- **Tailwind CSS** - CSS framework
- **Shadcn/Tailwind** - Reusable UI components
- **supabase** - Backend database with PostgreSQL

### Backend Dependencies
- **Prisma ORM** - Database schema definition
- **Supabase** - PostgreSQL, Auth, Storage, Database, Admin
- **TypeScript** - Backend type definitions
- **Tailwind CSS** - Backend utility classes

### Environment Variables
- **NEXT_PUBLIC_SITE_URL** - Public domain URL for Google/SEO
- **NEXT_PUBLIC_API_URL** - API URL for authentication

---

## 3. Critical Modules & Functions

### App Router Routes
1. `src/app/layout.tsx` - Root layout with theme provider
2. `src/app/page.tsx` - Landing page with landing client component
3. `src/app/(auth)/login/page.tsx` - Login component
4. `src/app/(dashboard)/layout.tsx` - Dashboard layout
5. `src/app/(dashboard)/dashboard/page.tsx` - Main dashboard
6. `src/app/(dashboard)/settings/page.tsx` - Dashboard settings
7. `src/app/(marketing)/page.tsx` - Marketing landing page
8. `src/app/(marketing)/terms/page.tsx` - Legal terms
9. `src/app/(marketing)/privacy/page.tsx` - Legal privacy policy
10. `src/app/(marketing)/page.tsx` (duplicate) - Terms page

### API Routes
- **`src/app/api/auth/`** - Authentication endpoints
  - `/users` - User retrieval
  - `/users/me` - Get user profile
  - `/logout` - User logout
  - `/verifyToken` - Token verification

### Components
#### Main Components
- `src/app/dashboard/index.tsx` - Dashboard main entry
- `src/app/dashboard/quote-detail.tsx` - Single quote detail view
- `src/app/dashboard/quote-list.tsx` - Quote list view
- `src/components/ui/button.tsx` - Reusable button component
- `src/components/ui/card.tsx` - Reusable card component
- `src/components/ui/select.tsx` - Reusable select component
- `src/components/ui/alert.tsx` - Alert component
- `src/components/ui/progress.tsx` - Progress component

#### Marketing Components
- `src/components/ui/hero-section.tsx` - Hero section
- `src/components/ui/landing-client.tsx` - Marketing landing client
- `src/components/ui/roll-text.tsx` - Text rolling animation
- `src/components/ui/table.tsx` - Quote table
- `src/components/ui/dashboard/sidebar-nav.tsx` - Dashboard sidebar
- `src/components/ui/dashboard/mobile-nav.tsx` - Dashboard mobile nav

#### Sub-components
- `src/components/ui/empty.tsx` - Empty state component
- `src/components/ui/avatar.tsx` - Avatar component
- `src/components/ui/skeleton.tsx` - Skeleton loader
- `src/components/ui/dialog.tsx` - Dialog component

---

## 4. Key Files

### Critical Configuration Files
1. **`src/app/layout.tsx`** - Next.js root layout
2. **`src/app/page.tsx`** - Landing page configuration
3. **`src/components.json`** - Shadcn UI component registry
4. **`src/lib/email.ts`** - Email utility functions

### Database & Auth
1. **`src/lib/supabase/server.ts`** - Supabase database connection
2. **`src/lib/email.ts`** - Email sender configuration
3. **`src/app/(auth)/login/page.tsx`** - Login flow
4. **`src/components/ui/avatar.tsx`** - Image avatar component

### Marketing Content
1. **`src/app/(marketing)/page.tsx`** - Marketing landing page root
2. **`src/components/ui/hero-section.tsx`** - Hero section component
3. **`src/components/ui/landing-client.tsx`** - Marketing landing client
4. **`src/components/ui/roll-text.tsx`** - Text animation component
5. **`src/app/(marketing)/pricing-section.tsx`** - Pricing page

### Layouts
1. **`src/app/(auth)/login/page.tsx`** - Auth login page
2. **`src/app/(dashboard)/dashboard/page.tsx`** - Dashboard main page
3. **`src/app/(marketing)/page.tsx`** - Marketing landing page
4. **`src/app/(marketing)/privacy/page.tsx`** - Privacy policy page
5. **`src/app/(marketing)/terms/page.tsx`** - Terms of service page

### Error & Loading Pages
1. **`src/app/error.tsx`** - Error page
2. **`src/app/loading.tsx`** - Loading page

---

## 5. Database Schema (Prisma)

See `src/lib/supabase/admin.ts` - Prisma schema definition

---

## 6. Technologies Used

- **Next.js 13 + TypeScript** - Framework
- **React 18+** - Library
- **Tailwind CSS** - Styling
- **RSC (React Server Components)** - Modern architecture
- **Next.js Route Preloading (RPT)** - Performance optimization
- **RSC Next (RSC Next)** - New Next.js architecture
- **Prisma ORM** - Database abstraction
- **Supabase** - Database & Auth
- **Lucide React** - Icons
- **shadcn/ui** - Reusable UI
- **shadcn/ui/icons** - Icon libraries
- **shadcn/ui/interactive** - Interactive elements

---

## 7. Project Notes

- The application uses a single domain URL (`quotechaser.com`) for SEO
- Auth flow includes login redirect to dashboard
- Marketing landing client is imported and used in `/marketing` routes
- The `src/components/ui/select.tsx` is imported from `@base-ui/react/select` - a base UI library
- `components.json` defines aliases for components and utils directories
- Uses `lucide-react` for icons with Tailwind styling
