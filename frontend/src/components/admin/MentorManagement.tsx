import { useGetMentors } from "@/hooks/use-mentors";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { EditIcon, MailIcon, PhoneIcon, PlusIcon, UserIcon } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";
import { Badge } from "../ui/badge";
import AddMentorDialog from "./AddMentorDialog";
import EditMentorDialog from "./EditMentorDialog";
import type { Mentor } from "@/types/mentor";

function MentorsManagement() {
  const { data: mentors = [], isLoading } = useGetMentors();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);

  const handleEditMentor = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setSelectedMentor(null);
  };

  return (
    <>
      <Card className="mb-12">
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="size-5 text-primary" />
              Mentors Management
            </CardTitle>
            <CardDescription>Manage and oversee all mentors in your platform</CardDescription>
          </div>

          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/100"
          >
            <PlusIcon className="mr-2 size-4" />
            Add Mentor
          </Button>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {isLoading ? (
              <div>Loading mentors...</div>
            ) : (
              mentors.map((mentor) => (
                <div
                  key={mentor.id}
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/50"
                >
                  <div className="flex items-center gap-4">
                    {/* <Image
                      src={mentor.imageUrl || "/default-avatar.png"}
                      alt={mentor.name}
                      width={48}
                      height={48}
                      className="size-12 rounded-full object-cover ring-2 ring-background"
                    /> */}

                    <div>
                      <div className="font-semibold">{mentor.name}</div>
                      <div className="text-sm text-muted-foreground">{mentor.speciality}</div>

                      <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MailIcon className="h-3 w-3" />
                          {mentor.email}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <PhoneIcon className="h-3 w-3" />
                          {mentor.phone}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {mentor.isActive ? (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
                    ) : (
                      <Badge variant="secondary">Inactive</Badge>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 px-3"
                      onClick={() => handleEditMentor(mentor)}
                    >
                      <EditIcon className="size-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <AddMentorDialog isOpen={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)} />

      <EditMentorDialog
        key={selectedMentor?.id} // ensures fresh state on dialog open
        isOpen={isEditDialogOpen}
        onClose={handleCloseEditDialog}
        mentor={selectedMentor}
      />
    </>
  );
}

export default MentorsManagement;
