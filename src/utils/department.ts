export function resolveDepartmentName(dept: unknown): string {
  if (!dept) return "—";
  if (typeof dept === "string") {
    const trimmed = dept.trim();
    return trimmed || "—";
  }
  if (typeof dept === "object" && dept !== null) {
    if ("name" in dept && typeof (dept as { name: unknown }).name === "string") {
      const name = (dept as { name: string }).name.trim();
      if (name) return name;
    }
    if (
      "departmentName" in dept &&
      typeof (dept as { departmentName: unknown }).departmentName === "string"
    ) {
      const deptName = (dept as { departmentName: string }).departmentName.trim();
      if (deptName) return deptName;
    }
  }
  const str = String(dept);
  return str !== "[object Object]" ? str : "—";
}
