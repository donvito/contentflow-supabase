export type Role = 'admin' | 'manager' | 'creator' | 'viewer';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatar?: string;
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'draft' | 'active' | 'completed' | 'archived';
  budget?: number;
  metrics?: {
    reach?: number;
    engagement?: number;
    conversions?: number;
  };
}

export interface Creator {
  id: string;
  userId: string;
  bio: string;
  socialLinks: {
    instagram?: string;
    youtube?: string;
    tiktok?: string;
    twitter?: string;
  };
  metrics: {
    totalCampaigns: number;
    completionRate: number;
    averageEngagement: number;
  };
  categories: string[];
  status: 'active' | 'inactive';
}