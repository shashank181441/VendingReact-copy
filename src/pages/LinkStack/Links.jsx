import React from 'react';

import Logo from "../../assets/AOLogo.png";
// import LinksIcon from './images/Links.svg'; // Adjust the path as necessary
import githubIcon from './images/icons/github.svg';
import websiteIcon from './images/icons/generic-website.svg'
import facebookIcon from './images/icons/facebook.svg';
import instagramIcon from './images/icons/instagram.svg';
import tiktokIcon from './images/icons/tiktok.svg';
import xIcon from './images/icons/x.svg';
import linkedinIcon from './images/icons/linkedin.svg';
import youtubeIcon from './images/icons/youtube.svg';
import emailIcon from './images/icons/generic-email.svg';
import whatsappIcon from './images/icons/whatsapp.svg';
import telegramIcon from './images/icons/telegram.svg';
import messengerIcon from './images/icons/messenger.svg';
import blogIcon from './images/icons/generic-blog.svg';
import phoneIcon from './images/icons/generic-phone.svg';

const buttons = [
  // {
  //   name: 'GitHub',
  //   url: '#',
  //   icon: githubIcon,
  //   color: 'bg-black hover:bg-gray-800 text-gray-100',
  // },
  {
    name: 'Website',
    url: 'https://aonepal.com',
    icon: websiteIcon,
    color: 'bg-orange-600 hover:bg-orange-500 text-gray-100',
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/alphaomegaengsol',
    icon: linkedinIcon,
    color: 'bg-blue-700 hover:bg-blue-600 text-gray-100',
  },
  {
    name: 'Find Facebook',
    url: 'https://www.facebook.com/alphaomegaengsol',
    icon: facebookIcon,
    color: 'bg-blue-600 hover:bg-blue-500 text-gray-100',
  },
  {
    name: 'TikTok',
    url: 'https://www.tiktok.com/alphaomegaengsol',
    icon: tiktokIcon,
    color: 'bg-black hover:bg-gray-800 text-gray-100',
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/alphaomegaengsol/',
    icon: instagramIcon,
    color: 'bg-pink-500 hover:bg-pink-400 text-gray-100',
  },
  {
    name: 'YouTube',
    url: 'https://www.youtube.com/@alphaomegaengsol',
    icon: youtubeIcon,
    color: 'bg-red-600 hover:bg-red-500 text-gray-100',
  },
  {
    name: 'Follow on X',
    url: 'https://x.com/alphaomegaengsl',
    icon: xIcon,
    color: 'bg-gray-950 hover:bg-gray-800 text-gray-100',
  },
  {
    name: 'WhatsApp',
    url: '#',
    icon: whatsappIcon,
    color: 'bg-green-500 hover:bg-green-400 text-gray-100',
  },
  {
    name: 'Telegram',
    url: '#',
    icon: telegramIcon,
    color: 'bg-blue-500 hover:bg-blue-400 text-gray-100',
  },
  {
    name: 'Chat on Messenger',
    url: '#',
    icon: messengerIcon,
    color: 'bg-blue-600 hover:bg-blue-500 text-gray-100',
  },
  {
    name: 'Email Us',
    url: 'mailto:alphaomegaengsol@gmail.com',
    icon: emailIcon,
    color: 'bg-orange-600 hover:bg-orange-500 text-gray-200',
  },
  {
    name: 'Call Us',
    url: '#',
    icon: phoneIcon,
    color: 'bg-orange-600 hover:bg-orange-500 text-gray-200',
  },
  {
    name: 'Read our blog',
    url: '#',
    icon: blogIcon,
    color: 'bg-orange-600 hover:bg-orange-500 text-gray-200',
  },
];

const Links = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#0E1123] to-[#0a0457]">
      <div className="max-w-4xl w-full bg-white rounded-lg p-6 text-center bg-gradient-to-b from-[#0E1123] to-[#0a0457] mt-24">
        {/* Logo */}
        <img src={Logo} className="w-28 mx-auto rounded-full" alt="Links Logo" />

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-100 mt-4">Alpha Omega Engineering Solutions Pvt. Ltd.</h1>
        <p className="text-gray-100 mt-2 mb-12">From concept to creation.</p>

        {/* Buttons Section */}
        <div className="mt-6 space-y-4 ">
          {buttons.map((button, index) => (
            <a
              key={index}
              className={`flex items-center mx-auto justify-center max-w-sm px-4 py-3 font-semibold rounded ${button.color}`}
              href={button.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={button.icon} className="w-5 h-5 mr-2" alt={`${button.name} Icon`} />
              {button.name}
            </a>
          ))}
        </div>

        {/* Footer */}
        <p className="text-gray-400 text-sm mt-6">
          <a href="privacy.html" className="hover:underline">
            Privacy Policy
          </a>{" "}
          | Build your own by forking{" "}
          <a href="https://Links.io" target="_blank" rel="noopener noreferrer" className="hover:underline">
            Links
          </a>.
        </p>
      </div>
    </div>
  );
};

export default Links;
