"use client";

import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import {
  getMyPlanPaymentMethod,
  getMyPlanCards,
  addPaymentCard,
  removePaymentCard,
  setDefaultPaymentCard,
  saveBillingAddress,
} from "@/lib/api/admin";
import {
  MyPlanCard,
  MyPlanPaymentMethodData,
  MyPlanCountryOption,
} from "@/lib/api/types/admin.types";

export default function PaymentMethodPage() {
  const [paymentData, setPaymentData] = useState<MyPlanPaymentMethodData | null>(null);
  const [cards, setCards] = useState<MyPlanCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showAddCard, setShowAddCard] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardError, setCardError] = useState<string | null>(null);
  const [savingCard, setSavingCard] = useState(false);

  const [companyName, setCompanyName] = useState("");
  const [billingEmail, setBillingEmail] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [addressError, setAddressError] = useState<string | null>(null);
  const [savingAddress, setSavingAddress] = useState(false);
  const [addressSaved, setAddressSaved] = useState(false);

  const [settingDefaultId, setSettingDefaultId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [pmRes, cardsRes] = await Promise.all([getMyPlanPaymentMethod(), getMyPlanCards()]);
      setPaymentData(pmRes.data);
      setCards(cardsRes.data);
      const values = pmRes.data.billingAddress.values;
      setCompanyName(values.companyName);
      setBillingEmail(values.billingEmail);
      setAddress(values.address);
      setCountry(values.country);
      setState(values.state);
    } catch (err) {
      setError("Failed to load payment method.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);
  const handleSaveCard = async () => {
    if (!cardNumber || !cardholderName || !expiryDate || !cvv) {
      setCardError("All card fields are required.");
      return;
    }
    setSavingCard(true);
    setCardError(null);
    try {
      await addPaymentCard({
        cardNumber,
        cardHolderName: cardholderName,
        expiryDate,
        cvv,
        makeDefault: cards.length === 0,
      });
      setShowAddCard(false);
      setCardNumber("");
      setCardholderName("");
      setExpiryDate("");
      setCvv("");
      fetchAll();
    } catch (err: any) {
      const validationErrors = err?.response?.data?.validationErrors;
      if (validationErrors && validationErrors.length > 0) {
        setCardError(validationErrors.map((v: any) => v.message).join(" "));
      } else {
        setCardError(err?.response?.data?.message || "Failed to save card.");
      }
    } finally {
      setSavingCard(false);
    }
  };

  const handleSetDefault = async (cardId: string) => {
    setSettingDefaultId(cardId);
    setError(null);
    try {
      await setDefaultPaymentCard(cardId);
      fetchAll();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to set default card.");
    } finally {
      setSettingDefaultId(null);
    }
  };

  const handleRemoveCard = async (cardId: string) => {
    setRemovingId(cardId);
    setError(null);
    try {
      await removePaymentCard(cardId);
      setCards((prev) => prev.filter((c) => c.id !== cardId));
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to remove card.");
    } finally {
      setRemovingId(null);
    }
  };

  const handleSaveAddress = async () => {
    if (!companyName || !billingEmail || !address || !country || !state) {
      setAddressError("All fields are required.");
      return;
    }
    setSavingAddress(true);
    setAddressError(null);
    setAddressSaved(false);
    try {
      await saveBillingAddress({ companyName, billingEmail, address, country, state });
      setAddressSaved(true);
    } catch (err: any) {
      setAddressError(err?.response?.data?.message || "Failed to save billing address.");
    } finally {
      setSavingAddress(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-slate-400">Loading payment method...</p>;
  }

  if (error && !paymentData) {
    return <p className="text-sm text-red-500">{error}</p>;
  }

  const countryOptions: MyPlanCountryOption[] = paymentData?.billingAddress.countryDropdown.options ?? [];

  return (
    <div className="max-w-2xl space-y-5">
      {error && (
        <div className="rounded-md bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <p className="text-sm font-semibold text-slate-800">Saved Payment Methods</p>

        <div className="mt-3 space-y-2">
          {cards.map((card) => (
            <div
              key={card.id}
              className="flex items-center justify-between rounded-lg border border-slate-100 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-11 items-center justify-center rounded-md bg-slate-900 text-[10px] font-bold tracking-wide text-white">
                  {card.brand.toUpperCase()}
                </span>
                <div>
                  <p className="text-sm text-slate-700">•••• •••• •••• {card.last4}</p>
                  <p className="text-xs text-slate-400">
                    {card.cardHolderName} · Expires {String(card.expMonth).padStart(2, "0")}/
                    {card.expYear}
                  </p>
                </div>
                {card.isDefault && (
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                    Default
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                {!card.isDefault && (
                  <button
                    onClick={() => handleSetDefault(card.id)}
                    disabled={settingDefaultId === card.id}
                    className="text-xs font-medium text-sky-600 hover:underline disabled:opacity-60"
                  >
                    {settingDefaultId === card.id ? "Setting..." : "Make default"}
                  </button>
                )}
                <button
                  onClick={() => handleRemoveCard(card.id)}
                  disabled={removingId === card.id}
                  className="text-xs font-medium text-rose-600 hover:underline disabled:opacity-60"
                >
                  {removingId === card.id ? "Removing..." : "Remove"}
                </button>
              </div>
            </div>
          ))}

          {cards.length === 0 && (
            <p className="rounded-lg border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-400">
              No card added yet.
            </p>
          )}
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

            {cardError && (
              <div className="mt-3 rounded-md bg-red-50 px-3 py-2 text-xs text-red-600">
                {cardError}
              </div>
            )}

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
                Your card details are encrypted and stored securely.
              </p>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={() => setShowAddCard(false)}
                disabled={savingCard}
                className="flex-1 rounded-md border border-slate-200 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCard}
                disabled={savingCard}
                className="flex-1 rounded-md bg-sky-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-60"
              >
                {savingCard ? "Saving..." : "Save Card"}
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

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <p className="text-sm font-semibold text-slate-800">Billing Address</p>

        {addressError && (
          <div className="mt-3 rounded-md bg-red-50 px-3 py-2 text-xs text-red-600">
            {addressError}
          </div>
        )}
        {addressSaved && (
          <div className="mt-3 rounded-md bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
            Billing address saved.
          </div>
        )}

        <div className="mt-3 space-y-3">
          <div>
            <label className="mb-1 block text-xs text-slate-500">Company Name</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-sky-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-500">Billing Email</label>
            <input
              type="email"
              value={billingEmail}
              onChange={(e) => setBillingEmail(e.target.value)}
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-sky-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-500">Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-sky-400"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs text-slate-500">Country</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-sky-400"
              >
                <option value="">Select country</option>
                {countryOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-500">State</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                disabled={!country}
                className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-sky-400 disabled:cursor-not-allowed disabled:bg-slate-50"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleSaveAddress}
          disabled={savingAddress}
          className="mt-4 rounded-md bg-sky-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-60"
        >
          {savingAddress ? "Saving..." : "Save Address"}
        </button>
      </div>
    </div>
  );
}