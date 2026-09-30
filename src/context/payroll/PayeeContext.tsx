"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { UnifiedPayee } from "@/types/payroll/unified-payee";
import {
  loadUnifiedPayees,
  saveUnifiedPayees,
} from "@/data/payroll/unified-payee-data";

type PayeeContextType = {
  payees: UnifiedPayee[];
  addPayee: (payee: UnifiedPayee) => void;
  addPayees: (newPayees: UnifiedPayee[]) => void;
  updatePayee: (id: string, data: Partial<UnifiedPayee>) => void;
  deletePayee: (id: string) => void;
  toggleOnPayroll: (id: string) => void;
  getPayeeById: (id: string) => UnifiedPayee | undefined;
  resetToDefault: () => void;
};

const PayeeContext = createContext<PayeeContextType | undefined>(undefined);

export function PayeeProvider({ children }: { children: ReactNode }) {
  const [payees, setPayees] = useState<UnifiedPayee[]>(() => {
    return loadUnifiedPayees();
  });

  // Keep in sync with local storage
  useEffect(() => {
    saveUnifiedPayees(payees);
  }, [payees]);

  const addPayee = (payee: UnifiedPayee) => {
    setPayees((prev) => [payee, ...prev]);
  };

  const addPayees = (newPayees: UnifiedPayee[]) => {
    setPayees((prev) => [...newPayees, ...prev]);
  };

  const updatePayee = (id: string, data: Partial<UnifiedPayee>) => {
    setPayees((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...data } : item)),
    );
  };

  const deletePayee = (id: string) => {
    setPayees((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleOnPayroll = (id: string) => {
    setPayees((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, onPayroll: !item.onPayroll } : item,
      ),
    );
  };

  const getPayeeById = (id: string) => {
    return payees.find((item) => item.id === id);
  };

  const resetToDefault = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("sinkronis_payroll_unified_payees_v1");
    }
    const fresh = loadUnifiedPayees();
    setPayees(fresh);
  };

  return (
    <PayeeContext.Provider
      value={{
        payees,
        addPayee,
        addPayees,
        updatePayee,
        deletePayee,
        toggleOnPayroll,
        getPayeeById,
        resetToDefault,
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
