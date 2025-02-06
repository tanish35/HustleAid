import { useEffect } from 'react';
import {
  Edit,
  Loader2,
  Calendar,
  User,
  CreditCard,
  Mail,
  CalendarIcon,
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
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar as DatePicker } from "./ui/calendar";
import { cn } from "../lib/utils";

interface FormData {
  name: string;
  email: string;
  dob: Date | undefined;
  gender: 'male' | 'female' | 'other' | string;
  address: string;
  panCard: File | null;
  aadharCard: File | null;
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


const InfoItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | null | undefined }) => (
  <div className="flex items-center gap-3">
    <div className="p-2.5 rounded-lg bg-primary/10">
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-secondary-foreground">{label}</p>
      {label === "Wallet ID" && value ? (
        <Tooltip>
          <TooltipTrigger>
            <p className="font-medium text-sm mt-0.5 font-mono">
              {value.slice(0, 6)}...{value.slice(-4)}
            </p>
          </TooltipTrigger>
          <TooltipContent>
            <p className="font-mono">{value}</p>
          </TooltipContent>
        </Tooltip>
      ) : (
        <p className="font-medium text-sm mt-0.5">{value || "Not Available"}</p>
      )}
    </div>
  </div>
);


const ProfileSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <Card className='border-muted/80 bg-background/100'>
    <CardContent className="p-6">
      <h3 className="font-semibold text-sm text-secondary-foreground mb-4">{title}</h3>
      <div className="space-y-4">
        {children}
      </div>
    </CardContent>
  </Card>
);

interface DocumentCardProps {
  type: string;
  documentNumber: string | null;
  isVerified: boolean;
  icon: React.ReactNode;
  hasImage: boolean;
  isAadhar?: boolean;
}

const DocumentCard = ({ 
  type, 
  documentNumber, 
  isVerified, 
  icon, 
  hasImage,
  isAadhar = false,
  userDetails 
}: DocumentCardProps & { userDetails?: any }) => (
  <Card className="h-full border-muted-foreground/50 shadow-xl dark:shadow-cyan-950-xl bg-gradient-to-br from-background to-muted">
    <CardContent className="p-6">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary/10">
              {icon}
            </div>
            <h3 className="font-medium text-foreground">{type}</h3>
          </div>
          <Badge 
            variant={isVerified ? "default" : "outline"}
            className={cn(
              isVerified ? 
              "bg-secondary/10 text-secondary-foreground" : 
              "bg-primary/10 text-primary-foreground"
            )}
          >
            {isVerified ? "Verified" : "Pending"}
          </Badge>
        </div>
        
        <div className="mt-2">
          <p className="text-sm font-medium text-secondary-foreground">Document Number</p>
          <p className="font-medium mt-1 text-foreground">{documentNumber || "Not Available"}</p>
        </div>

        {isAadhar && (
          <div className="mt-4">
            <div className="h-px bg-black/5 dark:bg-white/5 mb-4" />
            <div>
              <p className="text-sm font-medium text-secondary-foreground mb-2">Address</p>
              <p className="text-sm leading-relaxed text-foreground">
                {userDetails.address || "Address will be extracted from your Aadhar card"}
              </p>
            </div>
          </div>
        )}

        {hasImage && (
          <div className="mt-4 flex justify-end">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs hover:bg-muted"
            >
              View Document
            </Button>
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);

const DocumentUploadField = ({ name, value, onChange, isRequired }: {
  name: string;
  value: File | null;
  onChange: (file: File) => void;
  isRequired: boolean;
}) => (
  <div className="space-y-2">
    <Label htmlFor={name} className="flex items-center gap-1">
      {name}
      {isRequired && <span className="text-destructive">*</span>}
    </Label>
    <DocumentUpload
      label={`Upload ${name}`}
      onImageUpload={onChange}
    />
  </div>
);

const EditProfileForm = ({
  formData,
  handleInputChange,
  handleSubmit,
  setFormData,
  isSubmitting,
  setIsEditing,
  userDetails
}: {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  isSubmitting: boolean;
  setIsEditing: (value: boolean) => void;
  userDetails: any;
}) => (
  <form onSubmit={handleSubmit} className="space-y-8">
    <div className="grid grid-cols-1 gap-6">
      <div className="space-y-4 p-6 rounded-xl bg-card-section">
        <h3 className="font-semibold text-sm text-secondary-foreground mb-4">Personal Information</h3>
        <div className="grid gap-4">
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="name" className="flex items-center gap-1">
              Full Name<span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              required
            />
          </div>
          
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="email" className="flex items-center gap-1">
              Email Address<span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid items-center gap-2">
              <Label htmlFor="dob" className="flex items-center gap-1">
                Date of Birth<span className="text-destructive">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.dob && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.dob ? format(formData.dob, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <DatePicker
                    mode="single"
                    selected={formData.dob}
                    onSelect={(date) => setFormData(prev => ({ ...prev, dob: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="grid items-center gap-2">
              <Label htmlFor="gender" className="flex items-center gap-1">
                Gender<span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl bg-primary/5 shadow-sm">
          <DocumentUploadField
            name="PAN Card"
            value={formData.panCard}
            onChange={(file) => setFormData(prev => ({ ...prev, panCard: file }))}
            isRequired={!userDetails.panNo}
          />
        </div>

        <div className="p-6 rounded-xl bg-secondary/5 shadow-sm">
          <DocumentUploadField
            name="Aadhar Card"
            value={formData.aadharCard}
            onChange={(file) => setFormData(prev => ({ ...prev, aadharCard: file }))}
            isRequired={!userDetails.aadharNo}
          />
        </div>
      </div>
    </div>

    <div className="flex gap-3 justify-end pt-4 border-t">
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
        className="px-6 gap-2"
      >
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        Save Changes
      </Button>
    </div>
  </form>
);

const ViewProfileContent = ({
  userDetails,
  documentStatus
}: {
  userDetails: any;
  documentStatus: any;
}) => (
  <div className="space-y-6 ">
    <ProfileSection title="Personal Information">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoItem 
          icon={<User className="h-4 w-4 text-primary" />}
          label="Full Name"
          value={userDetails.name}
        />
        <InfoItem 
          icon={<Mail className="h-4 w-4 text-primary" />}
          label="Email Address"
          value={userDetails.email}
        />
        <InfoItem 
          icon={<Calendar className="h-4 w-4 text-primary" />}
          label="Date of Birth"
          value={userDetails.dob ? format(new Date(userDetails.dob), "MMMM dd, yyyy") : null}
        />
        <InfoItem 
          icon={<User className="h-4 w-4 text-primary" />}
          label="Gender"
          value={userDetails.gender}
        />
      </div>
    </ProfileSection>

    <ProfileSection title="Account Information">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoItem 
          icon={<CreditCard className="h-4 w-4 text-primary" />}
          label="User ID"
          value={userDetails.userId}
        />
        <InfoItem 
          icon={<CreditCard className="h-4 w-4 text-primary" />}
          label="Wallet ID"
          value={userDetails.walletId}
        />
        <InfoItem 
          icon={<Calendar className="h-4 w-4 text-primary" />}
          label="Member Since"
          value={format(new Date(userDetails.createdAt), "MMMM dd, yyyy")}
        />
        <InfoItem 
          icon={<Calendar className="h-4 w-4 text-primary" />}
          label="Last Updated"
          value={format(new Date(userDetails.updatedAt), "MMMM dd, yyyy")}
        />
      </div>
    </ProfileSection>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <DocumentCard 
        type="PAN Card"
        documentNumber={userDetails.panNo}
        isVerified={documentStatus.panCard.isVerified}
        icon={<CreditCard className="h-4 w-4 text-primary" />}
        hasImage={Boolean(userDetails.panCardImage)}
      />
      <DocumentCard 
        type="Aadhar Card"
        documentNumber={userDetails.aadharNo}
        isVerified={documentStatus.aadhar.isVerified}
        icon={<CreditCard className="h-4 w-4 text-primary" />}
        hasImage={Boolean(userDetails.aadharCardImage)}
        isAadhar={true}
        userDetails={userDetails}
      />
    </div>
  </div>
);

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
  useEffect(() => {
    if (isEditing) {
      setFormData(prevData => ({
        ...prevData,
        name: userDetails.name || '',
        email: userDetails.email || '',
        address: userDetails.address || '',
      }));
    }
  }, [isEditing, userDetails, setFormData]);

  const isProfileComplete = Boolean(
    userDetails.name &&
    userDetails.email &&
    userDetails.panNo &&
    userDetails.aadharNo &&
    userDetails.address
  );

  return (
    <div className="space-y-6 ">
      <Card className="rounded-lg shadow-sm border-muted/80 bg-background">
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-semibold tracking-tight">
                Profile Details
              </CardTitle>
              <CardDescription className="mt-1">
                View and manage your account information
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
            <EditProfileForm
              formData={formData}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
              setFormData={setFormData}
              isSubmitting={isSubmitting}
              setIsEditing={setIsEditing}
              userDetails={userDetails}
            />
          ) : (
            <ViewProfileContent
              userDetails={userDetails}
              documentStatus={documentStatus}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
