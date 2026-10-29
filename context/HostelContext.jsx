"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { createInitialData } from "@/data/initialData";
import { activeBooking, makeId } from "@/lib/helpers";
import { readStorage, STORAGE_KEYS, writeStorage } from "@/lib/storage";

const HostelContext = createContext(null);

export function HostelProvider({ children }) {
  const [data, setData] = useState(createInitialData);
  const [ready, setReady] = useState(false);
  const dataRef = useRef(data);

  useEffect(() => {
    let active = true;
    // Browser storage loads after mount so the server and first client render match.
    Promise.resolve().then(() => {
      if (!active) return;
      const stored = readStorage(STORAGE_KEYS.data, null);
      const next = stored?.rooms ? { ...stored, notifications: stored.notifications || [] } : createInitialData();
      dataRef.current = next;
      setData(next);
      setReady(true);
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (ready) writeStorage(STORAGE_KEYS.data, data);
  }, [data, ready]);

  function commit(change) {
    const next = change(dataRef.current);
    if (!next) return null;
    dataRef.current = next;
    setData(next);
    return next;
  }

  function addRoom(room) {
    if (Number(room.capacity) < Number(room.occupiedBeds || 0)) return { ok: false, error: "Capacity cannot be below current occupancy." };
    if (dataRef.current.rooms.some((item) => item.number === room.number && item.hostel === room.hostel)) return { ok: false, error: "That room number already exists in this hostel." };
    commit((current) => ({ ...current, rooms: [...current.rooms, { ...room, id: makeId("ROOM"), capacity: Number(room.capacity), occupiedBeds: Number(room.occupiedBeds || 0), monthlyFee: Number(room.monthlyFee) }] }));
    return { ok: true };
  }

  function updateRoom(id, changes) {
    const room = dataRef.current.rooms.find((item) => item.id === id);
    if (!room) return { ok: false, error: "Room not found." };
    if (Number(changes.capacity ?? room.capacity) < room.occupiedBeds) return { ok: false, error: "Capacity cannot be reduced below current occupancy." };
    if (dataRef.current.rooms.some((item) => item.id !== id && item.number === (changes.number ?? room.number) && item.hostel === (changes.hostel ?? room.hostel))) return { ok: false, error: "That room number already exists in this hostel." };
    commit((current) => ({ ...current, rooms: current.rooms.map((item) => item.id === id ? { ...item, ...changes, capacity: Number(changes.capacity ?? item.capacity), monthlyFee: Number(changes.monthlyFee ?? item.monthlyFee) } : item) }));
    return { ok: true };
  }

  function deleteRoom(id) {
    if (dataRef.current.bookings.some((booking) => booking.roomId === id && booking.status === "Approved")) return { ok: false, error: "This room has an active approved booking." };
    commit((current) => ({ ...current, rooms: current.rooms.filter((room) => room.id !== id) }));
    return { ok: true };
  }

  function addBooking(booking) {
    const current = dataRef.current;
    const room = current.rooms.find((item) => item.id === booking.roomId);
    if (!room || room.occupiedBeds >= room.capacity) return { ok: false, error: "This room no longer has an available bed." };
    if (current.bookings.some((item) => item.studentId === booking.studentId && activeBooking(item))) return { ok: false, error: "You already have an active booking request." };
    // Pending requests reserve request capacity, but never increase occupiedBeds.
    const pendingForRoom = current.bookings.filter((item) => item.roomId === booking.roomId && item.status === "Pending").length;
    if (room.capacity - room.occupiedBeds - pendingForRoom < 1) return { ok: false, error: "All available beds already have pending requests." };
    commit((state) => ({ ...state, bookings: [{ ...booking, monthlyFee: room.monthlyFee, id: makeId("BK"), status: "Pending", bookingDate: new Date().toISOString().slice(0, 10) }, ...state.bookings] }));
    return { ok: true };
  }

  function updateBooking(id, changes) {
    const current = dataRef.current;
    const booking = current.bookings.find((item) => item.id === id);
    if (!booking) return { ok: false, error: "Booking not found." };
    const targetStatus = changes.status ?? booking.status;
    const room = current.rooms.find((item) => item.id === booking.roomId);
    if (targetStatus === "Approved" && booking.status !== "Approved") {
      if (!room || room.occupiedBeds >= room.capacity) return { ok: false, error: "No available bed remains in this room." };
      const conflict = current.bookings.some((item) => item.id !== id && item.studentId === booking.studentId && item.status === "Approved");
      if (conflict) return { ok: false, error: "This student already has an approved booking." };
    }
    commit((state) => {
      let rooms = state.rooms;
      let fees = state.fees;
      let notifications = state.notifications || [];
      let users = state.users;
      if (booking.status !== "Approved" && targetStatus === "Approved") rooms = rooms.map((item) => item.id === booking.roomId ? { ...item, occupiedBeds: item.occupiedBeds + 1 } : item);
      if (booking.status === "Approved" && targetStatus !== "Approved") rooms = rooms.map((item) => item.id === booking.roomId ? { ...item, occupiedBeds: Math.max(0, item.occupiedBeds - 1) } : item);
      if (booking.status !== "Approved" && targetStatus === "Approved") {
        users = users.map((item) => item.id === booking.studentId ? { ...item, roomId: booking.roomId, hostel: room.hostel } : item);
        if (!fees.some((item) => item.bookingId === id)) {
          const amount = Number(booking.monthlyFee ?? room.monthlyFee);
          fees = [{ id: makeId("FEE"), bookingId: id, studentId: booking.studentId, type: "Hostel Rent", amount, dueDate: booking.checkInDate || new Date().toISOString().slice(0, 10), paymentDate: "", status: "Pending" }, ...fees];
        }
      }
      if (booking.status === "Approved" && targetStatus !== "Approved") {
        users = users.map((item) => item.id === booking.studentId && item.roomId === booking.roomId ? { ...item, roomId: "", hostel: "" } : item);
        fees = fees.filter((item) => item.bookingId !== id || item.status === "Paid");
      }
      if (targetStatus !== booking.status && ["Approved", "Rejected"].includes(targetStatus)) {
        const approved = targetStatus === "Approved";
        const amount = Number(booking.monthlyFee ?? room?.monthlyFee ?? 0);
        notifications = [{
          id: makeId("NTF"),
          userId: booking.studentId,
          title: approved ? "Room booking approved" : "Room booking declined",
          message: approved ? `Your request for Room ${room.number} has been approved. A monthly Hostel Rent fee of ${formatCurrency(amount)} was added to your fees.` : `Your request for Room ${room?.number || "your selected room"} was not approved.`,
          createdAt: new Date().toISOString(),
          href: approved ? "/student/fees" : "/student/bookings",
          read: false,
        }, ...notifications];
      }
      return { ...state, users, rooms, fees, notifications, bookings: state.bookings.map((item) => item.id === id ? { ...item, ...changes } : item) };
    });
    return { ok: true };
  }

  function markNotificationRead(id) {
    commit((current) => ({ ...current, notifications: (current.notifications || []).map((item) => item.id === id ? { ...item, read: true } : item) }));
  }

  function markAllNotificationsRead(userId) {
    commit((current) => ({ ...current, notifications: (current.notifications || []).map((item) => item.userId === userId ? { ...item, read: true } : item) }));
  }

  function cancelBooking(id) {
    const booking = dataRef.current.bookings.find((item) => item.id === id);
    if (!booking || !["Pending", "Approved"].includes(booking.status)) return { ok: false, error: "This booking can no longer be cancelled." };
    return updateBooking(id, { status: "Cancelled" });
  }

  function addComplaint(complaint) {
    commit((current) => ({ ...current, complaints: [{ ...complaint, id: makeId("CMP"), status: "Pending", submittedAt: new Date().toISOString().slice(0, 10) }, ...current.complaints] }));
    return { ok: true };
  }

  function updateComplaint(id, changes) {
    commit((current) => ({ ...current, complaints: current.complaints.map((item) => item.id === id ? { ...item, ...changes } : item) }));
    return { ok: true };
  }

  function addFee(fee) {
    commit((current) => ({ ...current, fees: [{ ...fee, id: makeId("FEE"), amount: Number(fee.amount), paymentDate: "", status: fee.status || "Pending" }, ...current.fees] }));
    return { ok: true };
  }

  function updateFee(id, changes) {
    commit((current) => ({ ...current, fees: current.fees.map((item) => item.id === id ? { ...item, ...changes, amount: Number(changes.amount ?? item.amount) } : item) }));
    return { ok: true };
  }

  function deleteFee(id) {
    const fee = dataRef.current.fees.find((item) => item.id === id);
    if (!fee) return { ok: false, error: "Fee record not found." };
    if (fee.status === "Paid") return { ok: false, error: "Paid fee records are retained as payment history." };
    commit((current) => ({ ...current, fees: current.fees.filter((item) => item.id !== id) }));
    return { ok: true };
  }

  function updateUser(id, changes) {
    commit((current) => ({ ...current, users: current.users.map((item) => item.id === id ? { ...item, ...changes } : item) }));
    return { ok: true };
  }

  function registerStudent(student) {
    const current = dataRef.current;
    if (current.users.some((item) => item.email.toLowerCase() === student.email.toLowerCase())) return { ok: false, error: "An account with this email already exists." };
    const profile = { ...student };
    delete profile.password;
    const user = { ...profile, id: makeId("STU"), role: "student", status: "Active", roomId: "" };
    commit((state) => ({ ...state, users: [...state.users, user] }));
    return { ok: true, user };
  }

  function resetDemoData() {
    commit(() => createInitialData());
  }

  const value = {
    ...data,
    ready,
    addRoom,
    updateRoom,
    deleteRoom,
    addBooking,
    updateBooking,
    markNotificationRead,
    markAllNotificationsRead,
    cancelBooking,
    addComplaint,
    updateComplaint,
    addFee,
    updateFee,
    deleteFee,
    updateUser,
    registerStudent,
    resetDemoData,
  };

  return <HostelContext.Provider value={value}>{children}</HostelContext.Provider>;
}

export function useHostel() {
  const context = useContext(HostelContext);
  if (!context) throw new Error("useHostel must be used within HostelProvider.");
  return context;
}