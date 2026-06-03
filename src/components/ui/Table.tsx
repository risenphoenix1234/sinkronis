import { ReactNode } from 'react'
export function Table({ children }: { children: ReactNode }) {
  return <div className="overflow-x-auto rounded-lg border border-border bg-white">{children}</div>
}
export function T({ children }: { children: ReactNode }) { return <table className="w-full text-left text-sm">{children}</table> }
export function TH({ children }: { children: ReactNode }) { return <th className="bg-gray-50 px-4 py-2 font-medium text-gray-600">{children}</th> }
export function TR({ children }: { children: ReactNode }) { return <tr className="border-b last:border-none">{children}</tr> }
export function TD({ children }: { children: ReactNode }) { return <td className="px-4 py-2">{children}</td> }
