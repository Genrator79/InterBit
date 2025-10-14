import { useGetMentors } from "@/hooks/use-mentors";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import Image from "next/image";
import { MapPinIcon, PhoneIcon, StarIcon } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { MentorCardsLoading } from "./MentorCardsLoading";

interface MentorSelectionStepProps {
  selectedMentorId: string | null;
  onSelectMentor: (mentorId: string) => void;
  onContinue: () => void;
}

function MentorSelectionStep({
  onContinue,
  onSelectMentor,
  selectedMentorId,
}: MentorSelectionStepProps) {
  const { data: mentors = [], isLoading } = useGetMentors();

  if (isLoading)
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Choose Your Mentor</h2>
        <MentorCardsLoading />
      </div>
    );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Choose Your Mentor</h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mentors.map((mentor) => (
          <Card
            key={mentor.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedMentorId === mentor.id ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => onSelectMentor(mentor.id)}
          >
            <CardHeader className="pb-4">
              <div className="flex items-start gap-4">
                <Image
                  src="/brain.png"
                  alt={mentor.name}
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <CardTitle className="text-lg">{mentor.name}</CardTitle>
                  <CardDescription className="text-primary font-medium">
                    {mentor.speciality || "Interview Coach"}
                  </CardDescription>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1">
                      <StarIcon className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-medium">5</span>
                    </div>
                    {/* <span className="text-sm text-muted-foreground">
                      ({mentor.sessionCount} sessions)
                    </span> */}
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPinIcon className="w-4 h-4" />
                <span>InterviewHub</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <PhoneIcon className="w-4 h-4" />
                <span>{mentor.phone}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {mentor.bio || "Experienced mentor helping candidates excel in interviews."}
              </p>
              <Badge variant="secondary">Verified Mentor</Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedMentorId && (
        <div className="flex justify-end">
          <Button onClick={onContinue}>Continue to Slot Selection</Button>
        </div>
      )}
    </div>
  );
}

export default MentorSelectionStep;
