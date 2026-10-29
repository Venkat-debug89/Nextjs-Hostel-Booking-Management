"use client";

import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCurrency } from "@/lib/helpers";

const colors = ["#245f86", "#5d9879", "#d49b4b", "#bb6863"];

export default function DashboardCharts({ rooms, bookings, fees, complaints }) {
  const today = new Date();
  const months = Array.from({ length: 6 }, (_, index) => new Date(today.getFullYear(), today.getMonth() - 5 + index, 1));
  const monthlyBookings = months.map((month) => {
    const key = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}`;
    return { month: month.toLocaleString("en", { month: "short" }), bookings: bookings.filter((item) => item.bookingDate?.startsWith(key)).length };
  });
  const feeCollection = months.map((month) => {
    const key = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}`;
    return { month: month.toLocaleString("en", { month: "short" }), amount: fees.filter((item) => item.status === "Paid" && item.paymentDate?.startsWith(key)).reduce((sum, item) => sum + item.amount, 0) };
  });
  const roomOccupancy = rooms.map((room) => ({ name: room.number, occupied: room.occupiedBeds, available: Math.max(0, room.capacity - room.occupiedBeds) }));
  const complaintStatuses = ["Pending", "In Progress", "Resolved", "Rejected"].map((status) => ({ name: status, value: complaints.filter((item) => item.status === status).length }));
  return <div className="content-grid" style={{ marginTop: 18 }}>
    <section className="panel"><div className="panel-head"><h2>Room occupancy</h2></div><div className="panel-body chart-box"><ResponsiveContainer width="100%" height="100%"><BarChart data={roomOccupancy.slice(0, 10)} margin={{ left: -18, right: 8, top: 8 }}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8edef"/><XAxis dataKey="name" tick={{ fontSize: 10 }}/><YAxis allowDecimals={false} tick={{ fontSize: 10 }}/><Tooltip/><Legend/><Bar dataKey="occupied" name="Occupied beds" fill="#245f86" radius={[2, 2, 0, 0]}/><Bar dataKey="available" name="Available beds" fill="#9fc4d5" radius={[2, 2, 0, 0]}/></BarChart></ResponsiveContainer></div></section>
    <section className="panel"><div className="panel-head"><h2>Complaint status</h2></div><div className="panel-body chart-box"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={complaintStatuses} dataKey="value" nameKey="name" cx="50%" cy="48%" outerRadius={76} innerRadius={42} paddingAngle={3}>{complaintStatuses.map((item, index) => <Cell key={item.name} fill={colors[index % colors.length]}/>)}</Pie><Tooltip/><Legend verticalAlign="bottom" height={30} wrapperStyle={{ fontSize: 10 }}/></PieChart></ResponsiveContainer></div></section>
    <section className="panel"><div className="panel-head"><h2>Monthly bookings</h2></div><div className="panel-body chart-box"><ResponsiveContainer width="100%" height="100%"><LineChart data={monthlyBookings} margin={{ left: -18, right: 8, top: 8 }}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8edef"/><XAxis dataKey="month" tick={{ fontSize: 10 }}/><YAxis allowDecimals={false} tick={{ fontSize: 10 }}/><Tooltip/><Line type="monotone" dataKey="bookings" stroke="#397e78" strokeWidth={2} dot={{ r: 3 }}/></LineChart></ResponsiveContainer></div></section>
    <section className="panel"><div className="panel-head"><h2>Fee collection</h2></div><div className="panel-body chart-box"><ResponsiveContainer width="100%" height="100%"><BarChart data={feeCollection} margin={{ left: -8, right: 8, top: 8 }}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8edef"/><XAxis dataKey="month" tick={{ fontSize: 10 }}/><YAxis tickFormatter={(value) => `${Math.round(value / 1000)}k`} tick={{ fontSize: 10 }}/><Tooltip formatter={(value) => formatCurrency(value)}/><Bar dataKey="amount" name="Paid fees" fill="#d49b4b" radius={[3, 3, 0, 0]}/></BarChart></ResponsiveContainer></div></section>
  </div>;
}
