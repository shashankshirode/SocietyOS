export interface SkillReview {
  id: string;
  rating: number;
  comment: string;
  reviewerName: string;
  reviewerUnit: string;
  createdAt: string;
}

export interface SkillProfile {
  id: string;
  residentId: string;
  residentName: string;
  residentUnit: string;
  title: string; 
  description: string;
  skills: string[]; 
  categorySlug: string; 
  experienceYears?: number;
  availabilityHours?: string; 
  averageRating: number;
  reviewsCount: number;
  reviews?: SkillReview[];
  isActive: boolean;
  createdAt: string;
}

export interface ResidentService {
  id: string;
  name: string;
  slug: string;
  icon: string;
  profileCount: number;
}

export interface ServiceRequest {
  id: string;
  title: string; 
  description: string;
  categorySlug: string;
  postedById: string;
  postedByName: string;
  postedByUnit: string;
  budget?: string; 
  timing?: string; 
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
}
