
export interface Mentor {
  id: string;
  name: string;
  email: string;
  phone: string;
  speciality: string;
  bio: string;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  interviewCount: number;
  _count?: {
    interviews: number;
  };
}

export interface MentorResponse {
  success: boolean;
  message: string;
  mentors: Mentor[];
}

export interface CreateMentorInput {
  name: string;
  email: string;
  phone: string;
  speciality: string;
  bio: string;
  imageUrl?: string;
  isActive?: boolean;
}