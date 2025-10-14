import { INTERVIEW_TYPES } from "@/lib/utils";
import { Button } from "../ui/button";
import { ChevronLeftIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import MentorInfo from "./MentorInfo";

interface InterviewConfirmationStepProps {
  selectedMentorId: string;
  selectedDate: string;
  selectedTime: string;
  selectedType: string;
  isBooking: boolean;
  onBack: () => void;
  onConfirm: () => void;
  onModify: () => void;
}

function InterviewConfirmationStep({
  selectedMentorId,
  selectedDate,
  selectedTime,
  selectedType,
  isBooking,
  onBack,
  onConfirm,
  onModify,
}: InterviewConfirmationStepProps) {
  const interviewType = INTERVIEW_TYPES.find((t) => t.id === selectedType);

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={onBack}>
          <ChevronLeftIcon className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h2 className="text-2xl font-semibold">Interview Booking Confirmation</h2>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Interview Details</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* mentor/interviewer info */}
          <MentorInfo mentorId={selectedMentorId} />

          {/* interview summary */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <p className="text-sm text-muted-foreground">Interview Type</p>
              <p className="font-medium">{interviewType?.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="font-medium">{interviewType?.duration}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="font-medium">
                {new Date(selectedDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Time</p>
              <p className="font-medium">{selectedTime}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Mode</p>
              <p className="font-medium">Online (Video Call)</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Interview Fee</p>
              <p className="font-medium text-primary">
                {interviewType?.price}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* action buttons */}
      <div className="flex gap-4">
        <Button variant="outline" onClick={onModify}>
          Modify Interview
        </Button>
        <Button
          onClick={onConfirm}
          className="bg-primary"
          disabled={isBooking}
        >
          {isBooking ? "Scheduling..." : "Confirm Interview"}
        </Button>
      </div>
    </div>
  );
}

export default InterviewConfirmationStep
