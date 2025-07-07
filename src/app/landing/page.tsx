// ================================
// page.tsx - The Server Component
// ================================

import { Metadata } from 'next';
import LandingClient from './LandingClient';

export const metadata: Metadata = {
  title: 'Shoutout Marketplace - Personalisierte Video-Grüße',
  description: 'Die beste Plattform für personalisierte Video-Grüße von deinen Lieblings-Creators',
};

// Server Component (no 'use client')
export default async function LandingPage() {
  // You can fetch any server-side data here if needed
  const serverData = {
    totalCreators: 150,
    totalShoutouts: 5420,
    averageRating: 4.8
  };

  return <LandingClient serverData={serverData} />;
}