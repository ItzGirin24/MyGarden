import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, Send, User as UserIcon, Loader2, RotateCcw } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { getAIResponse } from "@/lib/gemini";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

const AIChat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const { toast } = useToast();
  const scrollAreaRef = useRef(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  // Load chat history on mount and when user changes
  useEffect(() => {
    loadChatHistory();
  }, [currentUser]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const loadChatHistory = async () => {
    try {
      setIsLoadingHistory(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
          setMessages(data.map(msg => ({ role: msg.role, content: msg.content })));
        } else {
          // Default welcome message
          setMessages([{
            role: "assistant",
            content: "Selamat datang di Tani Cerdas! 🌾 Saya asisten AI Anda yang siap membantu dengan pertanyaan seputar pertanian. Silakan tanyakan tentang harga pasar, prakiraan cuaca, tips bercocok tanam, atau apa saja!"
          }]);
        }
      } else {
        // Default welcome message for unauthenticated users
        setMessages([{
          role: "assistant",
          content: "Selamat datang di Tani Cerdas! 🌾 Saya asisten AI Anda yang siap membantu dengan pertanyaan seputar pertanian. Silakan tanyakan tentang harga pasar, prakiraan cuaca, tips bercocok tanam, atau apa saja!"
        }]);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      toast({
        title: "Error",
        description: "Failed to load chat history",
        variant: "destructive",
      });
      // Set default message on error
      setMessages([{
        role: "assistant",
        content: "Selamat datang di Tani Cerdas! 🌾 Saya asisten AI Anda yang siap membantu dengan pertanyaan seputar pertanian. Silakan tanyakan tentang harga pasar, prakiraan cuaca, tips bercocok tanam, atau apa saja!"
      }]);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const saveMessage = async (role: string, content: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase
          .from('chat_messages')
          .insert({
            role,
            content,
            user_id: user.id
          });

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  const exampleQuestions = [
    "Kapan waktu tanam jagung yang ideal di Bogor?",
    "Bagaimana cara mengatasi hama wereng pada padi?",
    "Apakah harga cabai akan naik bulan depan?",
    "Jelaskan strategi diversifikasi 4 komoditas"
  ];

  const resetChat = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase
          .from('chat_messages')
          .delete()
          .eq('user_id', user.id);

        if (error) throw error;
      }

      // Reset to default welcome message
      setMessages([{
        role: "assistant",
        content: "Selamat datang di Tani Cerdas! 🌾 Saya asisten AI Anda yang siap membantu dengan pertanyaan seputar pertanian. Silakan tanyakan tentang harga pasar, prakiraan cuaca, tips bercocok tanam, atau apa saja!"
      }]);

      toast({
        title: "Chat Reset",
        description: "Riwayat chat telah dihapus.",
      });
    } catch (error) {
      console.error('Error resetting chat:', error);
      toast({
        title: "Error",
        description: "Gagal menghapus riwayat chat.",
        variant: "destructive",
      });
    }
  };

  const handleSend = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");
    setIsLoading(true);

    // Add user message
    const newMessages = [
      ...messages,
      { role: "user", content: userMessage }
    ];
    setMessages(newMessages);

    // Save user message
    await saveMessage("user", userMessage);

    try {
      const aiResponse = await getAIResponse(userMessage);

      // Add AI response
      const messagesWithAI = [
        ...newMessages,
        { role: "assistant", content: aiResponse }
      ];
      setMessages(messagesWithAI);

      // Save AI response
      await saveMessage("assistant", aiResponse);

    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage = "Maaf, terjadi kesalahan saat memproses pertanyaan Anda. Silakan coba lagi dalam beberapa saat.";

      const messagesWithError = [
        ...newMessages,
        { role: "assistant", content: errorMessage }
      ];
      setMessages(messagesWithError);

      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-primary p-2 rounded-full">
                    <Bot className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle>Tani Cerdas AI</CardTitle>
                    <CardDescription>Asisten pertanian cerdas Anda</CardDescription>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetChat}
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset Chat
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              <ScrollArea ref={scrollAreaRef} className="h-[400px] p-6">
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
                            {currentUser?.photoURL ? (
                              <img
                                src={currentUser.photoURL}
                                alt={currentUser.displayName || "User"}
                                className="w-5 h-5 rounded-full"
                              />
                            ) : (
                              <UserIcon className="w-5 h-5 text-secondary-foreground" />
                            )}
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
                    disabled={isLoading}
                  />
                  <Button onClick={handleSend} size="icon" disabled={isLoading}>
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
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