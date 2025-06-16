// src/app/[username]/page.tsx

import { Campaign, ProfileData } from '@/types';
import { CheckCircle2, Clock, MessageCircle, Star, TrendingUp, Users, Video } from 'lucide-react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Mock data for development - replace with actual API call
async function getProfileData(username: string): Promise<ProfileData | null> {
  try {
    // TODO: Replace with actual API call
    // const response = await apiClient.get(`/public/profile/${username}`);
    // return response.data;

    // Mock data for now
    return {
      user: {
        id: 1,
        username: username,
        email: 'hs@test.com',
        profile_picture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
        bio: 'Content Creator',
        is_verified: true,
        created_at: '2024-01-01',
      },
      campaigns: [
        {
          id: 1,
          user_id: 1,
          category_id: 1,
          custom_title: null,
          is_active: true,
          is_unlimited: true,
          max_shoutouts: null,
          shoutouts_sold: 156,
          expires_at: null,
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
          category: {
            id: 1,
            slug: 'birthday',
            name: 'Geburtstags-Grüße',
            description: 'Persönliche Geburtstagswünsche',
          },
          priceOptions: [
            { id: 1, campaign_id: 1, duration_seconds: 30, price: 25, is_active: true },
            { id: 2, campaign_id: 1, duration_seconds: 60, price: 40, is_active: true },
            { id: 3, campaign_id: 1, duration_seconds: 120, price: 65, is_active: true },
          ],
        },
        {
          id: 2,
          user_id: 1,
          category_id: 2,
          custom_title: 'Fitness Motivation',
          is_active: true,
          is_unlimited: false,
          max_shoutouts: 50,
          shoutouts_sold: 23,
          expires_at: null,
          created_at: '2024-01-15',
          updated_at: '2024-01-15',
          category: {
            id: 7,
            slug: 'other',
            name: 'Sonstiges',
            description: 'Andere Arten von Shoutouts',
          },
          priceOptions: [
            { id: 4, campaign_id: 2, duration_seconds: 45, price: 35, is_active: true },
            { id: 5, campaign_id: 2, duration_seconds: 90, price: 55, is_active: true },
          ],
        },
      ],
      stats: {
        totalShoutouts: 179,
        avgRating: 4.9,
        responseTime: '24h',
      },
    };
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: { username: string } }): Promise<Metadata> {
  return {
    title: `${params.username} - Shoutout Marketplace`,
    description: `Erhalte personalisierte Video-Grüße von ${params.username}`,
  };
}

function getCampaignTitle(campaign: Campaign): string {
  return campaign.custom_title || campaign.category?.name || 'Shoutout';
}

function getLowestPrice(campaign: Campaign): number {
  if (!campaign.priceOptions || campaign.priceOptions.length === 0) return 0;
  return Math.min(...campaign.priceOptions.map(opt => opt.price));
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds} Sek`;
  const minutes = Math.floor(seconds / 60);
  return `${minutes} Min`;
}

export default async function ProfilePage({ params }: { params: { username: string } }) {
  const profileData = await getProfileData(params.username);

  if (!profileData) {
    notFound();
  }

  const { user, campaigns, stats } = profileData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        
        {/* Animated background elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse-slow" />

        <div className="relative max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            {/* Profile Picture */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse-slow" />
              <div className="relative w-40 h-40 lg:w-48 lg:h-48 rounded-full overflow-hidden ring-4 ring-white/50">
                <Image
                  src={user.profile_picture || '/default-avatar.png'}
                  alt={user.username}
                  fill
                  className="object-cover"
                />
              </div>
              {user.is_verified && (
                <div className="absolute bottom-2 right-2 bg-blue-500 text-white p-2 rounded-full shadow-lg">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-2 animate-fadeIn">
                {user.username}
              </h1>
              
              {/* Stats */}
              <div className="flex flex-wrap gap-6 justify-center lg:justify-start mb-6 animate-fadeIn">
                <div className="flex items-center gap-2 text-white/90">
                  <Video className="w-5 h-5" />
                  <span className="font-semibold">{stats.totalShoutouts}</span>
                  <span className="text-white/70">Shoutouts</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span className="font-semibold">{stats.avgRating}</span>
                  <span className="text-white/70">Bewertung</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <Clock className="w-5 h-5" />
                  <span className="font-semibold">{stats.responseTime}</span>
                  <span className="text-white/70">Antwortzeit</span>
                </div>
              </div>

              {/* Bio */}
              {user.bio && (
                <p className="text-white/90 whitespace-pre-line max-w-2xl animate-fadeIn">
                  {user.bio}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Campaigns Section */}
      <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-10 animate-fadeIn">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Verfügbare Shoutouts
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Wähle aus verschiedenen personalisierten Video-Nachrichten von {user.username}
          </p>
        </div>

        {campaigns.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
              <MessageCircle className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg">Noch keine Shoutouts verfügbar</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign, index) => (
              <Link
                key={campaign.id}
                href={`/campaign/${campaign.id}`}
                className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden animate-fadeIn`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Campaign Card */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
                
                <div className="p-6">
                  {/* Category Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-purple-800">
                      {campaign.category?.name}
                    </span>
                    {!campaign.is_unlimited && campaign.max_shoutouts && (
                      <span className="text-sm text-gray-500">
                        {campaign.max_shoutouts - campaign.shoutouts_sold} verfügbar
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all">
                    {getCampaignTitle(campaign)}
                  </h3>

                  {/* Price Options */}
                  <div className="space-y-2 mb-4">
                    {campaign.priceOptions?.slice(0, 3).map((option) => (
                      <div key={option.id} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {formatDuration(option.duration_seconds)}
                        </span>
                        <span className="font-semibold text-gray-900">€{option.price}</span>
                      </div>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {campaign.shoutouts_sold} verkauft
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        Beliebt
                      </span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="mt-6">
                    <div className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-3 px-4 rounded-xl font-semibold group-hover:shadow-lg transition-all">
                      Shoutout anfragen
                      <span className="ml-2 inline-block group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>

                  {/* Hover Effect Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </div>

                {/* Corner Badge for Popular Campaigns */}
                {campaign.shoutouts_sold > 50 && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs px-2 py-1 rounded-full font-semibold shadow-md">
                    🔥 Trending
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}

        {/* Trust Indicators */}
        <div className="mt-16 text-center animate-fadeIn">
          <div className="inline-flex items-center gap-8 flex-wrap justify-center">
            <div className="flex items-center gap-2 text-gray-600">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span>100% Echt</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-5 h-5 text-blue-500" />
              <span>Schnelle Lieferung</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Star className="w-5 h-5 text-yellow-500" />
              <span>Top bewertet</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}