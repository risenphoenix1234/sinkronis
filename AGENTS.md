# AGENTS.md — Sinkronis Architecture & AI Coding Guidelines

> **Sinkronis (enterprise-suite)** is an enterprise-grade, multi-tenant SaaS platform unifying HRIS, Payroll, Accounting, Tenant Administration, Platform Administration, Manager Portals, and Employee Self-Service.

This document is the authoritative architectural specification and coding guide for AI assistants and engineers working on this repository. Follow all rules, patterns, and conventions detailed below.

---

## 1. System Architecture & Topology

### 1.1 Multi-Tenant & Role Hierarchy
Sinkronis is organized into distinct sub-applications (portals) served through Next.js App Router:

| Portal / Module | Route Prefix | Primary Layout & Guard | Core Purpose |
| :--- | :--- | :--- | :--- |
| **Marketing & Landing** | `/` | `RootLayout` (`src/app/layout.tsx`) | Public landing, pricing modules, features, testimonials |
| **Authentication** | `/(auth)` | `src/app/(auth)/...` | Login, registration, password setup/reset, OTP verification |
| **Platform Admin** | `/platform-admin` | `PlatformAdminLayout` (`getMe()`, checks `accountType === "PLATFORM_ADMIN"`) | Global SaaS ops: tenant management, platform plans, billing, user directory, system modules |
| **Tenant Admin** | `/tenant-admin` | `TenantAdminLayout` | Organization setup (branches, departments, work schedule), role-based access, audit logs, subscription plan |
| **HRIS** | `/hris` | `HRISLayout` (`src/app/hris/layout.tsx`) | Employees, onboarding, attendance tracking, leave requests, appraisals, conduct & queries |
| **Payroll** | `/payroll` | `PayrollLayout` (wrapped with `PayeeProvider`, `DeductionProvider`, `WalletProvider`) | Pay runs, payslips, deductions, payee records, tax (PAYE), pension, payroll wallets |
| **Accounting** | `/accounting` | `AccountingLayout` (`src/app/accounting/layout.tsx`) | Clients/customers, invoices, items & services, projects, expenses, payments, wallets |
| **Manager Portal** | `/manager` | `ManagerLayout` (`src/app/manager/layout.tsx`) | Manager team view: reportees, team attendance, approvals, team appraisals |
| **Employee Portal** | `/employee` | `EmployeeLayout` (`src/app/employee/layout.tsx`) | Self-service: employee profile, personal attendance, leave applications, self-appraisals, inbox |

---

## 2. Technology Stack

- **Framework**: Next.js `14.2.5` (App Router)
- **Runtime & Language**: React `18.2.0`, TypeScript `5.4.5` (`strict: true`, ES2021)
- **Styling**: Tailwind CSS `3.4.3`, PostCSS, `class-variance-authority` (cva), `clsx`, `classnames`
- **Icons**:
  - Primary UI & Sidebar: `react-icons/fi`, `react-icons/ri`, `react-icons/bi`
  - Specialized components: `lucide-react`
  - Legacy/Specific: `@fortawesome/react-fontawesome`
- **Charts & Data Visualization**: `recharts` (`3.10.1`)
- **Toasts & Notifications**: `react-toastify` (`11.1.0`) (configured globally in `src/app/layout.tsx`) and `react-hot-toast` (`2.6.0`)
- **HTTP Client**: Axios `1.19.0` with centralized instance in `src/lib/axios.ts`
- **Backend API**: `https://sinkronis-backend.vercel.app/api/v1` (configured via `NEXT_PUBLIC_API_BASE_URL`)

---

## 3. Directory Layout & Module Structure

```
Sinkronis/
├── public/                     # Static assets (images, icons, SVGs)
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Auth route group (login, register, setup-password, etc.)
│   │   ├── accounting/         # Accounting portal pages & layout
│   │   ├── employee/           # Employee self-service portal pages & layout
│   │   ├── hris/               # HRIS portal pages & layout
│   │   ├── manager/            # Manager portal pages & layout
│   │   ├── payroll/            # Payroll portal pages & layout
│   │   ├── platform-admin/     # Platform admin portal pages & layout
│   │   ├── tenant-admin/       # Tenant admin portal pages & layout
│   │   ├── globals.css         # Global Tailwind directives & shared utility classes
│   │   ├── layout.tsx          # Root HTML layout with ToastContainer
│   │   └── page.tsx            # Root marketing landing page
│   ├── components/
│   │   ├── ui/                 # Reusable atomic UI components (Button, Input, Modal, Table, StatusBadge, etc.)
│   │   │   └── hooks/          # UI-level hooks (e.g. useAuth)
│   │   ├── layout/             # Shell navigation components (Navbar, Sidebar, DashboardLayout)
│   │   ├── modals/             # Global and module modal dialogs
│   │   │   ├── Hris/           # HRIS modal forms (leave, appraisal, disputes, employee filter)
│   │   │   └── Employee/       # Employee portal modals
│   │   ├── shared/             # Compound shared components (PageHeader, EmptyState, footer)
│   │   ├── hris/               # HRIS domain-specific components (attendance, appraisal, employees, Leave)
│   │   ├── payroll/            # Payroll domain-specific components
│   │   ├── employee/           # Employee domain-specific components
│   │   ├── landing/            # Landing page sections (Hero, Features, Pricing, etc.)
│   │   └── ModuleRail.tsx      # Persistent 3-module rail switcher (HRIS, Accounting, Payroll)
│   ├── context/
│   │   └── payroll/            # Payroll state providers (DeductionContext, PayeeContext, WalletContext)
│   ├── data/                   # Mock data records used for static prototype fallback
│   │   ├── employee/
│   │   ├── hris/
│   │   └── payroll/
│   ├── hooks/                  # Custom React hooks (e.g., useHRISDashboard)
│   ├── lib/
│   │   ├── api/                # Live REST API service layer
│   │   │   ├── auth.ts         # Authentication API calls
│   │   │   ├── hris.ts         # HRIS API services (employees, attendance, appraisal, leave)
│   │   │   ├── platform-admin.ts # Platform admin API services
│   │   │   └── types/          # API Request/Response DTO contracts (api.ts, hrisTypes.ts, etc.)
│   │   ├── axios.ts            # Configured Axios instance with JWT interceptor & 401 handling
│   │   ├── validation.ts       # Form validation schemas and helpers
│   │   └── *-data.ts           # Mock datasets for platform admin and tenant settings
│   ├── types/                  # Internal frontend TypeScript definitions & models
│   └── utils/
│       ├── cn.ts               # Classnames joiner function: cn(...classes)
│       ├── timeAgo.ts          # Relative timestamp formatter
│       └── phoneField.ts       # Phone input formatting utilities
├── tailwind.config.ts          # Tailwind design tokens (primary, card, muted, border, shadows)
├── tsconfig.json               # TypeScript path alias (@/* -> src/*)
└── vercel.json                 # Deployment configuration
```

---

## 4. Design System & Styling Conventions

### 4.1 Color Palette & Theme Tokens
Always reference Tailwind classes mapped to project design tokens defined in `tailwind.config.ts`:

- **Primary**: `#2183C6`
  - Use `bg-primary text-white hover:bg-[#1b6aa2]`
  - Focus rings: `focus:ring-2 focus:ring-primary/30`
- **Muted**:
  - `bg-muted` (`#f3f4f6`), `text-muted-foreground` (`#6b7280`)
- **Card**:
  - `bg-card` (`#ffffff`), `text-card-foreground` (`#111827`)
- **Borders & Dividers**:
  - `border-border` (`#e5e7eb`) or `border-slate-200`
- **Shadows**:
  - `shadow-card` (`0 1px 2px rgba(0,0,0,.04), 0 8px 24px rgba(0,0,0,.06)`)
- **Global Helper Classes** (`src/app/globals.css`):
  - `.card` → `@apply bg-white rounded-lg shadow-sm border border-gray-200;`
  - `.h1` → `@apply text-2xl font-semibold;`
  - `.h2` → `@apply text-xl font-semibold;`

### 4.2 UI Component Guidelines
Whenever building or editing screens, use the atomic components from `@/components/ui`:

1. **Buttons**:
   ```tsx
   import Button from "@/components/ui/Button";
   // Variants: 'primary' | 'outline' | 'ghost'
   // Sizes: 'sm' | 'md' | 'lg'
   <Button variant="primary" size="md" onClick={handleSave}>Save Changes</Button>
   ```
2. **Inputs**:
   ```tsx
   import Input from "@/components/ui/Input";
   <Input placeholder="Search records..." value={search} onChange={(e) => setSearch(e.target.value)} />
   ```
3. **Status Badges**:
   Always use `@/components/ui/StatusBadge` for statuses (e.g. `Pending`, `Approved`, `Rejected`, `Active`, `Resolved`):
   ```tsx
   import StatusBadge from "@/components/ui/StatusBadge";
   <StatusBadge status="Approved" variant="pill" />
   ```
4. **Class Name Merging**:
   Use `@/utils/cn`:
   ```tsx
   import { cn } from "@/utils/cn";
   <div className={cn("base-styles", isSelected && "bg-primary text-white", className)} />
   ```

---

## 5. Portal Navigation & Shell Layouts

All portal pages run inside `DashboardLayout` (`@/components/layout/DashboardLayout.tsx`):
- **Top Bar**: `Navbar` with current user context, notifications, and profile menu.
- **Left Module Rail**: `ModuleRail` (`@/components/ModuleRail.tsx`) switches between `HRIS`, `Accounting`, and `Payroll`.
- **Sidebar**: `Sidebar` (`@/components/layout/Sidebar.tsx`) renders the module's section hierarchy with collapsible child items and an animated active indicator.
- **Main Container**: `<main className="min-w-0 flex-1 overflow-y-auto">`.

When adding new routes to any module:
1. Create the page file under `src/app/<module>/<feature-name>/page.tsx`.
2. Add the route definition to `sidebarItems` in `src/app/<module>/layout.tsx`.
3. If using an icon, ensure it is mapped in `sidebarIcons` inside `src/components/layout/Sidebar.tsx`.

---

## 6. API Layer & Data Fetching Patterns

### 6.1 Centralized Axios Client (`src/lib/axios.ts`)
- All backend communication must pass through `@/lib/axios`.
- Automatic authorization header injection:
  ```ts
  Authorization: Bearer ${localStorage.getItem("accessToken")}
  ```
- Handled globally: `401 Unauthorized` removes token and redirects to `/login`.
- Base URL is derived from `process.env.NEXT_PUBLIC_API_BASE_URL`.

### 6.2 Standard API Response Envelope (`src/lib/api/types/api.ts`)
The Sinkronis backend returns responses wrapped in `ApiResponse<T>`:
```ts
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errorCode?: string | null;
  validationErrors?: unknown;
  metadata?: Record<string, unknown>;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}
```

### 6.3 Writing API Service Functions (`src/lib/api/`)
Place all endpoint calls inside domain service files:
- `src/lib/api/auth.ts`: Authentication, user verification (`getMe()`).
- `src/lib/api/hris.ts`: HRIS employees, departments, attendance, disputes, leaves, appraisals.
- `src/lib/api/platform-admin.ts`: Platform tenants, plans, platform billing.

**Standard Service Function Convention**:
```ts
import api from "@/lib/axios";
import { ApiResponse } from "@/lib/api/types/api";
import { EmployeeListItem, GetEmployeesParams } from "./types/hrisTypes";

export const getEmployees = async (params?: GetEmployeesParams): Promise<EmployeeListItem[]> => {
  const response = await api.get<ApiResponse<EmployeeListItem[]>>("/hris/employees", { params });
  return response.data.data;
};
```

---

## 7. State Management Architecture

1. **Module-Scoped State (React Context)**:
   - Use for tightly coupled module workflows.
   - Example: `Payroll` uses `PayeeContext`, `DeductionContext`, and `WalletContext` (`src/context/payroll/`).
2. **Page & Form State**:
   - Standard React hooks (`useState`, `useReducer`, `useMemo`, `useCallback`).
   - Use custom hooks for complex screens (e.g. `useHRISDashboard.ts`, `useAuth.ts`).
3. **Note on Dependencies**:
   - `zustand` and `jotai` are in `package.json` for future state refactoring, but do not introduce new state libraries unless explicitly asked. Stick to Context + Custom Hooks to keep the codebase consistent.

---

## 8. TypeScript & Code Quality Rules

1. **Strict Types Only**:
   - Avoid `any`. If an API payload shape is partially unknown, define explicit interfaces or use `unknown` with type narrowing.
   - Never leave parameter types implicit (`noImplicitAny`).
2. **Path Aliasing**:
   - Always use `@/` to import from `src/` (e.g., `@/components/ui/Button`, `@/lib/axios`).
   - Never use deep relative imports like `../../../../components`.
3. **Client Directives**:
   - Next.js App Router defaults to Server Components.
   - If a component uses state (`useState`), effects (`useEffect`), browser APIs (`localStorage`, `window`), or event handlers (`onClick`, `onChange`), it MUST include `"use client";` at line 1.
4. **Data Contract Integrity (Crucial)**:
   - Check `src/lib/api/types/hrisTypes.ts` and `src/lib/api/types/api.ts` before defining duplicate interfaces.
   - Do NOT redefine types already provided by the API contracts.

---

## 9. Current Repository State & Migration Notice

> [!WARNING]
> **Active Prototype-to-API Migration in Progress**
> The codebase is currently migrating from static prototype mock data (`src/data/`, `src/lib/*-data.ts`) to live REST endpoints (`src/lib/api/`).
> When editing screens:
> - Check if a live API service exists in `src/lib/api/` before falling back to mock data.
> - Ensure newly added properties match the backend schema in `src/lib/api/types/`.
> - Do not delete existing mock data files that are still referenced by other unmigrated portals (Accounting, Payroll, Manager).

---

## 10. Developer & Agent Commands

Run all commands from the workspace root:

| Command | Action | Notes |
| :--- | :--- | :--- |
| `npm run dev` | Start local Next.js dev server | Runs on `http://localhost:3000` |
| `npm run typecheck` | Run TypeScript compiler check | Executes `tsc --noEmit` — verify after changes |
| `npm run build` | Production Next.js build | Validates full build & route generation |
| `npm run lint` | Run Next.js ESLint check | Lints all files under `src/` |

---

## 11. AI Assistant Rules of Engagement

1. **Preserve Existing Functionality**: When modifying any portal (HRIS, Payroll, Tenant Admin, etc.), do not break adjacent tabs, modal triggers, or navigation rails.
2. **Consistent Design Language**: All buttons, inputs, tables, status badges, and cards must match the Sinkronis design tokens (`#2183C6`, `bg-card`, `shadow-card`, `border-border`).
3. **Verify Types**: After touching `.ts` or `.tsx` files involving API contracts, always ensure `npm run typecheck` passes without new errors.
4. **Clean File Headers**: Keep imports organized (React / Next imports first, third-party libraries second, internal aliases `@/...` third, relative styles last).
