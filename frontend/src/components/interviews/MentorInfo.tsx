import { useGetMentors } from "@/hooks/use-mentors";
import Image from "next/image";

function MentorInfo({ mentorId }: { mentorId: string }) {
  const { data: mentors = [] } = useGetMentors();
  const mentor = mentors.find((m) => m.id === mentorId);

  if (!mentor) return null;

  return (
    <div className="flex items-center gap-4">
      <Image
        src='/brain.png'
        alt={mentor.name}
        width={48}
        height={48}
        className="w-12 h-12 rounded-full object-cover"
      />
      <div>
        <h3 className="font-medium">{mentor.name}</h3>
        <p className="text-sm text-muted-foreground">
          {mentor.speciality || "Interview Coach"}
        </p>
      </div>
    </div>
  );
}

export default MentorInfo;
