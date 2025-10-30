import { useEffect, useState } from "react";
import { User, Heart, Code, Sparkles, Github, Mail, MapPin } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import girinPhoto from "@/assets/Logo_GirinFix.webp"; // Path foto Girindhra
import ariqPhoto from "@/assets/Ariq.webp"
const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const creators = [
    {
      name: "Girindhra Luhpari.A",
      role: "Lead Developer & Visionary ",
      bio: "Menghadirkan solusi inovatif untuk tantangan pertanian modern. Dengan keahlian dalam coding dan integrasi AI, ia memimpin proyek MyGarden dengan kreativitas ",
      skills: ["React", "TypeScript", "AI/ML", "Cloud Architecture", "Frontend Development"],
      avatar: girinPhoto,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/50",
      borderColor: "border-blue-200 dark:border-blue-800",
      icon: Code
    },
    {
      name: "Ariq Aflaha",
      role: " Co-Founder & UI/UX Designer",
      bio: "Merancang Aplikasi Dan Mendesain Apps .",
      skills: ["UI/UX Design", "Animation", "User Research"],
      avatar: ariqPhoto,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50 dark:bg-purple-950/50",
      borderColor: "border-purple-200 dark:border-purple-800",
      icon: Sparkles
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-950 dark:via-emerald-950 dark:to-teal-950 pt-20">
      {/* Hero Section */}
      <div className={`text-center py-16 px-4 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-full px-6 py-3 mb-8 shadow-lg border border-green-200 dark:border-green-800">
            <User className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="text-green-800 dark:text-green-200 font-medium">Tentang Kami</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 dark:from-green-300 dark:to-emerald-400 bg-clip-text text-transparent mb-6 animate-pulse">
            Tentang MyGarden
          </h1>

          <p className="text-lg md:text-xl text-green-700 dark:text-green-300 max-w-2xl mx-auto leading-relaxed">
             di balik MyGarden  merevolusi pertanian melalui teknologi,
            kreativitas, dan inovasi.
          </p>

          <div className="flex justify-center gap-4 mt-8">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 animate-bounce">
              <Heart className="w-5 h-5" />
              <span className="font-medium">Gen Z Product</span>
            </div>
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 animate-bounce" style={{ animationDelay: '0.2s' }}>
              <Code className="w-5 h-5" />
              <span className="font-medium">Inovatif</span>
            </div>
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 animate-bounce" style={{ animationDelay: '0.4s' }}>
              <Sparkles className="w-5 h-5" />
              <span className="font-medium">Kreatif</span>
            </div>
          </div>
        </div>
      </div>

      {/* Creators Grid */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-2 gap-8">
          {creators.map((creator, index) => {
            const Icon = creator.icon;
            return (
              <div
                key={creator.name}
                className={`group relative ${creator.bgColor} ${creator.borderColor} border-2 rounded-2xl p-8 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:-translate-y-2 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ animationDelay: `${index * 200}ms` }}
                onMouseEnter={() => setHoveredCard(creator.name)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Animated Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${creator.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl`}></div>

                {/* Floating Particles */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-current rounded-full animate-ping opacity-20"></div>
                <div className="absolute bottom-4 left-4 w-1 h-1 bg-current rounded-full animate-ping opacity-30" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-8 w-1.5 h-1.5 bg-current rounded-full animate-ping opacity-25" style={{ animationDelay: '2s' }}></div>

                {/* Avatar */}
                <div className="flex justify-center mb-6">
                  <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${creator.color} flex items-center justify-center text-4xl shadow-lg transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12 overflow-hidden`}>
                    {creator.name === 'Ariq Aflaha' ? (
                      <img 
                        src={creator.avatar} 
                        alt={creator.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.innerHTML = '<span>🎨</span>';
                        }}
                      />
                    ) : typeof creator.avatar === 'string' && (creator.avatar.includes('/') || creator.avatar.startsWith('data:image')) ? (
                      <img src={creator.avatar} alt={creator.name} className="w-full h-full object-cover" />) : (
                      <span>{creator.avatar}</span>
                    )}
                  </div>
                </div>

                {/* Name and Role */}
                <div className="text-center mb-4">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-gray-800 group-hover:to-gray-600 dark:group-hover:from-gray-200 dark:group-hover:to-gray-400 transition-all duration-300">
                    {creator.name}
                  </h3>
                  <div className="flex items-center justify-center gap-2">
                    <Icon className="w-4 h-4 text-current" />
                    <p className="text-green-600 dark:text-green-400 font-medium">{creator.role}</p>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-gray-600 dark:text-gray-400 text-center leading-relaxed mb-6 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                  {creator.bio}
                </p>

                {/* Skills */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 text-center">Keahlian</h4>
                  <div className="flex flex-wrap justify-center gap-2">
                    {creator.skills.map((skill, skillIndex) => (
                      <span
                        key={skill}
                        className={`px-3 py-1 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700 dark:text-gray-300 border border-current/20 transition-all duration-300 hover:scale-110 hover:shadow-md ${
                          hoveredCard === creator.name ? 'animate-pulse' : ''
                        }`}
                        style={{ animationDelay: `${skillIndex * 100}ms` }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Contact Links */}
                <div className="flex justify-center gap-4">
                  <button className="p-2 rounded-full bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 hover:scale-110 hover:shadow-lg group">
                    <Github className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-current transition-colors" />
                  </button>
                  <button className="p-2 rounded-full bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 hover:scale-110 hover:shadow-lg group">
                    <Mail className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-current transition-colors" />
                  </button>
                  <button className="p-2 rounded-full bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 hover:scale-110 hover:shadow-lg group">
                    <MapPin className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-current transition-colors" />
                  </button>
                </div>

                {/* Hover Effect Border */}
                <div className={`absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-current transition-all duration-300 ${hoveredCard === creator.name ? 'animate-pulse' : ''}`}></div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mission Section */}
      <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-lg py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-200 mb-8">
            Misi Kami
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
           Membantu petani dan komunitas pertanian pakai teknologi supaya pertanian lebih mudah, hemat, dan menguntungkan buat semua orang.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {[
              { icon: Heart, title: "Keberlanjutan", desc: "Mendorong praktik pertanian ramah lingkungan" },
              { icon: Code, title: "Inovasi", desc: "Memanfaatkan AI dan teknologi untuk hasil yang lebih baik" },
              { icon: Sparkles, title: "Komunitas", desc: "Membangun jaringan pertanian yang mendukung" }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          @keyframes glow {
            0%, 100% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.3); }
            50% { box-shadow: 0 0 30px rgba(34, 197, 94, 0.6); }
          }
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
          .animate-glow {
            animation: glow 2s ease-in-out infinite;
          }
        `
      }} />
      </main>
      <Footer />
    </div>
  );
};

export default About;
