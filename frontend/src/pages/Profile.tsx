import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/useUser";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/profile/StatCard";
import { VerificationProgress } from "@/components/VerificationProgress";
import { ProfileDetails } from "@/components/ProfileDetails";

interface ProfileFormData {
  name: string;
  email: string;
  panCard: File | null;
  aadhaarCard: File | null;
}

const ProfilePage = () => {
  const { loadingUser, userDetails } = useUser();
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

  const processDocuments = async (data: ProfileFormData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Randomly succeed or fail to simulate real API behavior
        if (Math.random() > 0.3) {
          resolve({
            success: true,
            message: "Documents processed successfully",
            data: {
              panNo: "XXXXX1234X",
              aadhaarNo: "XXXX-XXXX-XXXX",
            },
          });
        } else {
          reject(new Error("Failed to process documents"));
        }
      }, 2000); 
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await processDocuments(formData);
      toast({
        title: "Profile updated",
        description: "Your documents have been processed successfully.",
      });
      // Update local state with new document numbers
      if (userDetails) {
        userDetails.panNo = (result as any).data.panNo;
        userDetails.aadhaarNo = (result as any).data.aadhaarNo;
      }
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process documents. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const stats = [
    {
      label: "Total Funds Received",
      value: userDetails?.totalFundsReceived || 0,
      prefix: "₹",
    },
    {
      label: "Active Schemes",
      value: userDetails?.activeSchemes || 0,
    },
    {
      label: "Approved Applications",
      value: userDetails?.approvedApplications || 0,
    },
  ];

  const documentStatus = {
    email: {
      email: userDetails?.email || null,
      isVerified: !!userDetails?.email,
    },
    panCard: {
      imageUrl: userDetails?.panNo || null,
      isVerified: !!userDetails?.panNo,
    },
    aadhaar: {
      imageUrl: userDetails?.aadhaarNo || null,
      isVerified: !!userDetails?.aadhaarNo,
    },
  };

  const verificationItems = [
    {
      label: "Verify Email",
      isVerified: !!userDetails?.email,
    },
    {
      label: "PAN Card Verification",
      isVerified: !!userDetails?.panNo,
    },
    {
      label: "Aadhaar Card Verification",
      isVerified: !!userDetails?.aadhaarNo,
    },
  ];

  if (loadingUser) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card Skeleton */}
          <div className="lg:col-span-1">
            <Card className="h-fit border-[0.01rem] shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col items-center space-y-6">
                  <Skeleton className="h-24 w-24 rounded-full" />
                  <div className="space-y-2 w-full text-center">
                    <Skeleton className="h-6 w-40 mx-auto" />
                    <Skeleton className="h-4 w-60 mx-auto" />
                    <Skeleton className="h-4 w-60 mx-auto" />
                  </div>
                  <div className="w-full space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-4">
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-8 w-24" />
                </Card>
              ))}
            </div>
            
            <Card className="border-[0.01rem]">
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <Skeleton className="h-8 w-40" />
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center space-x-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-3/4" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
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
        <Card className="lg:col-span-1 h-fit border-[0.01rem] shadow-lg bg-gradient-to-br from-primary/10 via-primary/5 to-background">
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
                {userDetails?.isVerified && (
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
                <VerificationProgress items={verificationItems} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content - Right Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                label={stat.label}
                value={stat.value}
                prefix={stat.prefix}
              />
            ))}
          </div>
          <ProfileDetails
            userDetails={userDetails}
            documentStatus={documentStatus}
            isEditing={isEditing}
            isSubmitting={isSubmitting}
            formData={formData}
            setIsEditing={setIsEditing}
            setFormData={setFormData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
