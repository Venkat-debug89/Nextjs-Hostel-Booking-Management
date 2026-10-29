# HostelHub — Hostel Room Booking Platform

HostelHub is an INT257 academic project that demonstrates a hostel booking and management workflow using Next.js App Router, React, JavaScript, Tailwind CSS, and browser storage. Students can explore rooms, request bookings, review fees, raise complaints, and update their profiles. Administrators can manage room records, bookings, students, fees, and complaints.

## Problem statement

Hostel information is often split across notices, forms, and office conversations. HostelHub models a single campus portal where room availability and request status are visible to students and hostel staff.

## Objectives

- Demonstrate reusable React components, JSX, props, state, hooks, conditional rendering, and list rendering.
- Demonstrate Next.js App Router routes, nested layouts, dynamic segments, and client/server component boundaries.
- Build a responsive and accessible student/admin interface.
- Implement practical booking, room occupancy, fee, and complaint workflows with local demo data.

## Technology stack

- Next.js 16 App Router and React 19
- JavaScript and JSX
- Tailwind CSS 4 plus a small CSS design system in `app/globals.css`
- React Context API and React hooks
- Lucide React icons
- Recharts
- React Hot Toast
- localStorage for per-browser demo persistence

## Features

- Landing page with platform overview and sign-in/registration links.
- Demo student and administrator login with role-protected route layouts.
- Student dashboard with live room, booking, fee, and complaint statistics.
- Twenty sample rooms across Maple Hall, Cedar Hall, and Pine Hall, with search, type/block/status/price filters, and fee sorting.
- Dynamic room details and booking requests with duplicate request and capacity checks.
- Admin approval/rejection/cancellation; approved bookings adjust occupancy, while pending requests do not.
- Student fee summary with confirmed simulated payments.
- Complaint submission and status tracking.
- Student profile editing for phone, course, and academic year.
- Admin room, booking, student, fee, and complaint management.
- Four dashboard visualizations calculated from current records.
- Confirmation prompts, toast feedback, empty/loading states, mobile navigation, custom 404, and unauthorized page.
- An administrator-only **Reset demo data** action on the admin dashboard.

## Installation and execution

Requirements: Node.js 20.9 or newer and npm.

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. To make a production build, run:

```bash
npm run lint
npm run build
npm start
```

## Demo credentials

| Role | Email | Password |
| --- | --- | --- |
| Student | `student@gmail.com` | `student123` |
| Administrator | `admin@hostelhub.com` | `admin123` |

The sign-in form includes buttons to fill either demo account. Registration creates a student profile and signs in immediately. A newly registered password is kept in memory for the current browser session only; it is not stored in localStorage. Demo authentication is frontend-only and is not production-secure. Do not enter a real password or sensitive personal information.

## Project structure

```text
app/
  admin/                 Admin dashboard and management routes
  login/                 Demo sign-in
  register/              Student registration
  student/               Student dashboard and workflows
  unauthorized/           Role mismatch message
  globals.css             Design tokens, component styles, responsive rules
  layout.js               Root layout and providers
  page.js                 Public landing page
components/
  admin/                  Admin workflow views
  auth/                   Login and registration form
  common/                 Reusable buttons, tables, badges, panels, empty states
  dashboard/              Recharts visualizations
  layout/                 Responsive portal shell and role navigation
  student/                Student workflow views
context/
  AuthContext.jsx          Demo session, role, login, registration, logout
  HostelContext.jsx        Shared records and domain actions
data/
  initialData.js           Seed records for users, rooms, bookings, fees, complaints
hooks/                     Re-exports for context hooks
lib/
  helpers.js               IDs, currency/date formatting, status rules
  storage.js               Central browser storage access
providers/
  AppProviders.jsx         Context providers and toast host
```

## Architecture notes

### Next.js routing and layouts

Folders under `app/` define route segments. `student/layout.js` and `admin/layout.js` share the portal shell while protecting their route groups by role. The room detail page uses the `[roomId]` dynamic route segment. Internal navigation uses `next/link` and Next.js navigation hooks.

### Server and Client Components

App Router pages are Server Components by default. Static shells and the public landing page remain server-rendered. Context providers, forms, charts, room filters, and the protected portal shell are Client Components because they use React state, event handlers, effects, or browser APIs. Browser storage is read after mounting to avoid server/client hydration differences. The pathname-dependent portal shell is contained by Suspense during prerendering.

### Hooks and Context API

`useState` manages form and filter values. `useEffect` initializes browser-only state after mount and synchronizes persisted data. `useContext` exposes authentication and hostel records without passing props through every page. Shared components receive values and render functions through props.

### localStorage

`lib/storage.js` is the only module that accesses localStorage. The hostel store initializes sample data only if no saved data exists, then saves changes to this browser. The session stores only a demo user profile, never a password. The **Reset demo data** action restores the original seed records. Browser storage is local to one browser profile: it does not synchronize between devices, browsers, or users, and it is not a database or a secure store. Concurrent changes from different tabs/devices are not coordinated.

### Booking and occupancy rules

- Each room has a capacity and current `occupiedBeds` value; available beds are capacity minus occupied beds.
- Pending requests are counted against remaining request capacity to prevent multiple requests from overfilling the same room, but they do not increase occupancy.
- Approving a booking first checks that a bed is available and that the student has no other approved booking. Approval increments the room occupancy.
- Cancelling an approved booking decrements occupancy. Rejected and cancelled requests do not occupy beds.
- Students cannot create a second pending/approved booking while an active request exists.
- Room capacity cannot be lowered below current occupancy, and a room with an approved booking cannot be deleted.

### Validation and limitations

Forms use native HTML constraints plus explicit JavaScript checks. Login credentials are demonstration values embedded in frontend code and can be inspected; client-side role guards are navigation safeguards, not security controls. There is no backend, payment gateway, email service, access control enforcement, cross-device synchronization, or tamper-resistant data store. A real deployment needs server-side authentication/authorization, a database, validated APIs, audit history, and a payment provider.

## Viva preparation: 20 questions and answers

1. **What is Next.js?** A React framework that adds file-based routing, server rendering, layouts, and build optimizations.
2. **What does App Router mean?** Routes are declared by files and folders inside `app/`, with special files such as `page.js` and `layout.js`.
3. **What is a dynamic route?** A route with a variable segment, such as `student/rooms/[roomId]`, which receives the selected room ID.
4. **What is a layout?** A shared UI wrapper that persists across navigation within its route segment.
5. **What is a Server Component?** A component rendered on the server by default; it is useful for static or server-only work and avoids unnecessary client JavaScript.
6. **When is a Client Component needed?** When a component uses state, effects, event handlers, browser APIs, or client-only libraries.
7. **Why is `use client` used in the context files?** They use React hooks and share interactive state with browser pages.
8. **What does `useState` do?** It stores a component value and schedules a render when that value changes.
9. **What is `useEffect` used for here?** It loads localStorage after mount and synchronizes state to browser storage.
10. **What is Context API?** A React mechanism for sharing values across a component tree without manually passing props at each level.
11. **What is the difference between props and state?** Props are inputs from a parent; state is data owned and updated by a component or shared store.
12. **Why use `map()` to render records?** It transforms arrays into repeated UI elements; stable record IDs provide React keys.
13. **How does localStorage differ from a database?** It is browser-local key/value storage and has no server, multi-user coordination, access control, or reliable shared transactions.
14. **How does HostelHub avoid hydration mismatch?** It renders deterministic seed state first and reads browser storage only after the client mounts.
15. **What happens when a booking is pending?** It reserves request capacity for overbooking checks but does not increment the room's occupied-bed count.
16. **When does room occupancy change?** It increases when an admin approves a request and decreases when an approved booking is cancelled.
17. **How are duplicate booking requests prevented?** The shared booking action checks whether the student already has a pending or approved booking before adding one.
18. **How are forms validated?** Native HTML attributes provide basic constraints; JavaScript checks application-specific rules and reports errors.
19. **What does Recharts display?** Admin charts show current room occupancy, booking counts over recent months, fee collection, and complaint statuses.
20. **What would be needed for production?** Server-side authentication and authorization, a shared database/API, secure payment integration, input validation on the server, and audit logging.

## Future enhancements

- Replace localStorage with a server API and relational/document database.
- Add real authentication, password hashing, role permissions, and account recovery.
- Add payment gateway integration and downloadable receipts.
- Add email/push notifications, audit history, and automated booking expiry.
- Add automated unit and browser workflow tests.
