import axios from "axios";
import { DashboardResponse } from "./types/employeeTypes";

export async function getEmployeeDashboard() {
  const res = await axios.get<DashboardResponse>("/api/v1/employee/dashboard");
  return res.data.data; // unwrap to just the `data` payload
}

export async function clockIn() {
  await axios.post("/api/v1/employee/attendance/clock-in");
}

export async function clockOut() {
  await axios.post("/api/v1/employee/attendance/clock-out");
}