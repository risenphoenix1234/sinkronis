// app/tenant-admin/my-plan/payment-method/page.tsx
"use client";

import { useState } from "react";
import { FiX } from "react-icons/fi";
import { savedCard, billingAddress as initialAddress } from "@/lib/plan-data";

export default function PaymentMethodPage() {
  const [showAddCard, setShowAddCard] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  const [address, setAddress] = useState(initialAddress);

  const handleSaveCard = () => {
    // Hook up to Paystack (or your provider) tokenization API here.
    console.log("Saving card:", { cardNumber, cardholderName, expiryDate, cvv });
    setShowAddCard(false);
    setCardNumber("");
    setCardholderName("");
    setExpiryDate("");
    setCvv("");
  };

  const handleSaveAddress = () => {
    // Hook up to API call to persist billing address here.
    console.log("Saving billing address:", address);
  };

  return (
    <div className="max-w-2xl space-y-5">
      {/* Saved Payment Method */}
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-800">Saved Payment Method</p>
          {savedCard.isDefault !== false && (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
              Default
            </span>
          )}
        </div>
        <div className="mt-3 flex items-center justify-between rounded-lg border border-slate-100 px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-11 items-center justify-center rounded-md bg-slate-900 text-[10px] font-bold tracking-wide text-white">
              {savedCard.brand.toUpperCase()}
            </span>
            <div>
              <p className="text-sm text-slate-700">•••• •••• •••• {savedCard.last4}</p>
              <p className="text-xs text-slate-400">
                {savedCard.cardholderName} · Expires {savedCard.expiry}
              </p>
            </div>
          </div>
          <button className="text-slate-300">⟳</button>
        </div>

        {showAddCard ? (
          <div className="mt-4 rounded-lg border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-800">Add New Card</p>
              <button
                onClick={() => setShowAddCard(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <FiX size={16} />
              </button>
            </div>

            <div className="mt-3 space-y-3">
              <div>
                <label className="mb-1 block text-xs text-slate-500">Card Number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="1234 5678 9012 3456"
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-sky-400"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-500">Cardholder Name</label>
                <input
                  type="text"
                  value={cardholderName}
                  onChange={(e) => setCardholderName(e.target.value)}
                  placeholder="As shown on card"
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-sky-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs text-slate-500">Expiry Date</label>
                  <input
                    type="text"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    placeholder="MM/YY"
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-sky-400"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-slate-500">CVV</label>
                  <input
                    type="text"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    placeholder="•••"
                    className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-sky-400"
                  />
                </div>
              </div>
              <p className="text-xs text-slate-400">
                Your card details are encrypted and stored securely via Paystack.
              </p>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={() => setShowAddCard(false)}
                className="flex-1 rounded-md border border-slate-200 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCard}
                className="flex-1 rounded-md bg-sky-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-sky-700"
              >
                Save Card
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowAddCard(true)}
            className="mt-3 flex items-center gap-1.5 text-sm font-medium text-sky-600 hover:underline"
          >
            + Add New Card
          </button>
        )}
      </div>

      {/* Billing Address */}
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <p className="text-sm font-semibold text-slate-800">Billing Address</p>

        <div className="mt-3 space-y-3">
          <div>
            <label className="mb-1 block text-xs text-slate-500">Company Name</label>
            <input
              type="text"
              value={address.companyName}
              onChange={(e) => setAddress((a) => ({ ...a, companyName: e.target.value }))}
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-sky-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-500">Billing Email</label>
            <input
              type="email"
              value={address.billingEmail}
              onChange={(e) => setAddress((a) => ({ ...a, billingEmail: e.target.value }))}
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-sky-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-500">Address</label>
            <input
              type="text"
              value={address.address}
              onChange={(e) => setAddress((a) => ({ ...a, address: e.target.value }))}
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-sky-400"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs text-slate-500">State</label>
              <input
                type="text"
                value={address.state}
                onChange={(e) => setAddress((a) => ({ ...a, state: e.target.value }))}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-sky-400"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-500">Country</label>
              <input
                type="text"
                value={address.country}
                onChange={(e) => setAddress((a) => ({ ...a, country: e.target.value }))}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-sky-400"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleSaveAddress}
          className="mt-4 rounded-md bg-sky-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-sky-700"
        >
          Save Address
        </button>
      </div>
    </div>
  );
}