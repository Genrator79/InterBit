"use client";

import { useUpdateMentor } from "@/hooks/use-mentors";
import { formatIndianPhoneNumber } from "@/lib/utils";
import { useState, useEffect } from "react";
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
import type { Mentor } from "@/types/mentor";

interface EditMentorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  mentor: Mentor | null;
}

function EditMentorDialog({ mentor, isOpen, onClose }: EditMentorDialogProps) {
  const [editingMentor, setEditingMentor] = useState<Mentor | null>(mentor);
  const { updateMentor, isLoading } = useUpdateMentor();

  useEffect(() => {
    setEditingMentor(mentor);
  }, [mentor]);

  const handlePhoneChange = (value: string) => {
    const formattedPhoneNumber = formatIndianPhoneNumber(value);
    if (editingMentor) {
      setEditingMentor({ ...editingMentor, phone: formattedPhoneNumber });
    }
  };

  const handleSave = async () => {
    if (!editingMentor) return;
    try {
      const res = await updateMentor(editingMentor);

      if (res?.success) {
        toast.success(res.message || "Mentor updated successfully!", { duration: 2000 });
        handleClose();
      } else {
        toast.error(res?.message || "Failed to update mentor.", { duration: 2000 });
      }
    } catch (err: any) {
      console.error("Error updating mentor:", err);
      toast.error(err?.message || "Something went wrong while updating mentor.", { duration: 2000 });
    }
  };

  const handleClose = () => {
    onClose();
    setEditingMentor(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Mentor</DialogTitle>
          <DialogDescription>Update mentor information and status.</DialogDescription>
        </DialogHeader>

        {editingMentor && (
          <div className="grid gap-6 py-4">
            {/* Personal Details */}
            <h4 className="text-sm font-medium text-gray-700">Personal Details</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-mentor-name">Full Name</Label>
                <Input
                  id="edit-mentor-name"
                  value={editingMentor.name}
                  onChange={(e) =>
                    setEditingMentor({ ...editingMentor, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-mentor-speciality">Speciality</Label>
                <Input
                  id="edit-mentor-speciality"
                  value={editingMentor.speciality}
                  onChange={(e) =>
                    setEditingMentor({ ...editingMentor, speciality: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Contact Details */}
            <h4 className="text-sm font-medium text-gray-700 pt-4">Contact Details</h4>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-mentor-email">Email Address</Label>
                <Input
                  id="edit-mentor-email"
                  type="email"
                  value={editingMentor.email}
                  onChange={(e) =>
                    setEditingMentor({ ...editingMentor, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-mentor-phone">Phone Number</Label>
                <Input
                  id="edit-mentor-phone"
                  value={editingMentor.phone || ""}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                />
              </div>
            </div>

            {/* About Mentor */}
            <h4 className="text-sm font-medium text-gray-700 pt-4">About Mentor</h4>
            <div className="space-y-2">
              <Label htmlFor="edit-mentor-bio">Short Bio</Label>
              <Input
                id="edit-mentor-bio"
                value={editingMentor.bio || ""}
                onChange={(e) =>
                  setEditingMentor({ ...editingMentor, bio: e.target.value })
                }
              />
            </div>

            {/* Status */}
            <div className="space-y-2 pt-2">
              <span
                id="edit-mentor-status-label"
                className="block text-sm font-medium text-gray-700"
              >
                Account Status
              </span>
              <Select
                aria-labelledby="edit-mentor-status-label"
                value={editingMentor.isActive ? "active" : "inactive"}
                onValueChange={(value) =>
                  setEditingMentor({ ...editingMentor, isActive: value === "active" })
                }
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
        )}

        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-primary hover:bg-primary/90"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EditMentorDialog;
