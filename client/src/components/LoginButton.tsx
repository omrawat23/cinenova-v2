import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { FaGoogle } from "react-icons/fa"
import { auth, googleProvider } from "@/config/firebase"
import { signInWithPopup } from "firebase/auth"
import { useAuth } from "@/contexts/AuthContext"
import { useState } from "react"

export function LoginDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { login, isAuthenticated } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const signInWithGoogle = async () => {
    if (isAuthenticated) {
      console.log("User is already logged in");
      onOpenChange(false); // Close the dialog
      return;
    }

    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const userData = {
        uuid: user.uid,
        username: user.displayName || "Unknown",
        email: user.email || "No email",
        imageUrl: user.photoURL || "/default-avatar.png",
      };

      // Use the login method from AuthContext
      login(userData);

      // Close the dialog
      onOpenChange(false);

      // Reload the page to reflect authentication state
      window.location.reload();
    } catch (err) {
      console.error("Google Sign-In Error:", err);
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-[#1C1E26]/25 backdrop-blur-xl border-gray-800/50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-white text-center">Welcome</DialogTitle>
          <DialogDescription className="text-center">
            Connect your Google account to access your personalized experience.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <Button
            onClick={signInWithGoogle}
            disabled={isLoading}
            className="transition duration-300 ease-in-out hover:scale-105"
          >
            {isLoading ? "Signing in..." : (
              <>
                <FaGoogle className="mr-2 h-4 w-4" />
                Sign in with Google
              </>
            )}
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            By connecting, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}