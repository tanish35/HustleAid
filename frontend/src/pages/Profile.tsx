import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/useUser";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Label } from "@radix-ui/react-label";
import {
  AlertCircle,
  Edit,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { DocumentUpload } from "@/components/DocumentUpload";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface UserDetails {
  name: string;
  email: string;
  avatar?: string;
  verified?: boolean;
  panCardImage?: string;
  aadhaarCardImage?: string;
  totalFundsReceived?: number;
  activeSchemes?: number;
  approvedApplications?: number;
  panNo?: string;
  aadhaarNo?: string;
}

interface ProfileFormData {
  name: string;
  email: string;
  panCard: File | null;
  aadhaarCard: File | null;
}

const ProfilePage = () => {
  const { loadingUser, userDetails, updateUserDetails } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState<ProfileFormData>({
    name: "",
    email: "",
    panCard: null,
    aadhaarCard: null,
  });

  useEffect(() => {
    if (userDetails) {
      setFormData({
        name: userDetails.name || "",
        email: userDetails.email || "",
        panCard: null,
        aadhaarCard: null,
      });
    }
  }, [userDetails]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateUserDetails(formData);
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateProfileCompletion = () => {
    let complete = 0;
    if (userDetails?.name) complete += 25;
    if (userDetails?.email) complete += 25;
    if (userDetails?.panCardImage) complete += 25;
    if (userDetails?.aadhaarCardImage) complete += 25;
    return complete;
  };

  if (loadingUser) {
    return (
      <div className="p-6 space-y-6 max-w-6xl mx-auto">
        {/* Skeleton loader */}
        <div className="rounded-lg border bg-card p-6 animate-pulse">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="space-y-3">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!userDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="w-full max-w-md border border-destructive/50 bg-destructive/50">
          <CardContent className="p-6 flex flex-col items-center space-y-4">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <h2 className="text-xl font-bold text-destructive-foreground">
              Profile Unavailable
            </h2>
            <p className="text-center text-destructive">
              We couldn't retrieve your profile data. Please check your
              connection and try again.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Overview Card - Left Column */}
        <Card className="lg:col-span-1 h-fit border-0 shadow-lg bg-gradient-to-br from-primary/10 via-primary/5 to-background">
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-background shadow-lg ring-2 ring-primary/20">
                  <AvatarImage
                    src={
                      userDetails?.avatar ||
                      "https://media.gq.com/photos/5798cd2dbf91805850f35df9/1:1/w_1012,h_1012,c_limit/ana-de-armas-gq-0816-02.jpg"
                    }
                    alt={userDetails?.name}
                  />
                  <AvatarFallback className="bg-primary/10">
                    {userDetails?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {userDetails?.verified && (
                  <Badge className="absolute -bottom-2 -right-2 bg-green-500/90 hover:bg-green-500">
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              <div className="text-center">
                <h2 className="text-xl font-semibold">{userDetails?.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {userDetails?.email}
                </p>
              </div>

              {/* Profile Completion */}
              <div className="w-full space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Profile Completion</span>
                  <span>{calculateProfileCompletion()}%</span>
                </div>
                <Progress
                  value={calculateProfileCompletion()}
                  className="h-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content - Right Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-primary/5">
              <CardContent className="p-4">
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">
                    Total Funds Received
                  </span>
                  <span className="text-2xl font-bold">
                    ₹{userDetails?.totalFundsReceived || 0}
                  </span>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-primary/5">
              <CardContent className="p-4">
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">
                    Active Schemes
                  </span>
                  <span className="text-2xl font-bold">
                    {userDetails?.activeSchemes || 0}
                  </span>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-primary/5">
              <CardContent className="p-4">
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">
                    Approved Applications
                  </span>
                  <span className="text-2xl font-bold">
                    {userDetails?.approvedApplications || 0}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Details Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Profile Details</CardTitle>
                <CardDescription>
                  Manage your personal information
                </CardDescription>
              </div>
              {!isEditing && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                    <DocumentUpload
                      label="PAN Card"
                      onImageUpload={(file) =>
                        setFormData((prev) => ({ ...prev, panCard: file }))
                      }
                      currentImage={userDetails.panCardImage}
                    />
                    <DocumentUpload
                      label="Aadhaar Card"
                      onImageUpload={(file) =>
                        setFormData((prev) => ({ ...prev, aadhaarCard: file }))
                      }
                      currentImage={userDetails.aadhaarCardImage}
                    />
                  </div>
                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      variant={"outline"}
                    >
                      {isSubmitting && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Save Changes
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          name: userDetails?.name || "",
                          email: userDetails?.email || "",
                          panCard: null,
                          aadhaarCard: null,
                        });
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Full Name
                    </p>
                    <p className="text-foreground">{userDetails.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Email Address
                    </p>
                    <p className="text-foreground">{userDetails.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      PAN Card
                    </p>
                    {userDetails.panCardImage ? (
                      <Badge variant="outline" className="mt-1">
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Uploaded
                      </Badge>
                    ) : (
                      <p className="text-destructive">Not Uploaded</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Aadhaar Card
                    </p>
                    {userDetails.aadhaarCardImage ? (
                      <Badge variant="outline" className="mt-1">
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Uploaded
                      </Badge>
                    ) : (
                      <p className="text-destructive">Not Uploaded</p>
                    )}
                  </div>
                  {!userDetails.panNo && !userDetails.aadhaarNo && (
                    <div className="flex items-center gap-2 text-destructive">
                      <AlertCircle className="h-4 w-4" />
                      <p className="text-sm">
                        Please complete your verification by adding PAN and
                        Aadhaar details.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Verification Status Card */}
          <Card>
            <CardHeader>
              <CardTitle>Document Verification Status</CardTitle>
              <CardDescription>Required for fund disbursement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>PAN Card Verification</span>
                  {userDetails?.panCardImage ? (
                    <Badge>
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      <XCircle className="h-4 w-4 mr-1" />
                      Not Verified
                    </Badge>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span>Aadhaar Card Verification</span>
                  {userDetails?.aadhaarCardImage ? (
                    <Badge>
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      <XCircle className="h-4 w-4 mr-1" />
                      Not Verified
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
