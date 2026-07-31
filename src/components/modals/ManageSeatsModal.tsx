// components/modals/ManageSeatsModal.tsx
"use client";

import { useState } from "react";
import { FiX, FiMinus, FiPlus } from "react-icons/fi";
import { EXTRA_SEAT_PRICE, MIN_SEATS, currentPlan, naira } from "@/lib/plan-data";

type ManageSeatsModalProps = {
  open: boolean;
  onClose: () => void;
  onUpdate: (newSeatCount: number) => void;
};

export default function ManageSeatsModal({ open, onClose, onUpdate }: ManageSeatsModalProps) {
  const [seats, setSeats] = useState(currentPlan.seatsTotal);

  if (!open) return null;

  const extraSeats = Math.max(0, seats - currentPlan.seatsTotal);
  const planSeatsCost = currentPlan.monthlyCost;
  const extraSeatsCost = extraSeats * EXTRA_SEAT_PRICE;
  const newMonthlyTotal = planSeatsCost + extraSeatsCost;

  const decrement = () => setSeats((s) => Math.max(MIN_SEATS, s - 1));
  const increment = () => setSeats((s) => s + 1);

  const handleUpdate = () => {
    onUpdate(seats);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-sm rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Manage Seats</h2>
            <p className="mt-0.5 text-sm text-slate-400">
              Extra seats are billed at {naira(EXTRA_SEAT_PRICE)} per seat / month.
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <FiX size={18} />
          </button>
        </div>

        <div className="space-y-4 p-6">
          {/* Stepper */}
          <div>
            <label className="mb-1.5 block text-xs text-slate-500">Number of Seats</label>
            <div className="flex items-center gap-3">
              <button
                onClick={decrement}
                disabled={seats <= MIN_SEATS}
                className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FiMinus size={14} />
              </button>
              <input
                type="number"
                value={seats}
                onChange={(e) => setSeats(Math.max(MIN_SEATS, Number(e.target.value) || MIN_SEATS))}
                className="w-20 rounded-md border border-slate-200 px-3 py-2 text-center text-sm text-slate-700 outline-none focus:border-sky-400"
              />
              <button
                onClick={increment}
                className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                <FiPlus size={14} />
              </button>
            </div>
            <p className="mt-1.5 text-xs text-slate-400">
              Minimum {MIN_SEATS} (currently occupied seats)
            </p>
          </div>

          {/* Cost breakdown */}
          <div className="space-y-2 rounded-lg bg-slate-50 px-4 py-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Plan seats ({currentPlan.seatsTotal})</span>
              <span className="font-medium text-slate-800">{naira(planSeatsCost)}</span>
            </div>
            {extraSeats > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Extra seats ({extraSeats})</span>
                <span className="font-medium text-slate-800">{naira(extraSeatsCost)}</span>
              </div>
            )}
            <div className="flex items-center justify-between border-t border-slate-200 pt-2 text-sm">
              <span className="font-medium text-slate-700">New monthly total</span>
              <span className="font-semibold text-sky-600">{naira(newMonthlyTotal)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 border-t border-slate-100 px-6 py-4">
          <button
            onClick={onClose}
            className="flex-1 rounded-md border border-slate-200 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="flex-1 rounded-md bg-sky-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-sky-700"
          >
            Update Seats
          </button>
        </div>
      </div>
    </div>
  );
}