import Navigation from "@/components/Navigation";
import AIChat from "@/components/AIChat";
import Footer from "@/components/Footer";

const Chat = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        <AIChat />
      </main>
      <Footer />
    </div>
  );
};

export default Chat;
