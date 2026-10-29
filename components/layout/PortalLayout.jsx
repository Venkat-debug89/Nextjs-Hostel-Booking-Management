"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, BedDouble, CalendarDays, Check, CircleDollarSign, LayoutDashboard, LogOut, MessageSquareText, ShieldCheck, Users, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useHostel } from "@/context/HostelContext";
import { PageHeading } from "@/components/common/UI";

const studentNav = [
  { href: "/student/dashboard", label: "Overview", icon: LayoutDashboard }, { href: "/student/rooms", label: "Browse rooms", icon: BedDouble },
  { href: "/student/bookings", label: "My bookings", icon: CalendarDays }, { href: "/student/fees", label: "Fees", icon: CircleDollarSign },
  { href: "/student/complaints", label: "Complaints", icon: MessageSquareText }, { href: "/student/profile", label: "My profile", icon: UserRound },
];
const adminNav = [
  { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard }, { href: "/admin/rooms", label: "Manage rooms", icon: BedDouble },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarDays }, { href: "/admin/students", label: "Students", icon: Users },
  { href: "/admin/fees", label: "Fee records", icon: CircleDollarSign }, { href: "/admin/complaints", label: "Complaints", icon: MessageSquareText },
];

export function ProtectedLayout({ role, children }) {
  const { user, ready, logout } = useAuth();
  const { notifications = [], markNotificationRead, markAllNotificationsRead } = useHostel();
  const router = useRouter();
  const pathname = usePathname();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const nav = role === "admin" ? adminNav : studentNav;
  const current = nav.find((item) => item.href === pathname);
  const userNotifications = notifications.filter((item) => item.userId === user?.id);
  const unreadCount = userNotifications.filter((item) => !item.read).length;
  const onRoomDetails = role === "student" && /^\/student\/rooms\/[^/]+$/.test(pathname);
  useEffect(() => {
    if (!ready) return;
    if (!user) router.replace("/login");
    else if (user.role !== role) router.replace("/unauthorized");
  }, [ready, role, router, user]);
  if (!ready || !user || user.role !== role) return <main className="auth-main"><p>Loading your workspace…</p></main>;
  const brand = <Link className="brand" href={role === "admin" ? "/admin/dashboard" : "/student/dashboard"}><span className="brand-mark">{role === "admin" ? <ShieldCheck size={19} /> : <BedDouble size={19} />}</span>HostelHub</Link>;
  const initial = user.name?.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "HH";
  const signOut = () => { logout(); router.push("/"); };
  return <div className="portal"><aside className="sidebar">{brand}<div className="sidebar-label">{role === "admin" ? "Administration" : "Student portal"}</div><nav className="sidebar-nav" aria-label="Portal navigation">{nav.map(({ href, label, icon: Icon }) => <Link className={`nav-link ${pathname === href || pathname.startsWith(`${href}/`) ? "active" : ""}`} href={href} key={href}><Icon size={17} />{label}</Link>)}</nav><div className="sidebar-spacer"/><button className="nav-link" onClick={signOut}><LogOut size={17}/>Sign out</button><div className="sidebar-user"><span className="avatar">{initial}</span><span><strong>{user.name}</strong><small>{role === "admin" ? "Hostel administrator" : user.id}</small></span></div></aside>
    <main className="portal-main"><header className="topbar"><span className="mobile-brand">{brand}</span><span className="breadcrumb">{role === "admin" ? "Administration" : "Student portal"} <span aria-hidden="true">/</span> {current?.label || "Room details"}</span><div className="topbar-right"><span className="topbar-date">Academic year 2026–27</span>{role === "student" && <div className="notification-wrap"><button className="notification-button" type="button" aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`} aria-expanded={notificationsOpen} onClick={() => setNotificationsOpen((open) => !open)}><Bell size={18}/>{unreadCount > 0 && <span className="notification-count">{unreadCount}</span>}</button>{notificationsOpen && <section className="notification-panel" aria-label="Notifications"><div className="notification-panel-head"><strong>Notifications</strong>{unreadCount > 0 && <button type="button" onClick={() => markAllNotificationsRead(user.id)}>Mark all read</button>}</div>{userNotifications.length ? <div className="notification-list">{userNotifications.map((item) => <Link className={`notification-item ${item.read ? "" : "unread"}`} href={item.href} key={item.id} onClick={() => { if (!item.read) markNotificationRead(item.id); setNotificationsOpen(false); }}><span className="notification-item-icon">{item.read ? <Check size={14}/> : <Bell size={14}/>}</span><span><strong>{item.title}</strong><small>{item.message}</small><time>{new Date(item.createdAt).toLocaleString()}</time></span></Link>)}</div> : <p className="notification-empty">You are all caught up.</p>}</section>}</div>}<span className="avatar">{initial}</span></div></header><div className="portal-content">{onRoomDetails && <div className="alert" style={{ marginBottom: 16 }}>Booking request for <strong>{user.name}</strong> · Student ID {user.id}. Room selection and request details follow below.</div>}{children}</div><nav className="mobile-nav" aria-label="Mobile navigation">{nav.map(({ href, label, icon: Icon }) => <Link className={pathname === href ? "active" : ""} href={href} key={href}><Icon size={17}/><span>{label}</span></Link>)}<button onClick={signOut}><LogOut size={17}/><span>Sign out</span></button></nav></main></div>;
}

export function PortalPage({ eyebrow, title, description, action, children }) {
  return <><PageHeading eyebrow={eyebrow} title={title} description={description} action={action}/>{children}</>;
}
