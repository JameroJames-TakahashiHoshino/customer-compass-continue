
// Since this is a read-only file, we'll need to create a new component to display the user avatar in the header
// We'll create a new NavbarAvatar component and use it in the existing Navbar

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";

export const NavbarAvatar = () => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [initials, setInitials] = useState("");

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Get avatar URL from user metadata
          const avatarUrl = user.user_metadata?.avatar_url || null;
          setAvatarUrl(avatarUrl);
          
          // Set initials based on name or email
          const name = user.user_metadata?.name || "";
          const email = user.email || "";
          
          if (name) {
            setInitials(name.charAt(0).toUpperCase());
          } else if (email) {
            setInitials(email.charAt(0).toUpperCase());
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    getUserProfile();
    
    // Listen for changes to the user's profile
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const user = session.user;
        const avatarUrl = user.user_metadata?.avatar_url || null;
        setAvatarUrl(avatarUrl);
        
        const name = user.user_metadata?.name || "";
        const email = user.email || "";
        
        if (name) {
          setInitials(name.charAt(0).toUpperCase());
        } else if (email) {
          setInitials(email.charAt(0).toUpperCase());
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <Avatar className="h-8 w-8">
      <AvatarImage src={avatarUrl || "/placeholder.svg"} alt="Profile" />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
};
