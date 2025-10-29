import { Menu, X, Leaf, Sprout, Sun, Newspaper, MessageCircle, Search, Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Auth from "./Auth";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    // Initial check
    handleResize();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && !(event.target as Element).closest('nav')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const navItems = [
    { label: "Beranda", href: "/", icon: Leaf },
    { label: "Harga Pasar", href: "/market", icon: Sprout },
    { label: "Cuaca", href: "/weather", icon: Sun },
    { label: "Berita", href: "/news", icon: Newspaper },
    { label: "Chat AI", href: "/chat", icon: MessageCircle },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled
        ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-xl border-b border-green-200/50 dark:border-green-800/50'
        : 'bg-gradient-to-r from-green-50/90 to-emerald-50/90 dark:from-green-950/90 dark:to-emerald-950/90 backdrop-blur-md border-b border-green-200 dark:border-green-800 shadow-lg'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group animate-fade-in">
            <div className="relative">
              <img
                src="/MyGardenLogo.webp"
                alt="MyGarden Logo"
                className="h-8 sm:h-10 lg:h-12 w-auto transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
              />
              <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
              <div className="absolute inset-0 bg-green-400/20 rounded-full scale-0 group-hover:scale-150 transition-transform duration-500"></div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg sm:text-xl lg:text-2xl text-green-800 dark:text-green-200 bg-gradient-to-r from-green-700 to-emerald-600 dark:from-green-300 dark:to-emerald-400 bg-clip-text text-transparent group-hover:from-green-600 group-hover:to-emerald-500 transition-all duration-300">
                MyGarden
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-medium group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors duration-300 hidden sm:block">
                Smart Agriculture
              </span>
            </div>
          </Link>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2 lg:gap-4">
            {/* Search Bar */}
            <div className="relative">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors group"
                aria-label="Toggle search"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-green-700 dark:text-green-300 group-hover:scale-110 transition-transform" />
              </button>
              {showSearch && (
                <div className="absolute top-full mt-2 right-0 w-64 sm:w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-green-200 dark:border-green-700 p-3 sm:p-4 animate-slide-down">
                  <input
                    type="text"
                    placeholder="Cari fitur atau informasi..."
                    className="w-full px-3 py-2 text-sm sm:text-base border border-green-300 dark:border-green-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <button className="p-2 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors relative group">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-green-700 dark:text-green-300 group-hover:scale-110 transition-transform" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-bounce"></span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                    isActive
                      ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 shadow-md shadow-green-500/20"
                      : "text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/50 hover:text-green-800 dark:hover:text-green-200 hover:shadow-lg hover:shadow-green-500/10"
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="w-4 h-4 transition-transform group-hover:rotate-12" />
                  <span className="hidden xl:inline">{item.label}</span>
                </Link>
              );
            })}
            <div className="ml-2 lg:ml-4">
              <Auth />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/50 transition-all duration-200 hover:scale-110"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-green-700 dark:text-green-300 animate-spin-once" />
            ) : (
              <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-green-700 dark:text-green-300" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/50 backdrop-blur-sm rounded-b-lg animate-slide-down">
            <div className="flex flex-col gap-2">
              {/* Mobile Search */}
              <div className="px-4 mb-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-600 dark:text-green-400" />
                  <input
                    type="text"
                    placeholder="Cari fitur atau informasi..."
                    className="w-full pl-10 pr-4 py-2 border border-green-300 dark:border-green-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white text-sm"
                  />
                </div>
              </div>



              {navItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                      isActive
                        ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 shadow-md"
                        : "text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/50 hover:text-green-800 dark:hover:text-green-200"
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className="w-5 h-5 transition-transform hover:rotate-12" />
                    {item.label}
                  </Link>
                );
              })}
              <div className="mt-2 px-4">
                <Auth />
              </div>
            </div>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes slide-down {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes spin-once {
            from { transform: rotate(0deg); }
            to { transform: rotate(180deg); }
          }
          .animate-fade-in {
            animation: fade-in 0.5s ease-out;
          }
          .animate-slide-down {
            animation: slide-down 0.3s ease-out;
          }
          .animate-spin-once {
            animation: spin-once 0.3s ease-in-out;
          }

          @media (max-width: 640px) {
            .animate-fade-in {
              animation: none;
            }
          }
        `
      }} />
    </nav>
  );
};

export default Navigation;
