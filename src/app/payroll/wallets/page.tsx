// src/app/payroll/wallets/page.tsx

"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  TrendingDown,
  Download,
  Loader2,
  Search,
  Filter,
  X,
  RotateCcw,
} from "lucide-react";

import FundWalletModal, {
  FundWalletFormData,
} from "@/components/payroll/wallet/FundWallet";

import {
  formatWalletDate,
  LedgerEntry,
  Obligation,
  ObligationType,
  TxType,
} from "@/types/payroll/wallet-data";

import { useWallet } from "@/context/payroll/WalletContext";

import { naira } from "@/types/payroll/payee-data";
import { directionStyles, txTypeStyles } from "@/lib/wallet-styles";
import { toast } from "react-toastify";
import {
  getPayrollWallet,
  fundPayrollWallet,
  getPayrollWalletTransactions,
  exportPayrollWalletTransactionsCsv,
  getPayrollWalletObligations,
  getPayRuns,
  payPayrollWalletObligation,
  PayrollWalletData,
  PayrollWalletTransaction,
  PayrollWalletObligation,
} from "@/lib/api/payroll";

/* =========================================================
   CONSTANTS & HELPERS
========================================================= */

const accountName = "Sinkronis Technologies Ltd — Payroll Account";

const txTypeLabelMap: Record<string, TxType> = {
  FUNDING: "Wallet Funding",
  PAYROLL_DISBURSEMENT: "Payroll Disbursement",
  PAYE_REMITTANCE: "PAYE Remittance",
  PENSION_REMITTANCE: "Pension Remittance",
  NHF_REMITTANCE: "NHF Remittance",
};

function mapApiTxToLedgerEntry(tx: PayrollWalletTransaction): LedgerEntry {
  const isCredit = (tx.direction || "").toUpperCase() === "CREDIT";
  const rawType = tx.transactionType || "";
  const mappedType =
    txTypeLabelMap[rawType] ||
    (rawType.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()) as TxType);

  let formattedDate = tx.date;
  if (tx.date) {
    const parsedDate = new Date(tx.date);
    if (!Number.isNaN(parsedDate.getTime())) {
      formattedDate = formatWalletDate(parsedDate);
    }
  }

  return {
    id: tx.id,
    date: formattedDate || "—",
    description: tx.description || mappedType,
    txType: mappedType,
    reference: tx.reference || tx.transferReference || "—",
    direction: isCredit ? "Credit" : "Debit",
    amount: tx.amount ?? 0,
    balance: tx.balanceAfter ?? tx.balanceBefore ?? 0,
  };
}

function mapApiObligationToLocal(apiObl: PayrollWalletObligation): Obligation {
  const typeMap: Record<string, ObligationType> = {
    PAYROLL_DISBURSEMENT: "Payroll Disbursement",
    PAYEE_PAYMENT: "Payroll Disbursement",
    PAYE_REMITTANCE: "PAYE Remittance",
    PENSION_REMITTANCE: "Pension Remittance",
    NHF_REMITTANCE: "NHF Remittance",
  };

  let formattedDueDate = apiObl.dueDate || "—";
  if (apiObl.dueDate) {
    const d = new Date(apiObl.dueDate);
    if (!Number.isNaN(d.getTime())) {
      formattedDueDate = d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  }

  return {
    id: apiObl.id,
    txType: typeMap[apiObl.obligationType] || "Payroll Disbursement",
    description: apiObl.title || apiObl.period || "Pending Obligation",
    period: apiObl.period || "",
    reference: apiObl.sourceId || apiObl.id,
    dueDate: formattedDueDate,
    amount: apiObl.amount ?? 0,
  };
}

/* =========================================================
   PAGE
========================================================= */

export default function PayrollWalletPage() {
  const router = useRouter();

  const { transactions, obligations, fundWallet, payObligation } = useWallet();

  const [showFundModal, setShowFundModal] = useState(false);
  const [isFunding, setIsFunding] = useState(false);

  /* =======================================================
     LIVE WALLET OVERVIEW
  ======================================================= */

  const [apiWallet, setApiWallet] = useState<PayrollWalletData | null>(null);
  const [walletLoading, setWalletLoading] = useState(true);
  const [walletError, setWalletError] = useState<string | null>(null);

  const fetchWallet = useCallback(async () => {
    try {
      setWalletLoading(true);
      setWalletError(null);
      const res = await getPayrollWallet();
      if (res?.data) {
        setApiWallet(res.data);
      }
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { data?: { message?: string } };
      };
      setWalletError(
        axiosErr.response?.data?.message ||
        "Could not load wallet overview.",
      );
    } finally {
      setWalletLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWallet();
  }, [fetchWallet]);

  /* =======================================================
     LIVE WALLET TRANSACTIONS
  ======================================================= */

  const [apiTransactions, setApiTransactions] = useState<
    PayrollWalletTransaction[] | null
  >(null);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [transactionsError, setTransactionsError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    try {
      setTransactionsLoading(true);
      setTransactionsError(null);
      const res = await getPayrollWalletTransactions();
      if (res && Array.isArray(res.data)) {
        setApiTransactions(res.data);
      } else {
        setApiTransactions([]);
      }
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { data?: { message?: string } };
      };
      setTransactionsError(
        axiosErr.response?.data?.message ||
        "Could not load transaction history.",
      );
    } finally {
      setTransactionsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  /* =======================================================
     LIVE WALLET OBLIGATIONS
  ======================================================= */

  const [apiObligations, setApiObligations] = useState<
    PayrollWalletObligation[] | null
  >(null);
    const [payableRunIds, setPayableRunIds] = useState<Set<string>>(new Set());
  const [obligationsLoading, setObligationsLoading] = useState(true);
  const [obligationsError, setObligationsError] = useState<string | null>(null);

  const fetchObligations = useCallback(async () => {
    try {
      setObligationsLoading(true);
      setObligationsError(null);
           const res = await getPayrollWalletObligations();
      if (res && Array.isArray(res.data)) {
        setApiObligations(res.data);
        if (res.data.some((o) => o.id.startsWith("PAYROLL_RUN:"))) {
          try {
            const ids = new Set<string>();
            let page = 1;
            let totalPages = 1;
            do {
              const runs = await getPayRuns({ page, limit: 10 });
              runs.items.forEach((r) => {
                if (r.permanentEmployeeCount > 0 && r.externalPayeeCount === 0) ids.add(r.id);
              });
              totalPages = runs.pagination?.totalPages ?? 1;
              page += 1;
            } while (page <= totalPages && page <= 10);
            setPayableRunIds(ids);
          } catch {
            setPayableRunIds(new Set());
          }
        }
      } else {
        setApiObligations([]);
      }
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { data?: { message?: string } };
      };
      setObligationsError(
        axiosErr.response?.data?.message ||
        "Could not load pending obligations.",
      );
    } finally {
      setObligationsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchObligations();
  }, [fetchObligations]);

  /* =======================================================
     PAY OBLIGATION
  ======================================================= */

  const [payingObligationId, setPayingObligationId] = useState<string | null>(
    null,
  );

  const handlePayObligation = async (obligation: Obligation) => {
    if (payingObligationId) return;
    setPayingObligationId(obligation.id);

    try {
      const res = await payPayrollWalletObligation(obligation.id);
      toast.success(
        res.message || `${obligation.txType} settled successfully.`,
      );

      // Optimistically settle locally
      payObligation(obligation);
      if (apiObligations) {
        setApiObligations((prev) =>
          prev ? prev.filter((item) => item.id !== obligation.id) : [],
        );
      }

      // Refresh live wallet state, transactions, and obligations
      await Promise.all([
        fetchWallet(),
        fetchTransactions(),
        fetchObligations(),
      ]);
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: {
          status?: number;
          data?: {
            message?: string;
            errorCode?: string;
          };
        };
        message?: string;
      };

      const errorMsg =
        axiosErr.response?.data?.message ||
        axiosErr.message ||
        "Failed to settle obligation.";

      toast.error(errorMsg);
    } finally {
      setPayingObligationId(null);
    }
  };

  /* =======================================================
     EXPORT WALLET TRANSACTIONS CSV
  ======================================================= */

  const [exportingCsv, setExportingCsv] = useState(false);

  const handleExportCsv = async () => {
    if (exportingCsv) return;
    setExportingCsv(true);
    try {
      const blob = await exportPayrollWalletTransactionsCsv();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const today = new Date().toISOString().split("T")[0];
      link.download = `wallet-transactions-${today}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Wallet transactions exported successfully");
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { data?: { message?: string } | Blob };
      };
      let errorMsg = "Failed to export wallet transactions.";
      if (axiosErr.response?.data instanceof Blob) {
        try {
          const text = await axiosErr.response.data.text();
          const parsed = JSON.parse(text);
          if (parsed.message) errorMsg = parsed.message;
        } catch {
          // ignore
        }
      } else if (
        typeof axiosErr.response?.data === "object" &&
        axiosErr.response?.data !== null &&
        "message" in axiosErr.response.data &&
        typeof axiosErr.response.data.message === "string"
      ) {
        errorMsg = axiosErr.response.data.message;
      }
      toast.error(errorMsg);
    } finally {
      setExportingCsv(false);
    }
  };

  /* =======================================================
     DERIVED DISPLAY VALUES
     Live API values with safe zero/empty defaults.
  ======================================================= */

  const displayBalance = apiWallet
    ? apiWallet.wallet.currentBalance
    : 0;

  const displayFunded = apiWallet
    ? apiWallet.summary.totalFunded
    : 0;

  const displayDisbursed = apiWallet
    ? apiWallet.summary.totalDisbursed
    : 0;

  const displayPendingPayroll = apiWallet
    ? apiWallet.summary.pendingPayroll
    : 0;

  const displayPendingObligations = apiWallet
    ? apiWallet.summary.pendingObligations
    : 0;

  const displayShortfall = apiWallet
    ? apiWallet.balanceHealth.shortfall
    : 0;

  const displayAccountName = apiWallet?.wallet.accountName ?? accountName;

  /* =======================================================
     LEDGER (live endpoint)
  ======================================================= */

  const displayLedger = useMemo(() => {
    return apiTransactions !== null
      ? apiTransactions.map(mapApiTxToLedgerEntry)
      : [];
  }, [apiTransactions]);

  /* =======================================================
     SEARCH & FILTER STATE (Transaction History)
  ======================================================= */

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("ALL");
  const [selectedDirection, setSelectedDirection] = useState("ALL");

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedType("ALL");
    setSelectedDirection("ALL");
  };

  const filteredLedger = useMemo(() => {
    return displayLedger.filter((entry) => {
      // Type filter
      if (selectedType !== "ALL" && entry.txType !== selectedType) {
        return false;
      }

      // Direction filter
      if (
        selectedDirection !== "ALL" &&
        entry.direction.toLowerCase() !== selectedDirection.toLowerCase()
      ) {
        return false;
      }

      // Search query filter (matches description, reference, txType, date, or amount)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesDesc = (entry.description || "").toLowerCase().includes(query);
        const matchesRef = (entry.reference || "").toLowerCase().includes(query);
        const matchesType = (entry.txType || "").toLowerCase().includes(query);
        const matchesDate = (entry.date || "").toLowerCase().includes(query);
        const matchesAmount = (entry.amount || 0).toString().includes(query);

        if (!matchesDesc && !matchesRef && !matchesType && !matchesDate && !matchesAmount) {
          return false;
        }
      }

      return true;
    });
  }, [displayLedger, searchQuery, selectedType, selectedDirection]);

  const displayObligations =
    apiObligations !== null
      ? apiObligations.map(mapApiObligationToLocal)
      : [];

  const pendingPayroll = displayObligations.find(
    (item) => item.txType === "Payroll Disbursement",
  );

  /* =======================================================
     FUND WALLET
  ======================================================= */

  const handleFundWallet = async (data: FundWalletFormData) => {
    const amount = Number(data.amount) || 0;
    const transferReference = data.reference.trim();

    if (amount <= 0) {
      toast.error("Please enter a valid funding amount greater than 0.");
      return;
    }

    if (transferReference.length < 3) {
      toast.error("Transfer reference must be at least 3 characters.");
      return;
    }

    setIsFunding(true);
    try {
      const res = await fundPayrollWallet({
        amount,
        transferReference,
      });

      toast.success(res.message || "Payroll wallet funded successfully.");

      // Record in local state for ledger consistency
      fundWallet({
        id: crypto.randomUUID(),
        date: formatWalletDate(new Date()),
        description: `Wallet Funding — ${data.source || "Manual"}`,
        txType: "Wallet Funding",
        reference: transferReference,
        direction: "Credit",
        amount,
      });

      // Refresh live wallet overview, transactions, and obligations
      await Promise.all([
        fetchWallet(),
        fetchTransactions(),
        fetchObligations(),
      ]);

      setShowFundModal(false);
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: {
          status?: number;
          data?: {
            message?: string;
            validationErrors?: Array<{ field?: string; message?: string }>;
          };
        };
        message?: string;
      };

      const valError = axiosErr.response?.data?.validationErrors?.[0]?.message;
      const apiMsg = axiosErr.response?.data?.message;
      const errorMsg =
        valError || apiMsg || axiosErr.message || "Failed to fund wallet.";

      toast.error(errorMsg);
    } finally {
      setIsFunding(false);
    }
  };

  /* =======================================================
     NAVIGATE TO TRANSACTION DETAIL
  ======================================================= */

  const openTransaction = (entry: LedgerEntry) => {
    router.push(`/payroll/wallets/${entry.id}`);
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] p-4 text-[#263447]">
      {/* ===================================================
          HEADER
      ================================================== */}

      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[34px] font-bold leading-tight tracking-[-0.8px] text-[#263447]">
            Payroll Wallet
          </h1>

          <p className="mt-2 text-[14px] leading-5 text-[#718096]">
            Virtual business account for payroll disbursements and statutory
            remittances.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowFundModal(true)}
          className="flex h-11 shrink-0 items-center gap-2 rounded-md bg-[#1683d8] px-5 text-[14px] font-semibold text-white transition hover:bg-[#1274c2] focus:outline-none focus:ring-2 focus:ring-[#1683d8]/30"
        >
          <Plus size={18} strokeWidth={2} />

          <span>Fund Wallet</span>
        </button>
      </header>

      {/* ===================================================
          BALANCE CARD
      ================================================== */}

      <section className="relative mt-6 overflow-hidden rounded-lg bg-gradient-to-br from-[#1479bc] to-[#2f92d2] px-8 py-7">
        {/* Decorative rings, clipped by the card. */}

        <span className="pointer-events-none absolute -right-10 top-16 h-44 w-44 rounded-full bg-white/[0.07]" />

        <span className="pointer-events-none absolute right-14 -top-12 h-32 w-32 rounded-full bg-white/[0.07]" />

        <div className="relative">
          <p className="text-[11px] font-semibold uppercase tracking-[1.4px] text-white/75">
            {displayAccountName}
          </p>

          {walletLoading ? (
            <div className="mt-3 h-10 w-48 animate-pulse rounded-md bg-white/20" />
          ) : (
            <p className="mt-3 text-[40px] font-bold leading-none tracking-[-1px] text-white">
              {naira(displayBalance)}
            </p>
          )}

          {walletError && (
            <p className="mt-1 text-[11px] text-white/60">
              {walletError} — showing cached data.
            </p>
          )}

          <div className="mt-7 grid grid-cols-2 gap-5 sm:grid-cols-4">
            <HeroStat label="Total Funded" value={naira(displayFunded)} />

            <HeroStat
              label="Total Disbursed"
              value={naira(displayDisbursed)}
            />

            <HeroStat
              label="Pending Payroll"
              value={naira(displayPendingPayroll)}
            />

            <HeroStat
              label="Pending Obligations"
              value={naira(displayPendingObligations)}
            />
          </div>
        </div>
      </section>

      {/* ===================================================
          SHORTFALL BANNER
      ================================================== */}

      {displayShortfall > 0 && pendingPayroll && (
        <section className="mt-4 flex items-center gap-2.5 rounded-md border border-[#fbd5d5] bg-[#fff5f5] px-5 py-3.5">
          <TrendingDown
            size={18}
            strokeWidth={2}
            className="shrink-0 text-[#e8384f]"
          />

          <p className="text-[13.5px] leading-5 text-[#ef5a5a]">
            <span className="font-bold text-[#d92d20]">
              Insufficient balance.
            </span>{" "}
            {pendingPayroll.period} payroll needs {naira(pendingPayroll.amount)}
            . Top up {naira(displayShortfall)} more.
          </p>
        </section>
      )}

      {/* ===================================================
          PENDING OBLIGATIONS
      ================================================== */}

      <section className="mt-5 overflow-hidden rounded-lg border border-[#dce2e8] bg-white">
        <header className="border-b border-[#e5e9ed] px-6 py-4">
          <h2 className="text-[15px] font-bold text-[#263447]">
            Pending Obligations
          </h2>

          <p className="mt-0.5 text-[12.5px] text-[#8994a3]">
            Outstanding disbursements and statutory remittances
          </p>

          {obligationsError && (
            <p className="mt-1 text-[12px] text-[#e8384f]">
              {obligationsError} — showing cached obligations.
            </p>
          )}
        </header>

        {obligationsLoading && apiObligations === null ? (
          <div className="py-14 text-center">
            <div className="flex items-center justify-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#1683d8] border-t-transparent" />
              <span className="text-[14px] text-[#8994a3]">
                Loading pending obligations...
              </span>
            </div>
          </div>
        ) : displayObligations.length === 0 ? (
          <div className="py-14 text-center">
            <p className="text-[15px] font-semibold text-[#344054]">
              Nothing outstanding
            </p>

            <p className="mt-1 text-[14px] text-[#8994a3]">
              Every disbursement and remittance has been settled.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 p-5 lg:grid-cols-2">
            {displayObligations.map((obligation) => (
              <ObligationCard
                key={obligation.id}
                obligation={obligation}
                onPay={() => handlePayObligation(obligation)}
                isPaying={payingObligationId === obligation.id}
                canPay={
                  !obligation.id.startsWith("PAYROLL_RUN:") ||
                  payableRunIds.has(obligation.id.replace("PAYROLL_RUN:", ""))
                }
              />
            ))}
          </div>
        )}
      </section>

      {/* ===================================================
          TRANSACTION HISTORY
      ================================================== */}

      <section className="mt-5 overflow-hidden rounded-lg border border-[#dce2e8] bg-white">
        <header className="flex flex-col gap-3.5 border-b border-[#e5e9ed] px-6 py-4 xl:flex-row xl:items-center xl:justify-between">
          {/* Title & Status */}
          <div className="shrink-0">
            <h2 className="text-[15px] font-bold text-[#263447]">
              Transaction History
            </h2>

            {transactionsError ? (
              <p className="mt-0.5 text-[12px] text-[#e8384f]">
                {transactionsError} — showing cached transactions.
              </p>
            ) : (
              <p className="mt-0.5 text-[12px] text-[#8994a3]">
                {filteredLedger.length === displayLedger.length
                  ? `${displayLedger.length} total transactions`
                  : `Showing ${filteredLedger.length} of ${displayLedger.length} transactions`}
              </p>
            )}
          </div>

          {/* Controls: Search, Filters, Reset & Export */}
          <div className="flex flex-1 flex-wrap items-center justify-start gap-2.5 xl:justify-end">
            {/* Search Input */}
            <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
              <Search
                size={14}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search description, ref, amount..."
                className="h-9 w-full rounded-md border border-[#dce2e8] bg-white pl-9 pr-8 text-xs text-[#263447] placeholder:text-[#94a3b8] outline-none transition focus:border-[#1683d8] focus:ring-2 focus:ring-[#1683d8]/10"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#475569]"
                  aria-label="Clear search"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Type Filter */}
            <div className="relative flex items-center">
              <Filter
                size={13}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]"
              />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="h-9 rounded-md border border-[#dce2e8] bg-white pl-8 pr-7 text-xs font-medium text-[#344054] outline-none transition hover:bg-[#f8fafc] focus:border-[#1683d8] focus:ring-2 focus:ring-[#1683d8]/10"
              >
                <option value="ALL">All Types</option>
                <option value="Wallet Funding">Wallet Funding</option>
                <option value="Payroll Disbursement">Payroll Disbursement</option>
                <option value="PAYE Remittance">PAYE Remittance</option>
                <option value="Pension Remittance">Pension Remittance</option>
                <option value="NHF Remittance">NHF Remittance</option>
              </select>
            </div>

            {/* Direction Filter */}
            <div className="relative">
              <select
                value={selectedDirection}
                onChange={(e) => setSelectedDirection(e.target.value)}
                className="h-9 rounded-md border border-[#dce2e8] bg-white px-3 pr-7 text-xs font-medium text-[#344054] outline-none transition hover:bg-[#f8fafc] focus:border-[#1683d8] focus:ring-2 focus:ring-[#1683d8]/10"
              >
                <option value="ALL">All</option>
                <option value="Credit">Credit</option>
                <option value="Debit">Debit</option>
              </select>
            </div>

            {/* Reset Button (visible when filters are active) */}
            {(searchQuery.trim() || selectedType !== "ALL" || selectedDirection !== "ALL") && (
              <button
                type="button"
                onClick={handleResetFilters}
                title="Reset filters"
                className="flex h-9 items-center gap-1.5 rounded-md border border-[#dce2e8] bg-white px-2.5 text-xs font-medium text-[#64748b] transition hover:bg-[#f8fafc] hover:text-[#0f172a]"
              >
                <RotateCcw size={12} />
                <span>Reset</span>
              </button>
            )}

            {/* Export CSV */}
            <button
              type="button"
              onClick={handleExportCsv}
              disabled={exportingCsv}
              className="flex h-9 items-center gap-2 rounded-md border border-[#dce2e8] bg-white px-3.5 text-xs font-semibold text-[#344054] transition hover:bg-[#f8fafc] disabled:opacity-50"
            >
              {exportingCsv ? (
                <Loader2 size={14} className="animate-spin text-[#1683d8]" />
              ) : (
                <Download size={14} className="text-[#64748b]" />
              )}
              <span>{exportingCsv ? "Exporting..." : "Export CSV"}</span>
            </button>
          </div>
        </header>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#e5e9ed] text-[13px] font-semibold text-[#718096]">
                <th className="px-6 py-3.5 font-semibold">Date</th>
                <th className="px-6 py-3.5 font-semibold">Description</th>
                <th className="px-6 py-3.5 font-semibold">Tx Type</th>
                <th className="px-6 py-3.5 font-semibold">Reference</th>
                <th className="px-6 py-3.5 font-semibold">Direction</th>
                <th className="px-6 py-3.5 font-semibold">Amount</th>
                <th className="px-6 py-3.5 font-semibold">Balance</th>
              </tr>
            </thead>

            <tbody>
              {transactionsLoading && apiTransactions === null ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-14 text-center text-[14px] text-[#8994a3]"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#1683d8] border-t-transparent" />
                      <span>Loading transactions...</span>
                    </div>
                  </td>
                </tr>
              ) : displayLedger.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-14 text-center text-[14px] text-[#8994a3]"
                  >
                    No transactions on this account yet.
                  </td>
                </tr>
              ) : filteredLedger.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-14 text-center text-[14px] text-[#8994a3]"
                  >
                    <span>No transactions match your search or filter criteria.</span>
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="ml-2 font-semibold text-[#1683d8] hover:underline"
                    >
                      Reset filters
                    </button>
                  </td>
                </tr>
              ) : (
                filteredLedger.map((entry, index) => (
                  <LedgerRow
                    key={entry.id}
                    entry={entry}
                    index={index}
                    onOpen={() => openTransaction(entry)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ===================================================
          FUND WALLET MODAL
      ================================================== */}

      <FundWalletModal
        isOpen={showFundModal}
        onClose={() => setShowFundModal(false)}
        onSubmit={handleFundWallet}
        isLoading={isFunding}
        currentBalance={displayBalance}
      />
    </main>
  );
}

/* =========================================================
   HERO STAT
========================================================= */

type HeroStatProps = {
  label: string;
  value: string;
};

function HeroStat({ label, value }: HeroStatProps) {
  return (
    <div>
      <p className="text-[10.5px] font-semibold uppercase tracking-[1.1px] text-white/70">
        {label}
      </p>

      <p className="mt-1.5 text-[15px] font-bold text-white">{value}</p>
    </div>
  );
}

/* =========================================================
   OBLIGATION CARD
========================================================= */

type ObligationCardProps = {
  obligation: Obligation;
  onPay: () => void;
  isPaying?: boolean;
  canPay?: boolean;
};

function ObligationCard({
  obligation,
  onPay,
  isPaying = false,
  canPay = true,
}: ObligationCardProps) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-[#e5e9ed] px-5 py-4">
      <div className="min-w-0">
        <TypeBadge txType={obligation.txType} />

        <p className="mt-2.5 text-[14px] font-medium text-[#263447]">
          {obligation.description}
        </p>

        <p className="mt-1.5 text-[12px] text-[#a3aeb9]">
          Due {obligation.dueDate}
        </p>
      </div>

      <div className="shrink-0 text-right">
        <p className="text-[15.5px] font-bold text-[#263447]">
          {naira(obligation.amount)}
        </p>

             {canPay ? (
          <button
            type="button"
            onClick={onPay}
            disabled={isPaying}
            className="mt-2.5 flex h-8 items-center justify-center gap-1.5 rounded-md bg-[#1683d8] px-4 text-[12.5px] font-semibold text-white transition hover:bg-[#1274c2] disabled:opacity-60"
          >
            {isPaying && <Loader2 size={12} className="animate-spin" />}
            <span>{isPaying ? "Paying..." : "Pay Now"}</span>
          </button>
        ) : (
          <p className="mt-2.5 text-[11.5px] text-[#a3aeb9]">
            Payment not available for this run type yet
          </p>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   LEDGER ROW
========================================================= */

type LedgerRowProps = {
  entry: LedgerEntry;
  index: number;
  onOpen: () => void;
};

function LedgerRow({ entry, index, onOpen }: LedgerRowProps) {
  const isCredit = entry.direction === "Credit";

  return (
    <tr
      role="link"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      className={`cursor-pointer border-b border-[#edf0f3] text-[13.5px] outline-none transition-colors last:border-b-0 hover:bg-[#f0f6fc] focus-visible:bg-[#eaf3fb] ${index % 2 === 1 ? "bg-[#f9fafb]" : "bg-white"}`}
    >
      {/* Date */}

      <td className="whitespace-nowrap px-6 py-3.5 text-[#344054]">
        {entry.date}
      </td>

      {/* Description */}

      <td className="px-6 py-3.5 text-[#344054]">{entry.description}</td>

      {/* Tx Type */}

      <td className="px-6 py-3.5">
        <TypeBadge txType={entry.txType} />
      </td>

      {/* Reference */}

      <td className="whitespace-nowrap px-6 py-3.5 text-[12.5px] font-medium tracking-[0.5px] text-[#1683d8]">
        {entry.reference}
      </td>

      {/* Direction */}

      <td className="px-6 py-3.5">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${directionStyles[entry.direction] || "bg-[#f0f4f8] text-[#334155]"}`}
        >
          {entry.direction}
        </span>
      </td>

      {/* Amount */}

      <td
        className={`whitespace-nowrap px-6 py-3.5 font-semibold ${isCredit ? "text-[#16823b]" : "text-[#ff3b3b]"}`}
      >
        {isCredit ? "+" : "-"}
        {naira(entry.amount)}
      </td>
      {/* Balance */}

      <td className="whitespace-nowrap px-6 py-3.5 font-semibold text-[#263447]">
        {naira(entry.balance)}
      </td>
    </tr>
  );
}

/* =========================================================
   TYPE BADGE
========================================================= */

function TypeBadge({ txType }: { txType: TxType | string }) {
  const badgeStyle =
    (txTypeStyles as Record<string, string>)[txType] ||
    "bg-[#f0f4f8] text-[#334155]";

  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-[10.5px] font-semibold ${badgeStyle}`}
    >
      {txType}
    </span>
  );
}
