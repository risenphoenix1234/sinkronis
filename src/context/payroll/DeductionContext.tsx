"use client";

import { createContext, useContext, useState, ReactNode } from "react";

import { CustomDeduction, Loan, LoanStatus } from "@/types/payroll/deduction-data";

import {
  customDeductions as initialCustomDeductions,
  loans as initialLoans,
} from "@/data/payroll/deduction-data";

type DeductionContextType = {
  loans: Loan[];
  addLoan: (loan: Loan) => void;
  updateLoan: (id: string, data: Partial<Loan>) => void;
  setLoanStatus: (id: string, status: LoanStatus) => void;
  deleteLoan: (id: string) => void;
  getLoanById: (id: string) => Loan | undefined;

  customDeductions: CustomDeduction[];
  addCustomDeduction: (deduction: CustomDeduction) => void;
  deleteCustomDeduction: (id: string) => void;
};

const DeductionContext = createContext<DeductionContextType | undefined>(
  undefined,
);

export function DeductionProvider({ children }: { children: ReactNode }) {
  const [loans, setLoans] = useState<Loan[]>(initialLoans);

  const [customDeductions, setCustomDeductions] = useState<CustomDeduction[]>(
    initialCustomDeductions,
  );

  const addLoan = (loan: Loan) => {
    setLoans((prev) => [loan, ...prev]);
  };

  const updateLoan = (id: string, data: Partial<Loan>) => {
    setLoans((prev) =>
      prev.map((loan) => (loan.id === id ? { ...loan, ...data } : loan)),
    );
  };

  const setLoanStatus = (id: string, status: LoanStatus) => {
    updateLoan(id, status === "Closed" ? { status, outstanding: 0 } : { status });
  };

  const deleteLoan = (id: string) => {
    setLoans((prev) => prev.filter((loan) => loan.id !== id));
  };

  const getLoanById = (id: string) => {
    return loans.find((loan) => loan.id === id);
  };

  const addCustomDeduction = (deduction: CustomDeduction) => {
    setCustomDeductions((prev) => [deduction, ...prev]);
  };

  const deleteCustomDeduction = (id: string) => {
    setCustomDeductions((prev) =>
      prev.filter((deduction) => deduction.id !== id),
    );
  };

  return (
    <DeductionContext.Provider
      value={{
        loans,
        addLoan,
        updateLoan,
        setLoanStatus,
        deleteLoan,
        getLoanById,
        customDeductions,
        addCustomDeduction,
        deleteCustomDeduction,
      }}
    >
      {children}
    </DeductionContext.Provider>
  );
}

export function useDeductions() {
  const context = useContext(DeductionContext);

  if (!context) {
    throw new Error("useDeductions must be used inside DeductionProvider");
  }

  return context;
}
