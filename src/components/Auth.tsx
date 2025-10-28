import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

const Auth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Listen to authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setIsOpen(false);
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="flex items-center gap-2">
          {user ? (
            <>
              <img
                src={user.photoURL || ""}
                alt={user.displayName || ""}
                className="w-6 h-6 rounded-full"
              />
              Keluar
            </>
          ) : (
            "Masuk"
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {user ? `Selamat datang, ${user.displayName}!` : "Masuk ke MyGarden"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {user ? (
            <div className="flex flex-col items-center gap-4">
              <img
                src={user.photoURL || ""}
                alt={user.displayName || ""}
                className="w-16 h-16 rounded-full"
              />
              <p className="text-center">{user.email}</p>
              <Button onClick={handleSignOut} variant="outline">
                Keluar
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <Button onClick={handleGoogleSignIn} className="w-full">
                Masuk dengan Google
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Auth;
