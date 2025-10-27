import { Sprout } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-muted/50 border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-primary p-2 rounded-lg">
                <Sprout className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl text-foreground">MyGarden</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Platform pendukung petani Indonesia dengan informasi real-time dan AI cerdas.
            </p>
          </div>

          {/* Fitur */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Fitur</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#market" className="hover:text-primary transition-colors">Harga Pasar</a></li>
              <li><a href="#weather" className="hover:text-primary transition-colors">Prakiraan Cuaca</a></li>
              <li><a href="#news" className="hover:text-primary transition-colors">Berita Pertanian</a></li>
              <li><a href="#chat" className="hover:text-primary transition-colors">AI Tani Cerdas</a></li>
            </ul>
          </div>

          {/* Sumber Daya */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Sumber Daya</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Panduan Tanam</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Kisah Sukses</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Bantuan</a></li>
            </ul>
          </div>

          {/* Tentang */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Tentang Kami</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Tentang MyGarden</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Kontak</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Kebijakan Privasi</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Syarat & Ketentuan</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 MyGarden - KebunKu. Platform Pendukung Petani Indonesia.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;