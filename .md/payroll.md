# Sinkronis Payroll Module

## Overview

The Payroll module handles the full salary lifecycle for Nigerian/African businesses — from configuring employee salary structures and statutory deductions, through running and approving payroll, to disbursing payments and remitting statutory obligations. All navigation is state-based (no React Router); the module lives inside the broader Sinkronis ERP.

---

## Module Structure

```
src/app/components/payroll/
├── data.ts                  # Types, calculation engine, seed data
├── PayrollDashboard.tsx     # Home screen with KPIs and charts
├── PayrollEmployeesPage.tsx # Employee list + individual profiles
├── PayrollSettingsPage.tsx  # Pay periods, allowance/deduction types, statutory rates
├── PayRunsPage.tsx          # Pay run list + run payroll flow
├── PayslipsPage.tsx         # Payslip search, view, and download
├── TaxPage.tsx              # PAYE remittance management
├── PensionPage.tsx          # Pension, PFA transfers, AVCs
├── DeductionsPage.tsx       # Organisation-wide deduction management
├── PayeesPage.tsx           # Contractors, vendors, directors, board members
├── ReportsPage.tsx          # Payroll analytics and reports
└── WalletPage.tsx           # Payroll wallet funding and transaction ledger
```

---

## Navigation Screens (sidebar items)

| Screen key    | Page component            | Description                                  |
|---------------|---------------------------|----------------------------------------------|
| `dashboard`   | `PayrollDashboard`        | KPIs, charts, statutory obligations, quick actions |
| `employees`   | `PayrollEmployeesPage`    | Employee salary structures and deductions    |
| `runs`        | `PayRunsPage`             | Create and approve pay runs                  |
| `payslips`    | `PayslipsPage`            | View and export individual payslips          |
| `tax`         | `TaxPage`                 | PAYE remittance tracking                     |
| `pension`     | `PensionPage`             | Pension schedules, PFA transfers, AVCs       |
| `deductions`  | `DeductionsPage`          | Organisation deduction management            |
| `payees`      | `PayeesPage`              | Non-employee payment recipients              |
| `reports`     | `ReportsPage`             | Payroll reports and analytics                |
| `wallet`      | `WalletPage`              | Wallet funding and transaction ledger        |
| `settings`    | `PayrollSettingsPage`     | Pay periods, allowance types, statutory rates |

---

## Data Types (`data.ts`)

### `PayrollEmployee`
Core employee record for the payroll module (separate from HRIS).

| Field              | Type                                        | Notes                          |
|--------------------|---------------------------------------------|--------------------------------|
| `id`               | `string`                                    | e.g. `"HR-001"`                |
| `name`             | `string`                                    |                                |
| `avatar`           | `string`                                    | Two-letter initials            |
| `department`       | `string`                                    |                                |
| `role`             | `string`                                    |                                |
| `employmentType`   | `"Full-time" \| "Part-time" \| "Contract"` |                                |
| `employmentStatus` | `"Permanent" \| "Contract"`                | Drives tax treatment (PAYE vs WHT) |
| `status`           | `"Active" \| "Inactive" \| "On Leave" \| "Suspended"` |             |
| `bankName`         | `string`                                    |                                |
| `accountNumber`    | `string`                                    |                                |
| `onPayroll`        | `boolean`                                   | Gates inclusion in pay runs    |
| `joinDate`         | `string`                                    | ISO date                       |
| `phone`            | `string`                                    |                                |
| `email`            | `string`                                    |                                |
| `stateOfResidence` | `NigerianState`                             | Determines which IRS gets PAYE |
| `resumeDate?`      | `string`                                    | For proration                  |
| `prorationMethod?` | `"working-days" \| "calendar-days"`         | For proration                  |

### `SalaryStructure`
Earnings components per employee.

| Field               | Type                                               | Notes                        |
|---------------------|----------------------------------------------------|------------------------------|
| `employeeId`        | `string`                                           |                              |
| `basicSalary`       | `number`                                           |                              |
| `housingAllowance`  | `number`                                           |                              |
| `transportAllowance`| `number`                                           |                              |
| `otherAllowance`    | `number`                                           |                              |
| `otherAllowances`   | `{ name, amount, taxable }[]`                      | Flexible named allowances    |
| `bik?`              | `BIKBenefit`                                       | Non-cash benefits            |

### `BIKBenefit`
Benefit in Kind — non-cash employer-provided benefits. Recorded for compliance, not deducted from gross.

| Field             | Type     | Notes                               |
|-------------------|----------|-------------------------------------|
| `hmo`             | `number` | Monthly health plan value           |
| `airtime`         | `number` | Monthly mobile credit               |
| `lunch`           | `number` | Monthly meal benefit                |
| `thirteenthMonth` | `number` | Annual bonus (provisioned monthly)  |

### `DeductionProfile`
Statutory IDs and voluntary deductions per employee.

| Field               | Type                                        | Notes                            |
|---------------------|---------------------------------------------|----------------------------------|
| `employeeId`        | `string`                                    |                                  |
| `tin`               | `string`                                    | Tax Identification Number        |
| `pensionPin`        | `string`                                    | PENCOM PIN                       |
| `pfaName`           | `string`                                    | Pension Fund Administrator       |
| `nhfNumber`         | `string`                                    | National Housing Fund number     |
| `stateOfResidence`  | `NigerianState`                             |                                  |
| `loans`             | `Loan[]`                                    |                                  |
| `customDeductions`  | `{ id, name, amount, recurring }[]`         |                                  |

### `Loan`

| Field              | Type                              |
|--------------------|-----------------------------------|
| `id`               | `string`                          |
| `employeeId`       | `string`                          |
| `purpose`          | `string`                          |
| `principal`        | `number`                          |
| `balance`          | `number`                          |
| `monthlyRepayment` | `number`                          |
| `startDate`        | `string`                          |
| `status`           | `"Active" \| "Completed" \| "Paused"` |
| `loanType?`        | `"one-off" \| "recurring"`        |

### `PayRun`

| Field                  | Type                                          |
|------------------------|-----------------------------------------------|
| `id`                   | `string`                                      |
| `period`               | `string`                                      |
| `periodFrom`           | `string`                                      |
| `periodTo`             | `string`                                      |
| `status`               | `"Draft" \| "Processing" \| "Approved" \| "Disbursed"` |
| `totalGross`           | `number`                                      |
| `totalDeductions`      | `number`                                      |
| `totalNet`             | `number`                                      |
| `totalPAYE`            | `number`                                      |
| `totalEmployeePension` | `number`                                      |
| `totalEmployerPension` | `number`                                      |
| `totalNHF`             | `number`                                      |
| `totalNSITF`           | `number`                                      |
| `employeeCount`        | `number`                                      |
| `createdAt`            | `string`                                      |
| `approvedAt`           | `string`                                      |
| `disbursedAt`          | `string`                                      |

### `Payslip`
Individual payslip computed from a `PayRun` + `PayrollEmployee` + `SalaryStructure` + `DeductionProfile`.

Key fields: `grossSalary`, `paye`, `employeePension`, `employerPension`, `nhf`, `nsitf`, `loanDeductions`, `customDeductions`, `totalDeductions`, `netPay`, `paymentStatus`.

### `Payee`
Non-employee payment recipient (contractors, vendors, directors, board members).

| Field           | Type                                              |
|-----------------|---------------------------------------------------|
| `type`          | `"Contractor" \| "Vendor" \| "Director" \| "Board Member"` |
| `taxable`       | `boolean`                                         |
| `amount`        | `number`                                          |
| `status`        | `"Active" \| "Inactive"`                          |

### `WalletTx`
Wallet ledger entry.

| Field       | Type                                  |
|-------------|---------------------------------------|
| `type`      | `"Credit" \| "Debit"`                 |
| `txType`    | `"Funding" \| "Payroll Disbursement" \| "PAYE Remittance" \| "Pension Remittance" \| "NHF Remittance" \| "Payee Payment" \| "Reversal"` |
| `amount`    | `number`                              |
| `balance`   | `number`                              |
| `breakdown` | `{ label, amount }[]`                 |

### `PensionTransfer`
Tracks PENCOM PFA-to-PFA transfer with a multi-step status workflow.

Steps: `Initiated` → `PENCOM Review` → `Old PFA Processing` → `New PFA Confirmation` → `Completed`

### `AVC`
Additional Voluntary Contribution to pension.

---

## Calculation Engine

All calculation functions are pure and exported from `data.ts`.

### `calcGross(s: SalaryStructure): number`
```
gross = basicSalary + housingAllowance + transportAllowance + otherAllowance + sum(otherAllowances)
```

### `calcPension(s): { employee, employer }`
```
pensionable = basicSalary + housingAllowance + transportAllowance
employee    = pensionable × 8%
employer    = pensionable × 10%
```

### `calcNHF(s): number`
```
nhf = basicSalary × 2.5%
```

### `calcNSITF(gross): number`
```
nsitf = gross × 1%   (employer only, not deducted from employee)
```

### `calcPAYE(s, annualPensionEmployee, annualNHF): number`
Implements FIRS PIT Act (as amended). Monthly figure = annualTax / 12.

1. **Annual gross** = `calcGross(s) × 12`
2. **CRA** (Consolidated Relief Allowance) = `max(₦200,000, annualGross × 1%) + annualGross × 20%`
3. **Taxable income** = `max(0, annualGross - CRA - annualPension×12 - annualNHF×12)`
4. **Progressive bands:**

| Band                  | Rate |
|-----------------------|------|
| First ₦800,000        | 0%   |
| Next ₦1,400,000       | 15%  |
| Next ₦6,800,000       | 18%  |
| Next ₦4,000,000       | 21%  |
| Next ₦12,000,000      | 23%  |
| Above ₦25,000,000     | 25%  |

### `calcWHT(gross): number`
```
wht = gross × 5%   (for Contract/WHT employees instead of PAYE)
```

### `calcProration(fullGross, resumeDateStr, method): ProrationResult`
Used when an employee joins or resumes mid-month.

**Working-days method:**
- `totalDays` = working days (Mon–Fri) in the month
- `daysWorked` = working days from resumeDate to end of month

**Calendar-days method:**
- `totalDays` = calendar days in the month
- `daysWorked` = calendarDays - resumeDay + 1

```
factor        = daysWorked / totalDays
proratedGross = fullGross × factor
```

### `computePayslip(run, emp, salary, deduction): Payslip`
Orchestrates all calculations into a complete payslip object.

---

## Statutory Obligations & Remittance

| Obligation          | Rate / Basis                               | Who Pays         | Deadline              |
|---------------------|--------------------------------------------|------------------|-----------------------|
| PAYE                | Progressive bands on taxable income        | Employee         | 21st of following month |
| Employee Pension    | 8% of (Basic + Housing + Transport)        | Employee         | 7th of following month  |
| Employer Pension    | 10% of (Basic + Housing + Transport)       | Employer         | 7th of following month  |
| NHF                 | 2.5% of Basic Salary                       | Employee         | 14th of following month |
| NSITF               | 1% of Gross Salary                         | Employer         | 31st of following month |

**PAYE is remitted to the state IRS of the employee's state of residence:**
- Lagos → LIRS
- Abuja (FCT) → FCT-IRS
- Rivers → RIRS
- Kano / Ogun → respective state IRS

---

## Pay Run Lifecycle

```
Draft → Approved → Disbursed
```

Status colours in the UI:
- **Draft** — amber (`#fff3cd` / `#856404`)
- **Approved** — blue (`#e3f2fd` / `#1565c0`)
- **Processing** — purple (`#f3e5f5` / `#7b1fa2`)
- **Disbursed** — green (`#d8f3dc` / `#1b7a34`)

A "Draft run pending approval" banner appears on the dashboard when a draft run exists, linking directly to the PayRunsPage.

---

## PayrollDashboard

**KPI cards (4-column grid):**
1. Employees on Payroll (active + on payroll)
2. Total Monthly Cost (gross + employer pension + NSITF of last disbursed run)
3. Last Run Net Pay (last disbursed run)
4. Pending Disbursement (draft run net, or "None")

**Charts:**
- 6-month payroll cost trend — line chart (Gross vs Net Pay, Jan–Jun 2026)
- Monthly deductions breakdown — stacked bar chart (PAYE, Pension, NHF)
- Department payroll cost — horizontal bar chart (gross by department, May 2026)

**Sidebar panels:**
- Statutory Obligations — lists PAYE, Pension, NHF, NSITF with due dates and paid/due status
- Quick Actions — links to Runs, Payslips, PAYE, Pension, Reports, Deductions

**Recent Pay Runs table** — last 5 runs with period, count, gross, net, PAYE, status.

---

## PayrollEmployeesPage

### List view
- Search by name or role
- Filters: Department, Status (Active / Inactive / On Leave / Suspended), Employment Type
- Sortable columns: Employee, Department, Gross, Net Pay, Status
- Per-row actions: View (opens profile) + Add/Remove from Payroll toggle
- Export CSV (all visible employees with full computed figures)
- Bulk upload via CSV (drag-and-drop, template download)
- Add Employee modal (name, role, dept, email, phone, state, employment type, tax status, bank, account, salary structure)

### Employee profile (detail view)

**Header** — avatar, name, status badge, role/dept/type, gross, net pay, On/Off Payroll badge, Add/Remove from Payroll button (triggers confirmation modal).

**Tabs:**

#### Overview
- Personal Details: ID, email, phone, join date, tax state, tax status (PAYE or WHT), bank, TIN, pension PIN, PFA, NHF number
- Monthly Pay Summary: full earnings → gross → deductions → net (plus employer contributions note)

#### Pay Breakdown
- Earnings form: basic, housing, transport, other allowances (editable, with named other allowances that can be marked taxable)
- Proration calculator: resume date input + working-days/calendar-days toggle → shows days worked, total days, factor, prorated gross, and difference
- Save button
- Computed Deductions panel: PAYE, employee pension, employer pension, NHF, NSITF, and net pay

#### Deductions & Loans
- Tax & Statutory IDs: TIN, Pension PIN, NHF Number, PFA Name (all editable)
- Custom Deductions: add/remove ad hoc recurring deductions by name and amount
- Loans & Advances: loan cards with progress bar (principal / outstanding / repaid), Add Loan modal (purpose, type one-off/recurring, principal, monthly repayment, start date)

#### BIK (Benefit in Kind)
- HMO / Health Insurance, Airtime Allowance, Lunch / Meal Allowance, 13th Month (annual, provisioned monthly)
- BIK Summary panel showing total monthly BIK value
- Note: BIK does not reduce gross pay — recorded for compliance only

#### Payroll History
- Table of all months with payslip data (period, gross, net, PAYE, payment status)
- Export CSV for individual employee history

### Add/Remove from Payroll confirmation modal
- Triggered from the profile header button
- Shows employee details (name, role, dept, gross, net) in a summary card
- Confirm button colour: blue for "Add", amber for "Remove"
- On confirm: toggles `onPayroll`, shows a "Changes saved" toast

---

## PayrollSettingsPage

Left-nav sections:

### Pay Periods
- Pay Frequency: Monthly / Bi-Weekly / Weekly
- Default Pay Day: day 1–28 of month

### Allowance Types
- Table of named allowances with taxable/tax-exempt badge
- Add new allowance (name + taxable checkbox)
- Delete existing (except built-in ones)
- Seed allowances: Basic Salary (taxable), Housing (exempt), Transport (exempt), Medical (exempt), Responsibility (taxable), Commission (taxable), Bar Practice (exempt)

### Deduction Types
- Table of deduction names with Statutory/Voluntary badge
- Statutory deductions (PAYE, Employee Pension, NHF) cannot be deleted
- Add custom voluntary deduction types (e.g. Health Insurance)
- Seed types: PAYE, Employee Pension, NHF (statutory); Loan Repayment, Cooperative Dues, Union Dues (voluntary)

### Statutory Rates
Read-only reference table of all current rates:
- PAYE: progressive bands (FIRS PIT Act)
- Pension (PENCOM): 8% employee / 10% employer of pensionable earnings
- NHF: 2.5% of basic salary (Federal Mortgage Bank)
- NSITF: 1% of gross salary (employer only)

---

## Seed Data

### Employees (20 total)
Across departments: Human Resources, Finance, Operations, IT & Technology, Sales & Marketing, Legal & Compliance, Customer Support.

Employment mix: mostly Full-time Permanent (PAYE); one Contract (WHT); various statuses including Active, Inactive, On Leave, Suspended.

OnPayroll: 18 of 20 are on payroll.

Nigerian states represented: Lagos, Abuja (FCT), Rivers, Kano, Ogun.

Banks: First Bank, GTBank, Zenith Bank, Access Bank, UBA, Stanbic IBTC, Fidelity Bank, FCMB, Sterling Bank, Polaris Bank.

PFAs: Stanbic IBTC Pension, ARM Pension, AIICO Pension, Premium Pension, AXA Mansard Pension, Leadway Pensure, FCMB Pensions.

Some employees have active loans; some have custom deductions (Cooperative Contribution, Union Dues, Staff Welfare Fund).

### Pay Runs (6 months)
January–June 2026. All disbursed except June 2026 which is Draft.

### Payslips
Built from active on-payroll employees for each month using `computePayslip`. Exported as `SEED_PAYSLIPS_MAY`, `_APR`, `_MAR`, `_FEB`, `_JAN`, `_JUN`.

### Payees (8)
- 2 Contractors (TechBridge Consulting, SwiftCode IT Solutions)
- 3 Vendors (CleanSpace, Global Logistics, Pinnacle Security)
- 2 Directors (Chief Emeka Williams, Dr. Femi Adekunle)
- 1 Board Member (Mrs. Titi Adesanya)

### Wallet Transactions (18)
Covers payroll disbursements, PAYE remittances (split by state IRS), pension, NHF, payee payments, wallet fundings, and one reversal — all tied to May–January runs.

### Pension Transfers (2)
- IT-002: Premium → Stanbic IBTC (in PENCOM Review, step 2)
- HR-004: Premium → ARM (Completed, step 4)

### AVCs (3)
- FIN-003: ₦50,000/mo (Active)
- LEG-001: ₦80,000/mo (Active)
- HR-001: ₦30,000/mo (Paused)

---

## Design System Notes

- Font: `'Outfit', sans-serif`
- Primary blue: `#2183c6`
- Dark text: `#212b36`
- Muted text: `#637381`
- Subtle text: `#919eab`
- Card border: `1px dashed rgba(145,158,171,0.24)`
- Row border: `1px dashed rgba(145,158,171,0.12)`
- Alternating rows: `#f2f2f7` (odd) / `#fff` (even)
- Page background: `#f9fafb`
- Status colours:
  - Active / Paid / Remitted: `#d8f3dc` bg, `#1b7a34` text
  - Draft / Due / Amber: `#fff3cd` bg, `#856404` text
  - Error / PAYE: `#ffe5e5` bg, `#ff3b30` text
  - Inactive / Neutral: `#f4f6f8` bg, `#637381` text
  - Blue info: `#e3f2fd` bg, `#1565c0` text
  - Purple: `#f3e5f5` bg, `#7b1fa2` text
- Currency formatter: `₦` with `toLocaleString("en-NG")`
- Compact K/M formatter used in charts: e.g. `₦5.2M`, `₦300K`
