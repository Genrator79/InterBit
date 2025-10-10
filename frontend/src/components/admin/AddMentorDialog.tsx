import { useCreateMentor } from "@/hooks/use-mentors";
import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { formatIndianPhoneNumber } from "@/lib/utils";

interface AddMentorDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

function AddMentorDialog({ isOpen, onClose }: AddMentorDialogProps) {
  const [newMentor, setNewMentor] = useState({
    name: "",
    email: "",
    phone: "",
    speciality: "",
    bio: "",
    isActive: true,
  });

  const { createMentor, isLoading } = useCreateMentor();

  const handlePhoneChange = (value: string) => {
    const formattedPhoneNumber = formatIndianPhoneNumber(value);
    setNewMentor({ ...newMentor, phone: formattedPhoneNumber });
  };

  const handleSave = async () => {
    try {
      const res = await createMentor({ ...newMentor });
      if (res?.success) {
      toast.success(res.message || "Mentor added successfully!", {duration: 2000});
      handleClose();
    } else {
      toast.error(res?.message || "Failed to add mentor.", {duration: 2000});
    }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Something went wrong while creating mentor.", { duration: 2000});
    }
  };

  const handleClose = () => {
    onClose();
    setNewMentor({
      name: "",
      email: "",
      phone: "",
      speciality: "",
      bio: "",
      isActive: true,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Mentor</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new mentor to your platform.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Personal Details */}
          <h4 className="text-sm font-medium text-gray-700">Personal Details</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mentor-name">Full Name *</Label>
              <Input
                id="mentor-name"
                value={newMentor.name}
                onChange={(e) => setNewMentor({ ...newMentor, name: e.target.value })}
                placeholder="John Smith"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mentor-speciality">Speciality *</Label>
              <Input
                id="mentor-speciality"
                value={newMentor.speciality}
                onChange={(e) => setNewMentor({ ...newMentor, speciality: e.target.value })}
                placeholder="Software Engineering"
              />
            </div>
          </div>

          {/* Contact Details */}
          <h4 className="text-sm font-medium text-gray-700 pt-4">Contact Details</h4>
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="mentor-email">Email Address *</Label>
              <Input
                id="mentor-email"
                type="email"
                value={newMentor.email}
                onChange={(e) => setNewMentor({ ...newMentor, email: e.target.value })}
                placeholder="mentor@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mentor-phone">Phone Number</Label>
              <Input
                id="mentor-phone"
                value={newMentor.phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="(555) 123-4567"
              />
            </div>
          </div>

          {/* About Mentor */}
          <h4 className="text-sm font-medium text-gray-700 pt-4">About Mentor</h4>
          <div className="space-y-2">
            <Label htmlFor="mentor-bio">Short Bio *</Label>
            <Input
              id="mentor-bio"
              value={newMentor.bio}
              onChange={(e) => setNewMentor({ ...newMentor, bio: e.target.value })}
              placeholder="A brief description about the mentor"
            />
          </div>

          {/* Status */}
          <div className="space-y-2 pt-2">
            <span id="mentor-status-label" className="block text-sm font-medium text-gray-700">
              Account Status
            </span>
            <Select
              aria-labelledby="mentor-status-label"
              value={newMentor.isActive ? "active" : "inactive"}
              onValueChange={(value) => setNewMentor({ ...newMentor, isActive: value === "active" })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>

          <Button
            onClick={handleSave}
            className="bg-primary hover:bg-primary/90"
            disabled={
              !newMentor.name ||
              !newMentor.email ||
              !newMentor.speciality ||
              isLoading
            }
          >
            {isLoading ? "Adding..." : "Add Mentor"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddMentorDialog;
