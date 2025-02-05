import {
  AlertCircle,
  CheckCircle2,
  Edit,
  Loader2,
  XCircle,
  Calendar,
  User,
  CreditCard,
  Mail,
  Home,
  Upload, // Add this import
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { DocumentUpload } from "./DocumentUpload";
import { format } from "date-fns";
import { Separator } from "./ui/separator";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface FormData {
  name: string;
  email: string;
  panCard: File | null;
  aadharCard: File | null;
  address?: string;
}

interface ProfileDetailsProps {
  userDetails: any;
  documentStatus: any;
  isEditing: boolean;
  isSubmitting: boolean;
  formData: FormData;
  setIsEditing: (value: boolean) => void;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const ProfileDetails = ({
  userDetails,
  documentStatus,
  isEditing,
  isSubmitting,
  formData,
  setIsEditing,
  setFormData,
  handleInputChange,
  handleSubmit,
}: ProfileDetailsProps) => {
  const verificationProgress =
    [
      documentStatus.email.isVerified,
      documentStatus.panCard.isVerified,
      documentStatus.aadhar.isVerified,
    ].filter(Boolean).length * 33.33;

  const isProfileComplete = Boolean(
    userDetails.name &&
    userDetails.email &&
    userDetails.panNo &&
    userDetails.aadharNo &&
    userDetails.address
  );

  return (
    <div className="space-y-6">
      <Card className="rounded-lg shadow-sm">
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-semibold tracking-tight">
                Account Profile
              </CardTitle>
              <CardDescription className="mt-1">
                Manage your personal and verification details
              </CardDescription>
            </div>
            {!isEditing && (
              <Button
                variant={isProfileComplete ? "outline" : "default"}
                size="sm"
                onClick={() => setIsEditing(true)}
                className="gap-2"
              >
                <Edit className="h-4 w-4" />
                {isProfileComplete ? 'Edit Profile' : 'Complete Profile'}
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="mt-6">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-8">
              <Separator className="my-6" />

              <div className="space-y-4">
                <div className="space-y-4">
                  <div className="p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors duration-200">
                    <DocumentUpload
                      label="Upload Profile Photo"
                      onImageUpload={(file: File) => {
                        if (file) {
                          setFormData((prev) => ({
                            ...prev,
                            profileImage: file
                          }));
                        }
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors duration-200">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <Label className="text-muted-foreground">Full Name</Label>
                    </div>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-[200px] h-8"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors duration-200">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <Label className="text-muted-foreground">Email Address</Label>
                    </div>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-[200px] h-8"
                    />
                  </div>

                  <div className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors duration-200">
                    <DocumentUpload
                      label="PAN Card"
                      onImageUpload={(file: File) => {
                        if (file) {
                          setFormData((prev) => ({
                            ...prev,
                            panCard: file
                          }));
                        }
                      }}
                    />
                  </div>

                  <div className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors duration-200">
                    <DocumentUpload
                      label="aadhar Card"
                      onImageUpload={(file: File) => {
                        if (file) {
                          setFormData((prev) => ({
                            ...prev,
                            aadharCard: file
                          }));
                        }
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors duration-200">
                    <div className="flex items-center gap-2">
                      <Home className="h-4 w-4 text-muted-foreground" />
                      <Label className="text-muted-foreground">Address</Label>
                    </div>
                    <Input
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-[200px] h-8"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="px-6"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 gap-2 transition-all"
                >
                  {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-8">
              <Separator className="my-6" />

              <div className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors duration-200">
                    <div className="flex items-center gap-2">
                      <Upload className="h-4 w-4 text-muted-foreground" />
                      <Label className="text-muted-foreground">
                        Profile Image
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      {userDetails.profileImage ? (
                        <img
                          src={userDetails.profileImage}
                          alt="Profile"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          <User className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors duration-200">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <Label className="text-muted-foreground">
                        Full Name
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{userDetails.name}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors duration-200">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <Label className="text-muted-foreground">User ID</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {userDetails.userId}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors duration-200">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <Label className="text-muted-foreground">
                        Member Since
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {format(
                          new Date(userDetails.createdAt),
                          "MMM dd, yyyy"
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors duration-200">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <Label className="text-muted-foreground">
                        Email Address
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{userDetails.email}</span>
                      <Tooltip delayDuration={150}>
                        <TooltipTrigger className="cursor-help">
                          {documentStatus.email.isVerified ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600 hover:text-green-700 transition-colors" />
                          ) : (
                            <XCircle className="h-4 w-4 text-yellow-600 hover:text-yellow-700 transition-colors" />
                          )}
                        </TooltipTrigger>
                        <TooltipContent className="bg-secondary p-3 rounded-lg">
                          <div className="space-y-1">
                            <p className="font-semibold">
                              {documentStatus.email.isVerified
                                ? "Email Verified"
                                : "Email Pending Verification"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {documentStatus.email.isVerified
                                ? "Your email has been successfully verified"
                                : "Please check your inbox for verification email"}
                            </p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors duration-200">
                    <div className="flex items-center justify-between">
                      <Label className="text-muted-foreground">
                        PAN Card
                      </Label>
                      <Tooltip delayDuration={150}>
                        <TooltipTrigger>
                          <Badge
                            variant={
                              documentStatus.panCard.isVerified
                                ? "default"
                                : "destructive"
                            }
                          >
                            {userDetails.panNo || "Not available"}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent className="bg-secondary p-3 rounded-lg">
                          <div className="space-y-1">
                            <p className="font-semibold">PAN Card Status</p>
                            <p className="text-sm text-muted-foreground">
                              {documentStatus.panCard.isVerified
                                ? "Your PAN card has been verified"
                                : "Your PAN card is pending verification"}
                            </p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors duration-200">
                    <div className="flex items-center justify-between">
                      <Label className="text-muted-foreground">
                        aadhar Card
                      </Label>
                      <Tooltip delayDuration={150}>
                        <TooltipTrigger>
                          <Badge
                            variant={
                              documentStatus.aadhar.isVerified
                                ? "default"
                                : "destructive"
                            }
                          >
                            {userDetails.aadharNo || "Not available"}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent className="bg-secondary p-3 rounded-lg">
                          <div className="space-y-1">
                            <p className="font-semibold">
                              aadhar Card Status
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {documentStatus.aadhar.isVerified
                                ? "Your aadhar card has been verified"
                                : "Your aadhar card is pending verification"}
                            </p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Label className="text-muted-foreground">Address</Label>
                      </div>
                      <span className="font-medium">
                        {userDetails.address || "Not available"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {verificationProgress < 100 && (
                <Alert
                  variant="destructive"
                  className="border-yellow-200 bg-yellow-50"
                >
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <AlertTitle className="text-yellow-800">
                    Action Required
                  </AlertTitle>
                  <AlertDescription className="text-yellow-800">
                    Complete your document verification to unlock full account
                    privileges.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
