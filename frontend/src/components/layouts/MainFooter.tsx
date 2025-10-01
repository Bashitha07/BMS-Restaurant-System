import React from 'react';
import { Link } from 'react-router-dom';
import { PhoneIcon, MapPinIcon, MailIcon, ClockIcon, FacebookIcon, UtensilsIcon } from 'lucide-react';
export function MainFooter() {
  return <footer className="bg-gray-900 text-white pt-12 pb-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold text-indigo-400 flex items-center justify-center gap-2">
            <UtensilsIcon size={28} />
            BMS Kingdom of taste
          </Link>
          <p className="text-gray-400 mt-2">
            Delicious food delivered fast to your doorstep
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPinIcon size={18} className="mr-2 mt-1 text-indigo-400" />
                <span className="text-gray-400">
                  No 187/1/B, Hokandara 10230, Sri Lanka
                </span>
              </li>
              <li className="flex items-center">
                <PhoneIcon size={18} className="mr-2 text-indigo-400" />
                <span className="text-gray-400">+94 11 217 1944</span>
              </li>
              <li className="flex items-center">
                <MailIcon size={18} className="mr-2 text-indigo-400" />
                <span className="text-gray-400">info@bmskingdom.com</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Opening Hours</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <ClockIcon size={18} className="mr-2 mt-1 text-indigo-400" />
                <div>
                  <p className="text-gray-400">Monday - Friday</p>
                  <p className="text-gray-400">10:00 AM - 10:00 PM</p>
                </div>
              </li>
              <li className="flex items-start">
                <ClockIcon size={18} className="mr-2 mt-1 text-indigo-400" />
                <div>
                  <p className="text-gray-400">Saturday - Sunday</p>
                  <p className="text-gray-400">10:00 AM - 11:00 PM</p>
                </div>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex justify-center">
              <a href="https://www.facebook.com/share/1749XW4KBV/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white bg-gray-800 p-3 rounded-full hover:bg-indigo-500 transition-all">
                <FacebookIcon size={20} />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6">
          <p className="text-center text-gray-500">
            &copy; {new Date().getFullYear()} BMS Kingdom of taste. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>;
}