import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/useUser";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { StatCard } from "@/components/profile/StatCard";
import { VerificationProgress } from "@/components/VerificationProgress";
import { ProfileDetails } from "@/components/ProfileDetails";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { api } from "@/lib/axios";
import { motion } from "framer-motion";

interface ProfileFormData {
  name: string;
  email: string;
  panCard: File | null;
  aadharCard: File | null;
  dob: Date | null;
  gender: string;
}

interface VerificationResponse {
  success: boolean;
  message: string;
}

const ProfileCard = ({
  userDetails,
  verificationItems,
}: {
  userDetails: any;
  verificationItems: any[];
}) => {
  const isFullyVerified = verificationItems.every((item) => item.isVerified);

  return (
    <Card className="lg:col-span-1 backdrop-blur-sm  bg-background/60 border-1  border-border/50 rounded-xl shadow-xl">
      <CardContent className="p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-background/20 rounded-xl" />
        <div className="relative z-10">
          <div className="flex flex-col items-center space-y-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className="relative inline-block">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-primary/30 rounded-full blur opacity-70" />
                <Avatar className="h-32 w-32 ring-2 ring-background relative">
                  <AvatarImage
                    src={
                      userDetails?.avatar ||
                      "https://media.gq-magazine.co.uk/photos/5d13a4349fa60175c8839622/1:1/w_1280,h_1280,c_limit/Ana-de-Armas-GQ-8Jun17_rex_b.jpg"
                    }
                    alt={userDetails?.name}
                    className="object-cover rounded-full"
                  />
                  <AvatarFallback className="bg-primary/5 text-3xl font-light">
                    {userDetails?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
            </motion.div>

            <div className="text-center space-y-2">
              <h2 className="text-2xl font-light tracking-tight">
                {userDetails?.name}
              </h2>
              <p className="text-sm text-muted-foreground">
                {userDetails?.email}
              </p>
            </div>

            {isFullyVerified ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full"
              >
                <div className="text-center px-4 py-3 rounded-lg bg-primary/5 border border-primary/10">
                  <span className="text-sm text-primary/80 flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" />
                    Account fully verified
                  </span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full"
              >
                <div className="text-center px-4 py-3 rounded-lg bg-destructive/5 border border-destructive/10">
                  <span className="text-sm text-destructive/80 flex items-center justify-center gap-1.5">
                    <AlertCircle className="h-4 w-4" />
                    Incomplete account verification
                  </span>
                </div>
              </motion.div>
            )}

            <motion.div
              className="w-full space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <VerificationProgress items={verificationItems} />
            </motion.div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ProfilePage = () => {
  const { loadingUser, userDetails, setUserDetails } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState<ProfileFormData>({
    name: "",
    email: "",
    panCard: null,
    aadharCard: null,
    dob: null,
    gender: "",
  });

  useEffect(() => {
    if (userDetails) {
      setFormData({
        name: userDetails.name || "",
        email: userDetails.email || "",
        panCard: null,
        aadharCard: null,
        dob: userDetails.dob || null,
        gender: userDetails.gender || "",
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
      const form = new FormData();
      try {
        if (
          formData.name !== userDetails?.name ||
          formData.dob !== (userDetails?.dob || null) ||
          formData.gender?.trim() !== (userDetails?.gender || "").trim()
        ) {
          const profileData = {
            name: formData.name,
            // email: formData.email,
            dob: formData.dob,
            gender: formData.gender,
          };

          const res = await api.patch("/auth/update-profile", profileData, {
            withCredentials: true,
          });
          console.log(res);
          // console.log(profileData);
          // console.log("formData", formData);
          console.log("userDetails", userDetails);
        }
      } catch (err) {
        console.log(err);
      }

      const uploadPromises: Promise<VerificationResponse>[] = [];

      if (formData.panCard) {
        form.append("pan", formData.panCard);
        uploadPromises.push(
          api.post("/verify/pan", form, {
            headers: { "Content-Type": "multipart/form-data" },
          })
        );
      }

      if (formData.aadharCard) {
        const aadharForm = new FormData();
        aadharForm.append("aadhar", formData.aadharCard);
        uploadPromises.push(
          api.post("/verify/adhar", aadharForm, {
            headers: { "Content-Type": "multipart/form-data" },
          })
        );
      }

      if (uploadPromises.length) {
        const results = await Promise.all(uploadPromises);
        const hasFailures = results.some((result) => !result.success);

        if (hasFailures) {
          throw new Error("One or more document verifications failed");
        }
      }

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      const userResponse = await api.get("/auth/me", { withCredentials: true });
      setUserDetails((prev) => ({
        ...prev,
        ...userResponse.data,
        createdAt: new Date(userResponse.data.createdAt),
      }));

      console.log("Updated User Details:", userDetails);

      setIsEditing(false);

      // Refresh user data
      // Assuming you have a refetch function from useUser hook
      // await refetchUserDetails();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "An error occurred while updating profile",
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
    aadhar: {
      imageUrl: userDetails?.aadharNo || null,
      isVerified: !!userDetails?.aadharNo,
    },
  };

  const verificationItems = [
    {
      label: "Image verification",
      isVerified: !!userDetails?.avatar,
    },
    {
      label: "Verify Email",
      isVerified: !!userDetails?.email,
    },
    {
      label: "PAN Card Verification",
      isVerified: !!userDetails?.panNo,
    },
    {
      label: "aadhar Card Verification",
      isVerified: !!userDetails?.aadharNo,
    },
  ];

  if (loadingUser) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card className="backdrop-blur-sm bg-background/60 border-none shadow-xl">
              <CardContent className="p-8">
                <div className="flex flex-col items-center space-y-8">
                  <div className="relative w-32 h-32">
                    <Skeleton className="absolute inset-0 rounded-full animate-pulse" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-full blur-xl" />
                  </div>
                  <div className="space-y-4 w-full">
                    <Skeleton className="h-6 w-3/4 mx-auto" />
                    <Skeleton className="h-4 w-2/3 mx-auto" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Breadcrumb>
          <BreadcrumbList className="text-sm text-muted-foreground">
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  to="/dashboard"
                  className="flex items-center hover:text-primary transition-colors"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Dashboard
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Profile</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <ProfileCard
            userDetails={userDetails}
            verificationItems={verificationItems}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-2 space-y-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
