import { Link } from 'react-router-dom';
import { CalendarRange, Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
     <footer className="mt-auto bg-[var(--color-footer-bg)] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
           {/* Brand Section */}
          <div className="flex flex-col gap-3 ml-0 md:ml-24">
            <Link to="/" className="text-xl font-bold flex items-center gap-2">
              <CalendarRange className="text-white" size={24} />
              <span className="text-white">
                Quick<span className="text-gradient">Reserve</span>
              </span>
            </Link>
            <p className="text-white/60 text-sm max-w-xs leading-relaxed">
              Premium service management platform for modern businesses. Book, manage, and grow with ease.
            </p>
            <div className="flex items-center gap-2 text-white/50 text-sm mt-2">
              <MapPin size={16} />
              <span>Colombo, Sri Lanka</span>
            </div>
            <div className="flex items-center gap-2 text-white/50 text-sm">
              <Clock size={16} />
              <span>Mon - Fri: 9:00 AM - 6:00 PM</span>
            </div>
          </div>

           {/* Quick Links */}
          <div className="flex flex-col gap-3 ml-0 md:ml-24">
            <h3 className="text-white/80 font-semibold text-sm uppercase tracking-wider">Quick Links</h3>
            <div className="flex flex-col gap-2.5">
              <Link to="/services" className="text-white/60 hover:text-white transition text-sm hover:translate-x-1 transform duration-200">
                Services
              </Link>
              <Link to="/bookings" className="text-white/60 hover:text-white transition text-sm hover:translate-x-1 transform duration-200">
                Bookings
              </Link>
             
            </div>
          </div>

          {/* Contact Section */}
          <div className="flex flex-col gap-3">
            <h3 className="text-white/80 font-semibold text-sm uppercase tracking-wider">Get in Touch</h3>
            <div className="flex flex-col gap-3">
              <a 
                href="mailto:support@quickreserve.com" 
                className="flex items-center gap-3 text-white/60 hover:text-white transition text-sm group"
              >
                <div className="p-1.5 bg-white/5 rounded-lg group-hover:bg-white/10 transition">
                  <Mail size={16} className="group-hover:scale-110 transition" />
                </div>
                support@quickreserve.com
              </a>
              <a 
                href="tel:+94123456789" 
                className="flex items-center gap-3 text-white/60 hover:text-white transition text-sm group"
              >
                <div className="p-1.5 bg-white/5 rounded-lg group-hover:bg-white/10 transition">
                  <Phone size={16} className="group-hover:scale-110 transition" />
                </div>
                +94 11 234 5678
              </a>
              <div className="flex items-center gap-3 text-white/60 text-sm mt-1">
                <div className="p-1.5 bg-white/5 rounded-lg">
                  <MapPin size={16} />
                </div>
                <span>No. 123, Galle Road, Colombo 03</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-sm">
            © {currentYear} QuickReserve. All rights reserved.
          </p>
          
        </div>
      </div>
    </footer>
  );
}