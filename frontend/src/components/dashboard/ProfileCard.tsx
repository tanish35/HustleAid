import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import {
  Check,
  Calendar,
  FileText,
  ArrowRight,
  LogOut,
  AlertCircle,
  IdCard,
  User,
} from "lucide-react";
import { Icons } from "../ui/icons";

interface ProfileCardProps {
  userDetails: any;
  onProfileClick: () => void;
  onLogout: () => void;
}

export const ProfileCard = ({
  userDetails,
  onProfileClick,
  onLogout,
}: ProfileCardProps) => {
  return (
    <Card className="hover:border-primary/50 transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex flex-col items-center">
          <Avatar className="h-24 w-24 mb-4 ring-2 ring-muted">
            <AvatarImage src={userDetails.avatar} alt={userDetails.name} />
            <AvatarFallback>{userDetails.name.charAt(0)}</AvatarFallback>
          </Avatar>

          <h2 className="text-xl font-bold mb-1">{userDetails.name}</h2>
          <p className="text-sm text-muted-foreground mb-3">
            {userDetails.email}
          </p>
          <Badge
            variant={userDetails.isVerified ? "outline" : "destructive"}
            className="mb-4"
          >
            <Check className="h-3 w-3 mr-1" />
            {userDetails.isVerified ? "Verified" : "Unverified"}
          </Badge>

          <div className="w-full space-y-3">
            <InfoItem
              label="Wallet ID"
              value={`${userDetails.walletId?.slice(0, 6)}...${userDetails.walletId?.slice(-4)}`}
              icon={<Icons.wallet className="h-4 w-4 text-primary" />}
            />
            <InfoItem
              label="PAN Number"
              value={userDetails.panNo || "Not available"}
              icon={<FileText className="h-4 w-4 text-primary" />}
            />
            <InfoItem
              label="aadhar Card"
              value={userDetails.aadharNo || "Not available"}
              icon={<IdCard className="h-4 w-4 text-primary" />}
            />
            {!userDetails.isVerified && (
              <div className="flex items-center p-3 bg-warning/20 text-warning rounded-lg">
                <AlertCircle className="h-4 w-4 mr-2" />
                <p className="text-xs">
                  Complete your document verification to unlock full account
                  privileges
                </p>
              </div>
            )}
            <div className="flex gap-3 pt-6 w-full">
              <Button
                variant="outline"
                className="w-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={onProfileClick}
              >
                Profile
                <ArrowRight className="w-4 h-4 ml-2 inline-block" />
              </Button>
              <Button
                variant="outline"
                className="w-full flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-colors"
                onClick={onLogout}
              >
                Logout
                <LogOut className="w-4 h-4 ml-2 inline-block" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const InfoItem = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
}) => (
  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm">{value}</p>
    </div>
    {icon}
  </div>
);
