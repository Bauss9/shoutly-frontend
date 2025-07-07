// ================================
// LandingClient.tsx - The Client Component
// ================================

'use client';

import { Download, Apple, Play, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

interface ServerData {
  totalCreators: number;
  totalShoutouts: number;
  averageRating: number;
}

export default function LandingClient({ serverData }: { serverData: ServerData }) {
  return (
    <div className="h-screen overflow-hidden relative bg-black">
      {/* Background Video */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-60"
      >
        <source src="/6332246-uhd_4096_2160_25fps.mp4" type="video/mp4" />
      </video>

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between p-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="font-bold text-black">S</span>
          </div>
          <span className="font-semibold text-white">Shoutout</span>
        </div>
        <button className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
          Download
        </button>
      </nav>

      {/* Hero Content */}
      <div className="relative z-40 h-full flex items-center justify-center px-6 -mt-16">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div className="text-white space-y-6">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1 text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Now Available</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              Connect with your
              <span className="block text-blue-400">favorite creators</span>
            </h1>
            
            <p className="text-xl text-gray-300 leading-relaxed max-w-lg">
              Get personalized video messages from creators you love. 
              Perfect for birthdays, celebrations, or just because.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="group bg-white text-black px-6 py-4 rounded-xl font-semibold flex items-center justify-center space-x-3 hover:bg-gray-100 transition-all">
                <Apple className="w-5 h-5" />
                <div className="text-left">
                  <div className="text-xs text-gray-600">Download on the</div>
                  <div className="font-bold">App Store</div>
                </div>
              </button>
              
              <button className="group bg-white text-black px-6 py-4 rounded-xl font-semibold flex items-center justify-center space-x-3 hover:bg-gray-100 transition-all">
                <Play className="w-5 h-5" />
                <div className="text-left">
                  <div className="text-xs text-gray-600">Get it on</div>
                  <div className="font-bold">Google Play</div>
                </div>
              </button>
            </div>

            <div className="flex items-center space-x-8 pt-6 text-sm">
              <div>
                <div className="font-bold text-2xl">{serverData.totalCreators}+</div>
                <div className="text-gray-400">Creators</div>
              </div>
              <div>
                <div className="font-bold text-2xl">{serverData.totalShoutouts.toLocaleString()}+</div>
                <div className="text-gray-400">Videos Created</div>
              </div>
              <div>
                <div className="font-bold text-2xl">{serverData.averageRating}★</div>
                <div className="text-gray-400">Average Rating</div>
              </div>
            </div>
          </div>

          {/* Right Content - Phone */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              {/* Phone Frame */}
              <div className="w-72 h-[580px] bg-gray-900 rounded-[3rem] p-2 shadow-2xl border border-gray-700">
                <div className="w-full h-full bg-black rounded-[2.5rem] overflow-hidden relative">
                  
                  {/* Phone Screen */}
                  <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black flex flex-col">
                    
                    {/* Status Bar */}
                    <div className="flex justify-between items-center p-4 pt-8 text-white text-sm">
                      <span>9:41</span>
                      <div className="flex space-x-1">
                        <div className="w-4 h-2 border border-white rounded-sm"></div>
                        <div className="w-6 h-2 bg-white rounded-sm"></div>
                      </div>
                    </div>

                    {/* App Content */}
                    <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mb-4">
                        <span className="text-white font-bold text-xl">S</span>
                      </div>
                      <h3 className="text-white font-bold text-lg mb-2">Shoutout</h3>
                      <p className="text-gray-400 text-sm mb-6">Connect with creators</p>
                      
                      <div className="space-y-3 w-full">
                        <div className="bg-gray-800 rounded-xl p-4 text-left">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
                            <div>
                              <div className="text-white text-sm font-medium">@creator</div>
                              <div className="text-gray-400 text-xs">Available now</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-gray-800 rounded-xl p-4 text-left">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-purple-500 rounded-full"></div>
                            <div>
                              <div className="text-white text-sm font-medium">@artist</div>
                              <div className="text-gray-400 text-xs">Online</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Home Indicator */}
                    <div className="flex justify-center pb-2">
                      <div className="w-32 h-1 bg-white/30 rounded-full"></div>
                    </div>
                  </div>

                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-6 bg-black rounded-b-2xl"></div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-blue-500/20 backdrop-blur-sm rounded-xl border border-blue-400/30"></div>
              <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-purple-500/20 backdrop-blur-sm rounded-xl border border-purple-400/30"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}