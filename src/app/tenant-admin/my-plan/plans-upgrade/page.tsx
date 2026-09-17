"use client";

import { useEffect, useState } from "react";
import { FiCheck } from "react-icons/fi";
import { getMyPlanPlans, switchPlan } from "@/lib/api/admin";
import { MyPlanPlan, MyPlanPreviewData, PlanKey } from "@/lib/api/types/admin.types";
import AddPlanConfirmModal from "@/components/modals/AddPlanConfirmModal";

function naira(n: number) {
  return `₦${n.toLocaleString()}`;
}

export default function PlansUpgradePage() {
  const [plans, setPlans] = useState<MyPlanPlan[]>([]);
  const [currentPlanKey, setCurrentPlanKey] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [pendingKey, setPendingKey] = useState<PlanKey | null>(null);
  const [preview, setPreview] = useState<MyPlanPreviewData["preview"] | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const fetchPlans = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getMyPlanPlans();
      setPlans(res.data.plans);
      setCurrentPlanKey(res.data.currentPlanKey);
    } catch (err) {
      setError("Failed to load plans.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleSelectPlan = async (key: PlanKey) => {
    setPendingKey(key);
    setModalError(null);
    setPreviewLoading(true);
    try {
      const res = await switchPlan({ planKey: key, billingCycle: "MONTHLY", confirm: false });
      setPreview(res.data.preview);
    } catch (err: any) {
      setModalError(err?.response?.data?.message || "Failed to preview plan change.");
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!pendingKey) return;
    setConfirming(true);
    setModalError(null);
    try {
      await switchPlan({ planKey: pendingKey, billingCycle: "MONTHLY", confirm: true });
      setPendingKey(null);
      setPreview(null);
      fetchPlans();
    } catch (err: any) {
      setModalError(err?.response?.data?.message || "Failed to confirm plan change.");
    } finally {
      setConfirming(false);
    }
  };

  const closeModal = () => {
    setPendingKey(null);
    setPreview(null);
    setModalError(null);
  };

  const currentPlan = plans.find((p) => p.key === currentPlanKey);
  const pendingPlan = plans.find((p) => p.key === pendingKey);

  if (loading) {
    return <p className="text-sm text-slate-400">Loading plans...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-500">{error}</p>;
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-slate-500">
        Choose the module or bundle that fits your organisation. Modules come bundled with your
        plan — switch to All-in-One for full access, or pick a single module plan.
      </p>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {plans.map((mod) => {
          const isBundle = mod.key === "all-in-one";

          return (
            <div
              key={mod.key}
              className={`relative flex flex-col rounded-xl border bg-white ${
                isBundle
                  ? "border-sky-500 pt-0 shadow-md ring-1 ring-sky-100"
                  : "border-slate-200 p-6"
              }`}
            >
              {isBundle && (
                <div className="rounded-t-xl bg-sky-600 py-2 text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wide text-white">
                    Best Value — All-in-One
                  </span>
                </div>
              )}

              <div className={isBundle ? "flex flex-1 flex-col p-6" : "flex flex-1 flex-col"}>
                <h3 className={`text-base font-semibold ${isBundle ? "text-sky-600" : "text-slate-900"}`}>
                  {mod.name}
                </h3>
                <p className="mt-0.5 text-xs text-slate-500">{mod.description}</p>

                <div className="mt-4">
                  <span className="text-2xl font-bold text-slate-900">{naira(mod.monthlyCost)}</span>
                  <span className="text-sm text-slate-400">/month</span>
                </div>

                <ul className="mt-5 flex-1 space-y-2.5">
                  {mod.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                      <FiCheck size={15} className="mt-0.5 shrink-0 text-sky-500" />
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 border-t border-slate-100 pt-5">
                  {mod.isCurrent ? (
                    <button
                      disabled
                      className="w-full cursor-not-allowed rounded-md border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-400"
                    >
                      Current Plan
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSelectPlan(mod.key)}
                      disabled={!mod.availableForSwitch}
                      className="w-full rounded-md bg-sky-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {mod.canUpgrade ? "Upgrade" : mod.canDowngrade ? "Downgrade" : "Switch Plan"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <AddPlanConfirmModal
        open={pendingKey !== null}
        currentPlanLabel={currentPlan ? `${currentPlan.name} · ${naira(currentPlan.monthlyCost)}/mo` : "—"}
        newPlanLabel={
          previewLoading
            ? "Loading..."
            : pendingPlan
              ? `${pendingPlan.name} · ${naira(pendingPlan.monthlyCost)}/mo`
              : ""
        }
        billingImpact={preview?.billingImpact}
        proratedCharges={preview?.proratedCharges}
        effectiveDate={preview?.effectiveDate}
        currency={preview?.currency}
        confirming={confirming}
        error={modalError}
        onCancel={closeModal}
        onConfirm={handleConfirm}
      />
    </div>
  );
}