"use client";

import { createContext, useContext, useState, ReactNode } from "react";

import { Payee, PayeeStatus, PayeeType } from "@/types/payroll/payee-data";

import { payees as initialPayees } from "@/data/payroll/payee-data";

type PayeeContextType = {
  payees: Payee[];
  addPayee: (payee: Payee) => void;
  updatePayee: (id: string, data: Partial<Payee>) => void;
  deletePayee: (id: string) => void;
  getPayeeById: (id: string) => Payee | undefined;
};

const PayeeContext = createContext<PayeeContextType | undefined>(undefined);

export function PayeeProvider({ children }: { children: ReactNode }) {
  const [payees, setPayees] = useState<Payee[]>(initialPayees);

  const addPayee = (payee: Payee) => {
    setPayees((prev) => [payee, ...prev]);
  };

  const updatePayee = (id: string, data: Partial<Payee>) => {
    setPayees((prev) =>
      prev.map((payee) => (payee.id === id ? { ...payee, ...data } : payee)),
    );
  };

  const deletePayee = (id: string) => {
    setPayees((prev) => prev.filter((payee) => payee.id !== id));
  };

  const getPayeeById = (id: string) => {
    return payees.find((payee) => payee.id === id);
  };

  return (
    <PayeeContext.Provider
      value={{
        payees,
        addPayee,
        updatePayee,
        deletePayee,
        getPayeeById,
      }}
    >
      {children}
    </PayeeContext.Provider>
  );
}

export function usePayees() {
  const context = useContext(PayeeContext);

  if (!context) {
    throw new Error("usePayees must be used inside PayeeProvider");
  }

  return context;
}
