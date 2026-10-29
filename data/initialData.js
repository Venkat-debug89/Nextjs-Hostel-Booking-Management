const students = [
  { id: "STU-2401", name: "Aarav Sharma", email: "student@gmail.com", phone: "+91 98765 43210", course: "Computer Science", year: "Year 2", hostel: "Maple Hall", roomId: "room-101", role: "student", status: "Active" },
  { id: "STU-2402", name: "Aanya Patel", email: "aanya.patel@college.edu", phone: "+91 98765 43211", course: "Electrical Engineering", year: "Year 1", hostel: "Cedar Hall", roomId: "room-108", role: "student", status: "Active" },
  { id: "STU-2403", name: "Vihaan Reddy", email: "vihaan.reddy@college.edu", phone: "+91 98765 43212", course: "Business Administration", year: "Year 3", hostel: "Maple Hall", roomId: "room-105", role: "student", status: "Active" },
  { id: "STU-2404", name: "Diya Nair", email: "diya.nair@college.edu", phone: "+91 98765 43213", course: "Design", year: "Year 2", hostel: "Cedar Hall", roomId: "room-109", role: "student", status: "Active" },
  { id: "STU-2405", name: "Arjun Kumar", email: "arjun.kumar@college.edu", phone: "+91 98765 43214", course: "Mechanical Engineering", year: "Year 4", hostel: "Pine Hall", roomId: "room-115", role: "student", status: "Active" },
  { id: "STU-2406", name: "Ishita Rao", email: "ishita.rao@college.edu", phone: "+91 98765 43215", course: "Psychology", year: "Year 1", hostel: "Maple Hall", roomId: "room-102", role: "student", status: "Active" },
  { id: "STU-2407", name: "Kabir Singh", email: "kabir.singh@college.edu", phone: "+91 98765 43216", course: "Civil Engineering", year: "Year 3", hostel: "Pine Hall", roomId: "room-116", role: "student", status: "Active" },
  { id: "STU-2408", name: "Meera Iyer", email: "meera.iyer@college.edu", phone: "+91 98765 43217", course: "Biotechnology", year: "Year 2", hostel: "Cedar Hall", roomId: "room-111", role: "student", status: "Active" },
  { id: "STU-2409", name: "Rohan Das", email: "rohan.das@college.edu", phone: "+91 98765 43218", course: "Mathematics", year: "Year 1", hostel: "Maple Hall", roomId: "room-103", role: "student", status: "Active" },
  { id: "STU-2410", name: "Sara Joseph", email: "sara.joseph@college.edu", phone: "+91 98765 43219", course: "Media Studies", year: "Year 4", hostel: "Pine Hall", roomId: "room-118", role: "student", status: "Active" },
];

const roomTypes = ["Single", "Double Sharing", "Triple Sharing", "Four Sharing"];
const facilities = ["WiFi", "Bed", "Study table", "Chair", "Cupboard", "Fan", "Attached bathroom"];

const rooms = Array.from({ length: 20 }, (_, index) => {
  const block = ["Maple Hall", "Cedar Hall", "Pine Hall"][Math.min(2, Math.floor(index / 7))];
  const capacity = [1, 2, 3, 4][index % 4];
  const occupiedBeds = [1, 1, 2, 3, 1, 2, 0, 3, 1, 2, 1, 0, 2, 3, 1, 0, 2, 1, 3, 2][index];
  return {
    id: `room-${101 + index}`,
    number: String(101 + index),
    hostel: block,
    floor: Math.floor(index / 7) + 1,
    type: roomTypes[index % 4],
    capacity,
    occupiedBeds: Math.min(capacity, occupiedBeds),
    monthlyFee: [8500, 6200, 4800, 3900][index % 4],
    facilities: facilities.filter((_, facilityIndex) => facilityIndex !== (index % 7)),
    description: `A well-maintained ${roomTypes[index % 4].toLowerCase()} room in ${block}, with natural light and convenient access to campus facilities.`,
  };
});

const bookings = [
  { id: "BK-26001", studentId: "STU-2401", roomId: "room-101", bookingDate: "2026-09-01", checkInDate: "2026-10-15", duration: 10, status: "Approved" },
  { id: "BK-26002", studentId: "STU-2402", roomId: "room-108", bookingDate: "2026-09-03", checkInDate: "2026-10-18", duration: 12, status: "Pending" },
  { id: "BK-26003", studentId: "STU-2403", roomId: "room-105", bookingDate: "2026-09-04", checkInDate: "2026-10-20", duration: 8, status: "Approved" },
  { id: "BK-26004", studentId: "STU-2404", roomId: "room-109", bookingDate: "2026-09-06", checkInDate: "2026-10-21", duration: 10, status: "Rejected" },
  { id: "BK-26005", studentId: "STU-2405", roomId: "room-115", bookingDate: "2026-09-08", checkInDate: "2026-10-22", duration: 6, status: "Pending" },
  { id: "BK-26006", studentId: "STU-2406", roomId: "room-102", bookingDate: "2026-09-10", checkInDate: "2026-10-25", duration: 12, status: "Approved" },
  { id: "BK-26007", studentId: "STU-2407", roomId: "room-116", bookingDate: "2026-09-12", checkInDate: "2026-10-28", duration: 10, status: "Cancelled" },
  { id: "BK-26008", studentId: "STU-2408", roomId: "room-111", bookingDate: "2026-09-13", checkInDate: "2026-11-01", duration: 12, status: "Pending" },
  { id: "BK-26009", studentId: "STU-2409", roomId: "room-103", bookingDate: "2026-09-15", checkInDate: "2026-11-03", duration: 8, status: "Approved" },
  { id: "BK-26010", studentId: "STU-2410", roomId: "room-118", bookingDate: "2026-09-16", checkInDate: "2026-11-05", duration: 10, status: "Pending" },
];

const feeTypes = ["Hostel Rent", "Mess Fee", "Maintenance Fee", "Electricity Fee"];
const fees = students.slice(0, 5).flatMap((student, studentIndex) => feeTypes.map((type, feeIndex) => ({
  id: `FEE-${studentIndex + 1}${feeIndex + 1}`,
  studentId: student.id,
  type,
  amount: [6200, 2800, 700, 450][feeIndex],
  dueDate: `2026-${String(9 + Math.floor(feeIndex / 2)).padStart(2, "0")}-${String(5 + studentIndex).padStart(2, "0")}`,
  paymentDate: (studentIndex + feeIndex) % 3 === 0 ? "2026-09-03" : "",
  status: (studentIndex + feeIndex) % 3 === 0 ? "Paid" : (studentIndex + feeIndex) % 4 === 0 ? "Overdue" : "Pending",
})));

const complaints = [
  ["STU-2401", "WiFi", "WiFi drops in the evening", "Medium", "In Progress"],
  ["STU-2402", "Water", "Low water pressure in washroom", "High", "Pending"],
  ["STU-2403", "Cleaning", "Request room deep cleaning", "Low", "Resolved"],
  ["STU-2404", "Electricity", "Desk light is not working", "Medium", "Pending"],
  ["STU-2405", "Maintenance", "Cupboard hinge needs repair", "Low", "In Progress"],
  ["STU-2406", "Food", "Vegetarian meal options", "Medium", "Resolved"],
  ["STU-2407", "Room", "Ceiling fan is noisy", "High", "Pending"],
  ["STU-2408", "WiFi", "Unable to connect to campus network", "Medium", "Rejected"],
  ["STU-2409", "Cleaning", "Common area cleaning schedule", "Low", "Pending"],
  ["STU-2410", "Other", "Request for a visitor pass", "Low", "Resolved"],
].map(([studentId, category, subject, priority, status], index) => ({
  id: `CMP-260${String(index + 1).padStart(2, "0")}`,
  studentId,
  category,
  subject,
  description: `${subject}. Please review this request when convenient.`,
  priority,
  status,
  submittedAt: `2026-09-${String(10 + index).padStart(2, "0")}`,
}));

export function createInitialData() {
  return { users: students, rooms, bookings, fees, complaints };
}

export const demoAdmin = {
  id: "ADM-001",
  name: "Hostel Administrator",
  email: "admin@hostelhub.com",
  role: "admin",
};