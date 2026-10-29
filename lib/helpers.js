export function makeId(prefix) {
  const token = typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID().slice(0, 8).toUpperCase()
    : Math.random().toString(36).slice(2, 10).toUpperCase();
  return `${prefix}-${token}`;
}

export function roomStatus(room) {
  if (room.occupiedBeds >= room.capacity) return "Fully Occupied";
  if (room.occupiedBeds > 0) return "Partially Occupied";
  return "Available";
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);
}

export function formatDate(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${value}T00:00:00`));
}

export function activeBooking(booking) {
  return ["Pending", "Approved"].includes(booking.status);
}

export function feeStatus(fee) {
  if (fee.status !== "Paid" && fee.dueDate < new Date().toISOString().slice(0, 10)) return "Overdue";
  return fee.status;
}