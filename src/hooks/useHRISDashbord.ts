// "use client";

// import { useCallback, useEffect, useState } from "react";

// import { getHRISDashboard } from "@/lib/api/hris";
// import type { HRISDashboardData } from "@/types/hris";

// export function useHRISDashboard() {
//   const [data, setData] = useState<HRISDashboardData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const fetchDashboard = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const response = await getHRISDashboard();

//       console.log("HRIS DASHBOARD RESPONSE:", response);

//       setData(response);
//     } catch (error: unknown) {
//       console.error("HRIS DASHBOARD ERROR:", error);

//       setError("Failed to load HRIS dashboard");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchDashboard();
//   }, [fetchDashboard]);

//   return {
//     data,
//     loading,
//     error,
//     refetch: fetchDashboard,
//   };
// }