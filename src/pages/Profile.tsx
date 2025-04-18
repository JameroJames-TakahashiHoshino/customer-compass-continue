import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { Loader2, Upload, Trash } from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUser(user);
          setEmail(user.email || "");
          setName(user.user_metadata?.name || "");
          setAvatarUrl(user.user_metadata?.avatar_url || null);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File size must be less than 2MB");
        return;
      }
      setAvatarFile(file);
      // Create a preview URL
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatarUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadAvatar = async () => {
    if (!avatarFile || !user) return null;
    
    setUploading(true);
    try {
      const fileExt = avatarFile.name.split('.').pop();
      const filePath = `avatars/${user.id}.${fileExt}`;

      // Upload the file to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(filePath, avatarFile, {
          upsert: true,
          contentType: avatarFile.type
        });

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (error: any) {
      toast.error(`Error uploading avatar: ${error.message}`);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) return;
    
    setUpdating(true);
    try {
      let newAvatarUrl = avatarUrl;
      
      if (avatarFile) {
        const uploadedUrl = await uploadAvatar();
        if (uploadedUrl) {
          newAvatarUrl = uploadedUrl;
        }
      }

      const updates = {
        data: { 
          name,
          avatar_url: newAvatarUrl
        }
      };

      const { error, data } = await supabase.auth.updateUser(updates);

      if (error) throw error;
      
      // Update local user state with new data
      if (data.user) {
        setUser(data.user);
        setName(data.user.user_metadata?.name || "");
        setAvatarUrl(data.user.user_metadata?.avatar_url || null);
      }
      
      toast.success("Profile updated successfully");
      setAvatarFile(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteAvatar = async () => {
    if (!user) return;
    
    setUpdating(true);
    try {
      // If there's an existing avatar URL, extract the file path
      if (avatarUrl && avatarUrl.includes('avatars/')) {
        const urlParts = avatarUrl.split('/');
        const fileName = urlParts[urlParts.length - 1];
        const filePath = `avatars/${fileName}`;
        
        // Delete the file from storage
        const { error } = await supabase.storage
          .from('avatars')
          .remove([filePath]);
          
        if (error) throw error;
      }

      // Update user metadata to remove avatar_url
      const { error, data } = await supabase.auth.updateUser({
        data: { 
          name,
          avatar_url: null
        }
      });

      if (error) throw error;
      
      // Update local state
      if (data.user) {
        setUser(data.user);
        setAvatarUrl(null);
      }
      
      toast.success("Profile photo deleted successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete profile photo");
    } finally {
      setUpdating(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-3.5rem)]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={avatarUrl || "/placeholder.svg"} alt="Profile" />
                  <AvatarFallback>{name.charAt(0) || email.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="absolute bottom-0 right-0 flex gap-1">
                  <Label htmlFor="avatar-upload" className="cursor-pointer">
                    <div className="bg-primary text-primary-foreground p-1 rounded-full hover:bg-primary/90 transition-colors">
                      <Upload className="h-4 w-4" />
                    </div>
                    <Input 
                      id="avatar-upload" 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange} 
                      className="hidden"
                    />
                  </Label>
                  {avatarUrl && (
                    <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon" className="h-6 w-6 rounded-full p-1">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Profile Photo</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete your profile photo? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDeleteAvatar}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </div>
              <div>
                <CardTitle>{name || "User"}</CardTitle>
                <CardDescription>{email}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={email}
                readOnly
                placeholder="Your email"
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">Email cannot be changed. Contact support for assistance.</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleUpdateProfile} 
              disabled={updating || uploading}
              className="ml-auto"
            >
              {(updating || uploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
