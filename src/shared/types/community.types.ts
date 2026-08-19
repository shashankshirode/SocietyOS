export interface CommunityActivity {
  id: string;
  type: 'MARKETPLACE' | 'SKILL' | 'BORROW' | 'LOST_FOUND';
  title: string;
  description: string;
  timestamp: string;
  unitNumber: string;
  userName: string;
}

export interface CommunityDashboard {
  activeListingsCount: number;
  skillsRegisteredCount: number;
  activeBorrowsCount: number;
  lostItemsActiveCount: number;
  recentActivities: CommunityActivity[];
}

export interface CommunityContactRequest {
  id: string;
  type: 'MARKETPLACE' | 'SKILL' | 'BORROW' | 'LOST_FOUND';
  targetId: string; 
  targetTitle: string; 
  senderId: string;
  senderName: string;
  senderUnit: string;
  receiverId: string;
  receiverName: string;
  receiverUnit: string;
  message: string;
  urgency: 'NORMAL' | 'IMPORTANT' | 'URGENT';
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'BLOCKED' | 'REPORTED' | 'CANCELLED';
  createdAt: string;
}

export interface CommunityAuditLog {
  id: string;
  timestamp: string;
  action: string;
  module: 'MARKETPLACE' | 'SKILL_DIRECTORY' | 'BORROW_LEND' | 'LOST_FOUND' | 'SETTINGS';
  performedBy: string;
  performedByRole: string;
  unitNumber?: string;
  details: string;
  ipAddress?: string;
}

export interface CommunitySettings {
  allowResidentMarketplace: boolean;
  requireModerationBeforePublishing: boolean;
  maxActiveListingsPerResident: number;
  allowBorrowLend: boolean;
  maxBorrowedItemsPerResident: number;
  autoArchiveAfterDays: number;
}
