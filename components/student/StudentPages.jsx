"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { ArrowRight, BedDouble, CalendarDays, CircleDollarSign, ClipboardList, MessageSquareText, Search, Users } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useHostel } from "@/context/HostelContext";
import { activeBooking, feeStatus, formatCurrency, formatDate, makeId, roomStatus } from "@/lib/helpers";
import { Button, EmptyState, LinkButton, MetricCard, PageHeading, Panel, StatusBadge, Table } from "@/components/common/UI";

function RoomCard({ room }) {
  const status = roomStatus(room);
  return <article className="room-card"><div className="room-card-top"><div><h3>Room {room.number}</h3><p>{room.hostel} · Floor {room.floor}</p></div><StatusBadge status={status}/></div><div className="room-card-meta"><span>Room type<strong>{room.type}</strong></span><span>Capacity<strong>{room.capacity} beds</strong></span><span>Available<strong>{Math.max(0, room.capacity - room.occupiedBeds)}</strong></span></div><div className="room-card-foot"><strong>{formatCurrency(room.monthlyFee)} <small>/ month</small></strong><Link className="panel-link" href={`/student/rooms/${room.id}`}>View room <ArrowRight size={13}/></Link></div></article>;
}

export function StudentDashboard() {
  const { user } = useAuth();
  const { rooms, bookings, fees, complaints, ready } = useHostel();
  if (!ready) return <EmptyState title="Loading your dashboard" description="Your hostel information is being prepared."/>;
  const ownBookings = bookings.filter((item) => item.studentId === user.id);
  const currentBooking = ownBookings.find((item) => item.status === "Approved");
  const currentRoom = rooms.find((room) => room.id === currentBooking?.roomId);
  const pendingFees = fees.filter((item) => item.studentId === user.id && feeStatus(item) !== "Paid").reduce((total, item) => total + item.amount, 0);
  const openComplaints = complaints.filter((item) => item.studentId === user.id && ["Pending", "In Progress"].includes(item.status)).length;
  const counts = { available: rooms.filter((room) => roomStatus(room) === "Available").length, partial: rooms.filter((room) => roomStatus(room) === "Partially Occupied").length, full: rooms.filter((room) => roomStatus(room) === "Fully Occupied").length };
  return <><PageHeading eyebrow="Student portal" title={`Good morning, ${user.name.split(" ")[0]}.`} description="Here is the latest on your stay and campus requests."/><div className="metrics-grid"><MetricCard label="Current room" value={currentRoom ? currentRoom.number : "Not assigned"} note={currentRoom?.hostel || "Explore available rooms"} icon={BedDouble}/><MetricCard label="Booking status" value={currentBooking?.status || ownBookings[0]?.status || "No request"} note={ownBookings[0]?.id || "Your next room is a few steps away"} icon={CalendarDays}/><MetricCard label="Fees to pay" value={formatCurrency(pendingFees)} note="Pending and overdue fees" icon={CircleDollarSign}/><MetricCard label="Open complaints" value={openComplaints} note="Pending or in progress" icon={MessageSquareText}/></div><div className="metrics-grid" style={{ marginTop: 13 }}><MetricCard label="Total rooms" value={rooms.length} icon={BedDouble}/><MetricCard label="Available" value={counts.available} icon={BedDouble}/><MetricCard label="Partially occupied" value={counts.partial} icon={Users}/><MetricCard label="Fully occupied" value={counts.full} icon={Users}/></div><div className="content-grid"><Panel title="Recent bookings" action={<Link className="panel-link" href="/student/bookings">All bookings</Link>}><Table columns={[{ key: "id", label: "Booking ID", render: (row) => <strong>{row.id}</strong> }, { key: "roomId", label: "Room", render: (row) => rooms.find((room) => room.id === row.roomId)?.number || "—" }, { key: "checkInDate", label: "Check-in", render: (row) => formatDate(row.checkInDate) }, { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status}/> }]} rows={ownBookings.slice(0, 4)} empty={{ title: "No bookings yet", description: "Browse rooms and send your first booking request."}}/></Panel><Panel title="Recent complaints" action={<Link className="panel-link" href="/student/complaints">View all</Link>}><div className="panel-body complaint-list">{complaints.filter((item) => item.studentId === user.id).slice(0, 4).map((item) => <div className="complaint-row" key={item.id}><div><strong>{item.subject}</strong><small>{item.id} · {formatDate(item.submittedAt)}</small></div><StatusBadge status={item.status}/></div>)}{!complaints.some((item) => item.studentId === user.id) && <EmptyState title="No complaints" description="Support requests you submit will show up here."/>}</div></Panel></div></>;
}

export function StudentRoomsPage() {
  const { rooms, ready } = useHostel();
  const [filters, setFilters] = useState({ search: "", hostel: "All hostels", type: "All types", availability: "All statuses", maxPrice: "", sort: "Default" });
  const update = (event) => setFilters((current) => ({ ...current, [event.target.name]: event.target.value }));
  const hostels = [...new Set(rooms.map((room) => room.hostel))];
  let visible = rooms.filter((room) => room.number.toLowerCase().includes(filters.search.toLowerCase()) && (filters.hostel === "All hostels" || room.hostel === filters.hostel) && (filters.type === "All types" || room.type === filters.type) && (filters.availability === "All statuses" || roomStatus(room) === filters.availability) && (!filters.maxPrice || room.monthlyFee <= Number(filters.maxPrice)));
  if (filters.sort === "Lowest fee") visible = [...visible].sort((left, right) => left.monthlyFee - right.monthlyFee);
  if (filters.sort === "Highest fee") visible = [...visible].sort((left, right) => right.monthlyFee - left.monthlyFee);
  return <><PageHeading eyebrow="Room directory" title="Browse rooms" description="Compare room types, rates, and availability across campus."/><div className="panel"><div className="toolbar"><label className="sr-only" htmlFor="roomSearch">Search room number</label><span style={{ position: "relative" }}><Search size={15} style={{ position: "absolute", left: 10, top: 11, color: "#82909a" }}/><input id="roomSearch" className="input search-input" style={{ paddingLeft: 32 }} name="search" placeholder="Search room number" value={filters.search} onChange={update}/></span><select className="select" name="hostel" aria-label="Filter by hostel" value={filters.hostel} onChange={update}><option>All hostels</option>{hostels.map((item) => <option key={item}>{item}</option>)}</select><select className="select" name="type" aria-label="Filter by room type" value={filters.type} onChange={update}><option>All types</option>{["Single", "Double Sharing", "Triple Sharing", "Four Sharing"].map((item) => <option key={item}>{item}</option>)}</select><select className="select" name="availability" aria-label="Filter by availability" value={filters.availability} onChange={update}><option>All statuses</option>{["Available", "Partially Occupied", "Fully Occupied"].map((item) => <option key={item}>{item}</option>)}</select><input className="input" name="maxPrice" type="number" min="0" aria-label="Maximum monthly fee" placeholder="Max fee (₹)" value={filters.maxPrice} onChange={update}/><select className="select" name="sort" aria-label="Sort rooms" value={filters.sort} onChange={update}><option>Default</option><option>Lowest fee</option><option>Highest fee</option></select></div>{!ready ? <EmptyState title="Loading rooms"/> : visible.length ? <div className="room-grid" style={{ padding: 16 }}>{visible.map((room) => <RoomCard room={room} key={room.id}/>)}</div> : <EmptyState title="No rooms match these filters" description="Try changing a filter or clearing the search."/>}</div></>;
}

export function StudentRoomDetails({ roomId }) {
  const { user } = useAuth();
  const { rooms, bookings, addBooking, ready } = useHostel();
  const router = useRouter();
  const [checkInDate, setCheckInDate] = useState("");
  const [duration, setDuration] = useState("10");
  const room = rooms.find((item) => item.id === roomId);
  if (!ready) return <EmptyState title="Loading room details"/>;
  if (!room) return <EmptyState title="Room not found" description="This room may have been removed from the directory." action={<LinkButton href="/student/rooms" variant="secondary">Back to rooms</LinkButton>}/>;
  const pendingCount = bookings.filter((item) => item.roomId === room.id && item.status === "Pending").length;
  const available = Math.max(0, room.capacity - room.occupiedBeds - pendingCount);
  const duplicate = bookings.some((item) => item.studentId === user.id && activeBooking(item));
  function submit(event) {
    event.preventDefault();
    const result = addBooking({ studentId: user.id, roomId: room.id, checkInDate, duration: Number(duration) });
    if (!result.ok) return toast.error(result.error);
    toast.success("Booking request submitted.");
    router.push("/student/bookings");
  }
  return <><PageHeading eyebrow={room.hostel} title={`Room ${room.number}`} description={`${room.type} · Floor ${room.floor}` } action={<LinkButton href="/student/rooms" variant="secondary">Back to rooms</LinkButton>}/><div className="detail-grid"><Panel title="Room information"><div className="panel-body"><p style={{ marginTop: 0, color: "var(--muted)", lineHeight: 1.7 }}>{room.description}</p><div className="detail-list">{[["Room number", room.number], ["Hostel block", room.hostel], ["Floor", room.floor], ["Room type", room.type], ["Capacity", `${room.capacity} beds`], ["Occupied beds", room.occupiedBeds], ["Available beds", available], ["Monthly fee", formatCurrency(room.monthlyFee)]].map(([label, value]) => <div className="detail-item" key={label}><span>{label}</span><strong>{value}</strong></div>)}</div><h3 style={{ color: "var(--navy)", fontSize: 13, margin: "20px 0 10px" }}>Facilities</h3><div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>{room.facilities.map((item) => <span className="status-badge status-default" key={item}>{item}</span>)}</div></div></Panel><Panel title="Request this room"><div className="panel-body"><div className="alert" style={{ marginBottom: 16 }}>Requests stay pending until the hostel administrator approves them. A pending request does not occupy a bed.</div>{duplicate ? <EmptyState title="You already have an active booking" description="Cancel or resolve your current request before booking another room." action={<LinkButton href="/student/bookings" variant="secondary">View bookings</LinkButton>}/> : <form onSubmit={submit}><div className="form-field"><label htmlFor="checkin">Preferred check-in date</label><input className="input" id="checkin" type="date" required min={new Date().toISOString().slice(0, 10)} value={checkInDate} onChange={(event) => setCheckInDate(event.target.value)}/></div><div className="form-field"><label htmlFor="duration">Booking duration (months)</label><select className="select" id="duration" value={duration} onChange={(event) => setDuration(event.target.value)}>{[3, 6, 8, 10, 12].map((months) => <option key={months} value={months}>{months} months</option>)}</select></div><div className="detail-item"><span>Monthly fee</span><strong>{formatCurrency(room.monthlyFee)}</strong></div><div className="detail-item"><span>Estimated duration total</span><strong>{formatCurrency(room.monthlyFee * Number(duration))}</strong></div><div className="detail-item"><span>Bed requests remaining</span><strong>{available}</strong></div><Button type="submit" disabled={available < 1} style={{ width: "100%", marginTop: 17 }}>{available < 1 ? "No beds available" : "Submit booking request"}</Button></form>}</div></Panel></div></>;
}

export function StudentBookingsPage() {
  const { user } = useAuth();
  const { bookings, rooms, cancelBooking, ready } = useHostel();
  if (!ready) return <EmptyState title="Loading bookings"/>;
  const mine = bookings.filter((item) => item.studentId === user.id);
  const rows = mine.map((booking) => {
    const room = rooms.find((item) => item.id === booking.roomId);
    return { ...booking, roomLabel: room ? `${room.number} · ${room.hostel}` : "Room removed", fee: booking.monthlyFee ?? room?.monthlyFee ?? 0 };
  });
  const columns = [{ key: "id", label: "Booking ID", render: (row) => <strong>{row.id}</strong> }, { key: "roomLabel", label: "Room" }, { key: "bookingDate", label: "Requested", render: (row) => formatDate(row.bookingDate) }, { key: "checkInDate", label: "Check-in", render: (row) => formatDate(row.checkInDate) }, { key: "fee", label: "Monthly fee", render: (row) => formatCurrency(row.fee) }, { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status}/> }, { key: "actions", label: "Actions", render: (row) => ["Pending", "Approved"].includes(row.status) ? <Button key="cancel" variant="danger" onClick={() => { if (window.confirm(`Cancel booking ${row.id}?`)) { const result = cancelBooking(row.id); result.ok ? toast.success("Booking cancelled.") : toast.error(result.error); } }}>Cancel</Button> : "—" }];
  return <><PageHeading eyebrow="Your requests" title="My bookings" description="Follow booking decisions and upcoming check-in dates." action={<LinkButton href="/student/rooms">Browse rooms</LinkButton>}/><Panel title={`${mine.length} booking records`}><Table columns={columns} rows={rows} empty={{ title: "No bookings yet", description: "Browse rooms to find a place that fits your campus life.", action: <LinkButton href="/student/rooms">Explore rooms</LinkButton> }}/></Panel></>;
}

export function StudentFeesPage() {
  const { user } = useAuth();
  const { fees, updateFee, ready } = useHostel();
  if (!ready) return <EmptyState title="Loading fee records"/>;
  const mine = fees.filter((item) => item.studentId === user.id).map((fee) => ({ ...fee, currentStatus: feeStatus(fee) }));
  const total = mine.reduce((sum, item) => sum + item.amount, 0);
  const paid = mine.filter((item) => item.currentStatus === "Paid").reduce((sum, item) => sum + item.amount, 0);
  const overdue = mine.filter((item) => item.currentStatus === "Overdue").reduce((sum, item) => sum + item.amount, 0);
  const pending = total - paid;
  const nextDue = mine.filter((item) => item.currentStatus !== "Paid").sort((a, b) => a.dueDate.localeCompare(b.dueDate))[0]?.dueDate;
  function pay(fee) {
    if (!window.confirm(`Confirm demo payment of ${formatCurrency(fee.amount)} for ${fee.type}? No real payment will be processed.`)) return;
    updateFee(fee.id, { status: "Paid", paymentDate: new Date().toISOString().slice(0, 10) });
    toast.success("Demo payment recorded.");
  }
  const columns = [{ key: "type", label: "Fee type", render: (row) => <strong>{row.type}</strong> }, { key: "amount", label: "Amount", render: (row) => formatCurrency(row.amount) }, { key: "dueDate", label: "Due date", render: (row) => formatDate(row.dueDate) }, { key: "paymentDate", label: "Payment date", render: (row) => formatDate(row.paymentDate) }, { key: "currentStatus", label: "Status", render: (row) => <StatusBadge status={row.currentStatus}/> }, { key: "action", label: "Action", render: (row) => row.currentStatus !== "Paid" ? <Button onClick={() => pay(row)}>Pay now</Button> : "—" }];
  return <><PageHeading eyebrow="Fee account" title="Fees & payments" description="Review hostel charges and record a simulated demo payment."/><div className="alert" style={{ marginBottom: 16 }}>Demo payment only. No payment gateway or real transaction is connected.</div><div className="metrics-grid"><MetricCard label="Total fees" value={formatCurrency(total)} icon={CircleDollarSign}/><MetricCard label="Paid amount" value={formatCurrency(paid)} icon={CircleDollarSign}/><MetricCard label="Pending amount" value={formatCurrency(pending)} icon={CircleDollarSign}/><MetricCard label="Overdue amount" value={formatCurrency(overdue)} note={nextDue ? `Next due ${formatDate(nextDue)}` : "No unpaid fee"} icon={CalendarDays}/></div><div style={{ marginTop: 18 }}><Panel title="Fee statement"><Table columns={columns} rows={mine} empty={{ title: "No fee records", description: "There are no charges assigned to your account yet." }}/></Panel></div></>;
}

export function StudentComplaintsPage() {
  const { user } = useAuth();
  const { complaints, addComplaint, ready } = useHostel();
  const [form, setForm] = useState({ category: "Room", subject: "", description: "", priority: "Medium" });
  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  if (!ready) return <EmptyState title="Loading support requests"/>;
  function submit(event) {
    event.preventDefault();
    addComplaint({ ...form, studentId: user.id });
    setForm({ category: "Room", subject: "", description: "", priority: "Medium" });
    toast.success("Your complaint was submitted.");
  }
  const mine = complaints.filter((item) => item.studentId === user.id);
  return <><PageHeading eyebrow="Student support" title="Complaints" description="Tell the hostel team what needs attention and track progress."/><div className="content-grid"><Panel title="Submit a complaint"><div className="panel-body"><form onSubmit={submit}><div className="form-field"><label htmlFor="category">Category</label><select className="select" id="category" name="category" value={form.category} onChange={update}>{["Room", "Electricity", "Water", "WiFi", "Cleaning", "Food", "Maintenance", "Other"].map((value) => <option key={value}>{value}</option>)}</select></div><div className="form-field"><label htmlFor="subject">Subject</label><input className="input" id="subject" name="subject" required minLength={4} maxLength={100} value={form.subject} onChange={update}/></div><div className="form-field"><label htmlFor="description">Description</label><textarea className="textarea" id="description" name="description" required minLength={10} maxLength={1000} value={form.description} onChange={update}/></div><div className="form-field"><label htmlFor="priority">Priority</label><select className="select" id="priority" name="priority" value={form.priority} onChange={update}>{["Low", "Medium", "High"].map((value) => <option key={value}>{value}</option>)}</select></div><Button type="submit">Submit complaint</Button></form></div></Panel><Panel title="Complaint history"><div className="panel-body complaint-list">{mine.length ? mine.map((item) => <div className="complaint-row" key={item.id}><div><strong>{item.subject}</strong><small>{item.id} · {item.category} · {formatDate(item.submittedAt)}</small><small>{item.priority} priority</small></div><StatusBadge status={item.status}/></div>) : <EmptyState title="Nothing to track" description="Submitted complaints and their status will appear here."/>}</div></Panel></div></>;
}

export function StudentProfilePage() {
  const { user } = useAuth();
  const { users, rooms, updateUser, ready } = useHostel();
  const profile = users.find((item) => item.id === user.id) || user;
  const assignedRoom = rooms.find((room) => room.id === profile.roomId);
  const [fields, setFields] = useState({ phone: profile.phone || "", course: profile.course || "", year: profile.year || "Year 1" });
  const update = (event) => setFields((current) => ({ ...current, [event.target.name]: event.target.value }));
  if (!ready) return <EmptyState title="Loading profile"/>;
  function save(event) {
    event.preventDefault();
    updateUser(user.id, fields);
    toast.success("Profile details updated.");
  }
  return <><PageHeading eyebrow="Account" title="My profile" description="Keep your contact and academic details current."/><div className="detail-grid"><Panel title="Student details"><div className="panel-body"><div className="detail-list">{[["Full name", profile.name], ["Student ID", profile.id], ["Email", profile.email], ["Hostel", assignedRoom?.hostel || profile.hostel || "Not assigned"], ["Room", assignedRoom?.number || "Not assigned"]].map(([label, value]) => <div className="detail-item" key={label}><span>{label}</span><strong>{value}</strong></div>)}</div><div className="alert" style={{ marginTop: 18 }}>Name, student ID, and email are read-only for this academic demo.</div></div></Panel><Panel title="Edit contact and academic details"><div className="panel-body"><form onSubmit={save}><div className="form-field"><label htmlFor="phone">Phone</label><input className="input" id="phone" name="phone" required value={fields.phone} onChange={update}/></div><div className="form-field"><label htmlFor="course">Course</label><input className="input" id="course" name="course" required value={fields.course} onChange={update}/></div><div className="form-field"><label htmlFor="year">Academic year</label><select className="select" id="year" name="year" value={fields.year} onChange={update}>{[1, 2, 3, 4].map((year) => <option key={year}>Year {year}</option>)}</select></div><Button type="submit">Save changes</Button></form></div></Panel></div></>;
}

export function DemoResetButton() {
  const { resetDemoData } = useHostel();
  return <Button variant="secondary" onClick={() => { if (window.confirm("Restore all original demo records? This will discard changes made in this browser.")) { resetDemoData(); toast.success("Demo records restored."); } }}>Reset demo data</Button>;
}
