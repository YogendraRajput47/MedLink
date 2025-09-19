import React from "react";
import { assets } from "../assets/assets_frontend/assets";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-primary/90 to-primary/70 text-white mt-16">
      {/* Container */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Logo + About */}
        <div>
          <img
            src={assets.logo}
            alt="MedLink Logo"
            className="w-40 h-10 object-cover mb-4"
          />
          <p className="text-sm text-gray-100 leading-relaxed">
            Your trusted healthcare partner. Book appointments with verified
            doctors anytime, anywhere.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-gray-100 text-sm">
            <li>
              <a href="/" className="hover:text-yellow-300 transition">
                Home
              </a>
            </li>
            <li>
              <a href="/doctors" className="hover:text-yellow-300 transition">
                Doctors
              </a>
            </li>
            <li>
              <a href="/about" className="hover:text-yellow-300 transition">
                About Us
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-yellow-300 transition">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Services</h3>
          <ul className="space-y-2 text-gray-100 text-sm">
            <li>Online Consultation</li>
            <li>Specialist Doctors</li>
            <li>Health Checkups</li>
            <li>Emergency Support</li>
          </ul>
        </div>

        {/* Contact + Social */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
          <p className="text-sm text-gray-100">
            📍 54709 Willms Station Suite 350, <span className="pl-5">Washington, USA</span>
          </p>
          <p className="text-sm text-gray-100">📞 +201 213 35353 3535</p>
          <p className="pl-5 text-sm text-gray-100">✉ support@medlink.com</p>

          {/* Social Links */}
          <div className="flex gap-4 mt-4">
            <a
              href="#"
              className="p-2 bg-white/20 rounded-full hover:bg-white/40 transition"
            >
              <FaFacebookF />
            </a>
            <a
              href="#"
              className="p-2 bg-white/20 rounded-full hover:bg-white/40 transition"
            >
              <FaTwitter />
            </a>
            <a
              href="#"
              className="p-2 bg-white/20 rounded-full hover:bg-white/40 transition"
            >
              <FaInstagram />
            </a>
            <a
              href="#"
              className="p-2 bg-white/20 rounded-full hover:bg-white/40 transition"
            >
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-primary/90 text-center py-4 border-t border-white/20 text-sm">
        © {new Date().getFullYear()} MedLink. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
