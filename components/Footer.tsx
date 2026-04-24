'use client';

import { Github, Linkedin, Mail, ExternalLink } from 'lucide-react';
import { useState } from 'react';

interface SocialLink {
  icon: React.ReactNode;
  label: string;
  url: string;
  color: string;
}

export default function Footer() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const socialLinks: SocialLink[] = [
    {
      icon: <Github className="w-6 h-6" />,
      label: 'GitHub',
      url: 'https://github.com/Sahar-SE',
      color: 'from-gray-600 to-gray-900',
    },
    {
      icon: <Linkedin className="w-6 h-6" />,
      label: 'LinkedIn',
      url: 'https://www.linkedin.com/in/sahar-saba-amiri/',
      color: 'from-blue-500 to-blue-700',
    },
    {
      icon: <Mail className="w-6 h-6" />,
      label: 'Email',
      url: 'saharsaba.amiri123@gmail.com',
      color: 'from-red-500 to-red-700',
    },
  ];

  const portfolioLinks = [
    {
      label: 'Graphic Design',
      url: '/posters',
      delay: 0,
    },
    {
      label: 'Motion Graphics',
      url: '/motion-graphics',
      delay: 1,
    },
    {
      label: 'Video Editing',
      url: '/video-editing',
      delay: 2,
    },
  ];

  return (
    <footer className="relative bg-gradient-to-t from-ink via-ink/95 to-transparent pt-20 pb-8 px-4 sm:px-8 lg:px-12 border-t border-gold/10">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-teal/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Portfolio Links Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-display font-bold text-gold uppercase tracking-widest">
              Portfolio
            </h3>
            <nav className="space-y-3">
              {portfolioLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  className="group flex items-center gap-2 text-paper/70 hover:text-gold transition-colors duration-300 text-sm"
                  style={{
                    animationDelay: `${link.delay * 50}ms`,
                  }}
                >
                  <span className="inline-block w-0 h-0.5 bg-gold group-hover:w-4 transition-all duration-300"></span>
                  <span>{link.label}</span>
                </a>
              ))}
            </nav>
          </div>

          {/* Social Links Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-display font-bold text-gold uppercase tracking-widest mb-10">
              Connect
            </h3>
            <div className="flex gap-6 mt-6">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  aria-label={link.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="relative group"
                >
                  {/* Glowing background */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${link.color} rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-110`}
                  ></div>

                  {/* Icon container */}
                  <div className="relative bg-ink/50 backdrop-blur-sm rounded-lg p-3 border border-gold/20 group-hover:border-gold/60 transition-all duration-300 transform group-hover:scale-110 group-hover:-translate-y-1">
                    <div className={`text-paper transition-all duration-300 ${hoveredIndex === index ? 'animate-bounce' : ''}`}>
                      {link.icon}
                    </div>
                  </div>

                  {/* Tooltip */}
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1.5 bg-gold text-ink text-xs font-semibold rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
                    {link.label}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* About/Brand Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-display font-bold text-gold uppercase tracking-widest">
              About
            </h3>
            <p className="text-paper/60 text-sm leading-relaxed">
              Creative designer & developer specializing in visual storytelling through
              graphic design, motion graphics, and video editing.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent mb-8"></div>

        {/* Bottom section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-paper/50 text-xs">
          <p>© {new Date().getFullYear()} All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Build a beautiful life</span>
            <span className="text-gold animate-pulse">✦</span>
            <span>Make a beautiful world!</span>
          </div>
        </div>
      </div>

      {/* Custom animation for social icons */}
      <style>{`
        @keyframes float-up {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 10px rgba(201, 168, 76, 0.3); }
          50% { box-shadow: 0 0 20px rgba(201, 168, 76, 0.6); }
        }
        
        .animate-float-up {
          animation: float-up 3s ease-in-out infinite;
        }
        
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }

        .delay-1000 {
          animation-delay: 1000ms;
        }
      `}</style>
    </footer>
  );
}
