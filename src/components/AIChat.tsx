import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, Send, User } from "lucide-react";
import { useState } from "react";

const AIChat = () => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Selamat datang di Tani Cerdas! 🌾 Saya asisten AI Anda yang siap membantu dengan pertanyaan seputar pertanian. Silakan tanyakan tentang harga pasar, prakiraan cuaca, tips bercocok tanam, atau apa saja!"
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const exampleQuestions = [
    "Kapan waktu tanam jagung yang ideal di Bogor?",
    "Bagaimana cara mengatasi hama wereng pada padi?",
    "Apakah harga cabai akan naik bulan depan?",
    "Jelaskan strategi diversifikasi 4 komoditas"
  ];

  const handleSend = () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const newMessages = [
      ...messages,
      { role: "user", content: inputMessage }
    ];
    setMessages(newMessages);
    setInputMessage("");

    // Simulate AI response
    setTimeout(() => {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "Terima kasih atas pertanyaan Anda! Untuk mengaktifkan fitur AI chat yang lengkap, aplikasi perlu terhubung ke Lovable Cloud. Fitur ini akan segera tersedia dan akan memberikan rekomendasi pertanian yang personal berdasarkan data real-time harga, cuaca, dan best practices dari petani sukses."
        }
      ]);
    }, 1000);
  };

  return (
    <section id="chat" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Chat dengan AI Tani Cerdas
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Konsultasi 24/7 dengan asisten AI yang memahami kebutuhan pertanian Anda
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="shadow-xl">
            <CardHeader className="border-b">
              <div className="flex items-center gap-3">
                <div className="bg-primary p-2 rounded-full">
                  <Bot className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle>Tani Cerdas AI</CardTitle>
                  <CardDescription>Asisten pertanian cerdas Anda</CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              <ScrollArea className="h-[400px] p-6">
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex gap-3 ${
                        message.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      {message.role === "assistant" && (
                        <Avatar className="bg-primary">
                          <AvatarFallback>
                            <Bot className="w-5 h-5 text-primary-foreground" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`max-w-[80%] rounded-lg p-4 ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{message.content}</p>
                      </div>
                      {message.role === "user" && (
                        <Avatar className="bg-secondary">
                          <AvatarFallback>
                            <User className="w-5 h-5 text-secondary-foreground" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Example Questions */}
              <div className="border-t p-4 bg-muted/30">
                <p className="text-sm font-medium text-muted-foreground mb-3">
                  Contoh Pertanyaan:
                </p>
                <div className="flex flex-wrap gap-2">
                  {exampleQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs h-auto py-2"
                      onClick={() => setInputMessage(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Input */}
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Tanyakan sesuatu tentang pertanian..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                    className="flex-1"
                  />
                  <Button onClick={handleSend} size="icon">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AIChat;