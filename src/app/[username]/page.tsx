import { CheckCircle2, Clock, MessageSquare, Star, Bell, Euro, Play, Send } from 'lucide-react';
import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import ProfilePageClient from './ProfilePageClient';

interface ShoutoutOption {
  id: string;
  title: string;
  duration: number;
  price: number;
  sort_order: number;
}

interface ShoutoutSettings {
  shoutout_mode_active: boolean;
  is_unlimited: boolean;
  max_quantity: string | null;
}

interface PublicProfile {
  id: number;
  username: string;
  first_name?: string;
  last_name?: string;
  bio?: string;
  profile_image_original?: string;
  profile_image_thumbnail?: string;
  profile_image_small?: string;
  instagram_username?: string;
  tiktok_username?: string;
  youtube_username?: string;
  twitter_username?: string;
  twitch_username?: string;
  rating: number;
  completed_shoutouts: number;
  is_verified: boolean;
  created_at: string;
}

interface ProfileData {
  profile: PublicProfile;
  shoutoutSettings: ShoutoutSettings;
  shoutoutOptions: ShoutoutOption[];
}

function getDisplayName(profile: PublicProfile): string {
  if (profile.first_name || profile.last_name) {
    return `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
  }
  return profile.username;
}

// API call to get profile data
async function getProfileData(username: string): Promise<ProfileData | null> {
  try {
const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
const response = await fetch(`${baseUrl}/public/profile/${username}`, {
 cache: 'no-store'
});
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
}

export async function generateMetadata(props: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const params = await props.params;
  const profileData = await getProfileData(params.username);
  
  if (!profileData) {
    return {
      title: 'Profil nicht gefunden - Shoutout Marketplace',
    };
  }

  const displayName = getDisplayName(profileData.profile);
  
  return {
    title: `${displayName} (@${params.username}) - Shoutout Marketplace`,
    description: `Erhalte personalisierte Video-Grüße von ${displayName}. ${profileData.profile.bio || 'Verfügbar für Shoutouts'}`,
  };
}

// Server Component (no 'use client')
export default async function ProfilePage(props: { params: Promise<{ username: string }> }) {
  const params = await props.params;
  const profileData = await getProfileData(params.username);

  if (!profileData) {
    notFound();
  }

  return <ProfilePageClient profileData={profileData} username={params.username} />;
}