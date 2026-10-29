import { StudentRoomDetails } from "@/components/student/StudentPages";

export default async function StudentRoomRoute({ params }) {
  const { roomId } = await params;
  return <StudentRoomDetails roomId={roomId} />;
}
