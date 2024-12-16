import { Facebook, Github, Globe, Instagram, Linkedin, Mail, MessageCircle, Send, Share, Share2, Twitter, Youtube } from 'lucide-react';
import React from 'react';
import Logo from "../../assets/AOLogo.png";

// Reusable SocialLink Component
function SocialLink({ icon: Icon, text, link, bgColor }) {
  return (
    <a
      href={link}
      className={`${bgColor} hover:opacity-80 text-white py-3 px-6 rounded-lg flex items-center justify-center`}
    >
      <Icon className="mr-2" /> {text}
    </a>
  );
}

export default function Links() {
  // Define the social links in an array of objects
  const socialLinks = [
    {
      icon: Globe,
      text: 'Website',
      link: 'https://www.vendingao.com',
      bgColor: 'bg-orange-600'
    },
    {
      icon: Facebook,
      text: 'Facebook',
      link: '#',
      bgColor: 'bg-blue-600'
    },
    {
      icon: Instagram,
      text: 'Instagram',
      link: '#',
      bgColor: 'bg-[#E4405F]'
    },
    {
      icon: Facebook,
      text: 'Tiktok',
      link: '#',
      bgColor: 'bg-[#1877F2]'
    },
    {
      icon: Twitter,
      text: 'Twitter',
      link: '#',
      bgColor: 'bg-[#1DA1F2]'
    },
    {
      icon: Linkedin,
      text: 'LinkenIn',
      link: '#',
      bgColor: 'bg-[#0A66C2]'
    },
    {
      icon: Youtube,
      text: 'Youtube',
      link: '#',
      bgColor: 'bg-[#CD201F]'
    },
    {
      icon: Github,
      text: 'GitHub',
      link: '#',
      bgColor: 'bg-gray-900'
    },
    {
      icon: Mail,
      text: 'E-Mail',
      link: 'mailto:example@example.com',
      bgColor: 'bg-blue-500'
    },
    {
      icon: MessageCircle,
      text: 'WhatsApp',
      link: '#',
      bgColor: 'bg-[#25D366]'
    },
    {
      icon: Send,
      text: 'Telegram',
      link: '#',
      bgColor: 'bg-cyan-500'
    },
  ];

  return (
    <div className="relative bg-gradient-to-r from-[#0E1123] to-[#000000] min-h-screen flex flex-col items-center justify-center text-white">
  {/* Background with light source effect */}
  <div className="absolute inset-0 bg-gradient-to-b from-[#0E1123] to-[#0a0457]">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_circle,_#ffffff33,_transparent)]"></div>
  </div>

  {/* Share Button (Top Right) */}
  <div className="absolute top-4 right-4 z-10">
    <button className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-full md:flex items-center space-x-2 hidden">
      <Share2 />
      <span>Share</span>
    </button>
    {/* Icon Only on Small Screens */}
    <button className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-full flex items-center justify-center md:hidden">
      <Share2 />
    </button>
  </div>

  {/* Links Image */}
  <div className="z-10 w-24 h-24 rounded-full overflow-hidden mt-32">
    <img
      src={Logo} // Replace with actual Links image URL
      alt="Links"
      className="w-full h-full object-cover"
    />
  </div>

  {/* Name and Bio */}
  <div className='flex'>
  <h1 className="text-2xl font-bold mt-4 z-10 flex"> <p className='mr-2'>Alpha Omega Eng. Sol. </p>
  <span className="text-blue-500">
    <img src="https://img.icons8.com/?size=100&id=2sZ0sdlG9kWP&format=png&color=000000" alt="tick" className='w-6 h-6'/>  
    </span></h1>
    </div>
  <p className="text-gray-400 mt-2 z-10">Here's where to find me online</p>

  {/* Social Links - Loop through the socialLinks array */}
  <div className="mt-8 space-y-4 w-full max-w-xs z-10">
    {socialLinks.map((link, index) => (
      <SocialLink
        key={index}
        icon={link.icon}
        text={link.text}
        link={link.link}
        bgColor={link.bgColor}
      />
    ))}
  </div>
  <h1>hellob</h1><br />
  <h1>hellob</h1><br />
      <h1 className='text-red-400 bg-green-50'>@AlphaOmega2024</h1>
</div>

  );
}
