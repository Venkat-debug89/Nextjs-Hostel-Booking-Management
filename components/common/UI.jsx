"use client";

import Link from "next/link";
import { Inbox } from "lucide-react";

export function StatusBadge({ status }) {
  const className = `status-${String(status || "default").toLowerCase().replaceAll(" ", "-")}`;
  return <span className={`status-badge ${className}`}>{status || "Unknown"}</span>;
}

export function PageHeading({ eyebrow, title, description, action }) {
  return <div className="page-heading"><div><span className="eyebrow-small">{eyebrow}</span><h1>{title}</h1>{description && <p>{description}</p>}</div>{action}</div>;
}

export function MetricCard({ label, value, note, icon: Icon }) {
  return <article className="metric-card"><div className="metric-top"><span>{label}</span>{Icon && <span className="metric-icon"><Icon size={16} /></span>}</div><div className="metric-value">{value}</div>{note && <div className="metric-note">{note}</div>}</article>;
}

export function EmptyState({ title = "Nothing here yet", description = "Your information will appear here when it is available.", action, icon: Icon = Inbox }) {
  return <div className="empty-state"><div><Icon size={26} /><br /><strong>{title}</strong><p>{description}</p>{action && <div style={{ marginTop: 14 }}>{action}</div>}</div></div>;
}

export function Panel({ title, action, children, className = "" }) {
  return <section className={`panel ${className}`}><div className="panel-head"><h2>{title}</h2>{action}</div>{children}</section>;
}

export function Button({ children, variant = "primary", className = "", ...props }) {
  return <button className={`button button-${variant} ${className}`} {...props}>{children}</button>;
}

export function LinkButton({ href, children, variant = "primary", className = "" }) {
  return <Link className={`button button-${variant} ${className}`} href={href}>{children}</Link>;
}

export function Table({ columns, rows, empty }) {
  if (!rows.length) return <EmptyState {...empty} />;
  return <div className="table-scroll"><table className="data-table"><thead><tr>{columns.map((column) => <th key={column.key}>{column.label}</th>)}</tr></thead><tbody>{rows.map((row) => <tr key={row.id}>{columns.map((column) => <td key={column.key}>{column.render ? column.render(row) : row[column.key]}</td>)}</tr>)}</tbody></table></div>;
}
