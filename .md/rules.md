# Sinkronis Development Rules & Coding Standards

> Authoritative coding rules and best practices for engineers and AI assistants working on the Sinkronis SaaS codebase.

---

## 1. Reusable Component First Principle
* **Always Inspect Before Writing**: Before adding any UI element or block, inspect `@/components/ui/`, `@/components/shared/`, and module-level component folders.
* **Leverage Standard Primitives**: Always use design system components (`Button`, `Input`, `StatusBadge`, `Modal`, `Table`, `FormField`, `Toggle`, etc.) rather than writing raw HTML tags (`<button>`, `<input>`, custom `<span>` badges) with ad-hoc Tailwind classes.
* **No Unnecessary Inline Code**: Do not duplicate class lists, inline element styling, or interactive logic when a reusable component exists or can be extracted.
* **Create When Missing**: If a repeated UI pattern or component does not exist, build it as a clean, reusable component in `@/components/ui/` or `@/components/shared/` to maintain modularity and visual consistency.

---

## 2. Centralized Currency & Number Formatting
* **Never Format Manually**: Never write inline string templates like `₦${val}` or ad-hoc `val.toLocaleString()` in components.
* **Single Source of Truth**: Always use the centralized utility (`formatNaira(amount)` or `formatCurrency(amount, currency)`) configured with the Nigerian locale (`en-NG`).
* **Consistent Compact Formats**: For charts and dashboard widgets, use standard compact formatters (e.g., `₦5.2M`, `₦350K`).

---

## 3. Dual-Mode Data Layer & Offline Resilience
* **Never Let API Failures Crash Screens**: Screens and components must gracefully handle offline/prototype mode.
* **Sensible Mock Fallback**: While migrating between static prototypes and live endpoints, maintain dummy JSON data and client-side stores (`localStorage`) so end-to-end flows (creating, editing, filtering, disbursing) can be tested and demonstrated without an active backend.
* **Clear User Feedback**: Use notifications (`toast.success`, `toast.error`, `toast.info`) to confirm actions across both mock and live modes.

---

## 4. Single Source of Truth for Types & Contracts
* **No Duplicate Interfaces**: Do not define competing or duplicate TypeScript types for the same domain entity across multiple files.
* **Centralized Domain Models**: Place API contracts in `src/lib/api/types/` and internal frontend models in `src/types/<module>/`. Re-export them cleanly through module index files (e.g., `src/types/payroll/index.ts`).
* **Strict Types**: Avoid `any`. Use explicit unions (e.g., `PayeeType`, `PayRunStatus`) to drive type safety across screens.

---

## 5. Mandatory Empty, Loading, and Error States
* **3-State Rule**: Every table, list, and detail screen must explicitly handle:
  1. **Loading State**: Display a clean skeleton or spinner (`<Loader2 className="animate-spin" />`).
  2. **Empty State**: Use `@/components/shared/EmptyState` with a helpful description and an actionable button (e.g., *"No payees found. Add your first payee"*).
  3. **Data State**: The populated, responsive view.
* **No Blank Screens**: Never leave a user staring at an empty white container if zero records are returned or a query filter matches nothing.

---

## 6. Strict Icon Registry & Fallbacks
* **Complete Sidebar Mapping**: Every navigation item in any portal layout (`sidebarItems`) must map to a valid icon in `Sidebar.tsx`.
* **Guaranteed Fallback**: If an icon identifier is missing or unrecognized, `Sidebar.tsx` must fall back to a default icon (e.g., `FiGrid`) so no sidebar link is ever rendered without an icon.
* **Standard Icon Sets**: Stick to `lucide-react` for in-page actions/tools and `react-icons/fi` / `react-icons/ri` for shell navigation.

---

## 7. Modal & Dialog Standards
* **Consistent Structure**: All modal dialogs must follow the standard modal architecture:
  * Proper overlay backdrop (`fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4`).
  * Overflow safety: Modal bodies must have `max-h-[70vh] overflow-y-auto` to prevent off-screen cutoffs on smaller laptop displays.
  * Standardized header with title, subtitle, and an accessible close button (`X`).
  * Action footer with explicit Cancel (`variant="outline"`) and Confirm (`variant="primary"`) buttons.

---

## 8. Form Field Validation & Accessibility
* **No Floating Inputs**: Form inputs must always be paired with an associated label and optional helper text.
* **Use FormField Component**: Use `@/components/ui/FormField` with standard `label`, `required` asterisk indicator, and validation error messages.
* **Accessible Inputs**: Use proper HTML `type` attributes (`email`, `tel`, `number`, `date`) and disabled states during form submission.

---

## 9. Strict Client Directives & Server Separation
* **Line 1 Directive**: Any component utilizing React hooks (`useState`, `useEffect`, `useRouter`, `useContext`), event listeners (`onClick`, `onChange`), or browser APIs (`localStorage`, `window`) must have `"use client";` as line 1.
* **Server Components**: Keep static layouts and SEO shells as Server Components where state is not required.

---

## 10. Design System Tokens & Class Merging
* **Token Adherence**: Reference design tokens defined in `tailwind.config.ts`:
  * Primary blue: `#2183C6` (`bg-primary text-white hover:bg-[#1b6aa2]`)
  * Card backgrounds: `bg-card` / `bg-white` with `shadow-sm` or `shadow-card`
  * Borders: `border-border` or `border-[#e5e7eb]`
* **Use `cn`**: Always use the class-merging helper (`import { cn } from "@/utils/cn"`) when combining conditional classes.
