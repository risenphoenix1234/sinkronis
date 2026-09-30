// src/components/ui/Table.tsx
"use client";

import { ReactNode, ThHTMLAttributes, TdHTMLAttributes, HTMLAttributes } from "react";
import { cn } from "@/utils/cn";

export interface TableContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export function Table({ children, className, ...props }: TableContainerProps) {
  return (
    <div
      className={cn(
        "overflow-x-auto rounded-lg border border-[#e5e7eb] bg-white shadow-sm",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface TableProps extends HTMLAttributes<HTMLTableElement> {
  children: ReactNode;
  className?: string;
}

export function T({ children, className, ...props }: TableProps) {
  return (
    <table className={cn("w-full text-left text-sm", className)} {...props}>
      {children}
    </table>
  );
}

export function THead({ children, className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn("border-b border-[#e5e7eb] text-xs text-[#6b7280]", className)} {...props}>{children}</thead>;
}

export function TBody({ children, className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={className} {...props}>{children}</tbody>;
}

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  children: ReactNode;
  className?: string;
  striped?: boolean;
}

export function TR({ children, className, striped, ...props }: TableRowProps) {
  return (
    <tr
      className={cn(
        "border-b border-[#f0f0f0] last:border-b-0 transition hover:bg-[#f1f5f9]/60",
        striped ? "bg-[#f9fafb]" : "bg-white",
        className,
      )}
      {...props}
    >
      {children}
    </tr>
  );
}

export interface TableHeadProps extends ThHTMLAttributes<HTMLTableCellElement> {
  children: ReactNode;
  className?: string;
}

export function TH({ children, className, ...props }: TableHeadProps) {
  return (
    <th
      className={cn("px-6 py-3.5 text-xs font-medium text-[#6b7280]", className)}
      {...props}
    >
      {children}
    </th>
  );
}

export interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  children: ReactNode;
  className?: string;
}

export function TD({ children, className, ...props }: TableCellProps) {
  return (
    <td className={cn("px-6 py-4", className)} {...props}>
      {children}
    </td>
  );
}

export default Table;
