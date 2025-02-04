import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Check, Calendar, FileText, ArrowRight } from "lucide-react";
import { Icons } from "../ui/icons";

interface ProfileCardProps {
  userDetails: any;
  onProfileClick: () => void;
}

export const ProfileCard = ({ userDetails, onProfileClick }: ProfileCardProps) => {
  return (
    <Card
      onClick={onProfileClick}
      className="hover:border-primary/50 transition-all duration-200 cursor-pointer group"
    >
      <CardContent className="p-6">
        <div className="flex flex-col items-center">
          <Avatar className="h-24 w-24 mb-4 ring-2 ring-muted">
            <AvatarImage src={userDetails.avatar} alt={userDetails.name} />
            <AvatarFallback>{userDetails.name.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <h2 className="text-xl font-bold mb-1">{userDetails.name}</h2>
          <p className="text-sm text-muted-foreground mb-3">{userDetails.email}</p>
          <Badge variant={userDetails.isVerified ? "outline" : "destructive"} className="mb-4">
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
              label="Member Since"
              value={new Date(userDetails.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
              })}
              icon={<Calendar className="h-4 w-4 text-primary" />}
            />
            <InfoItem
              label="PAN Number"
              value={userDetails.panNo || <Button variant="link" className="h-auto p-0">Add PAN</Button>}
              icon={<FileText className="h-4 w-4 text-primary" />}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const InfoItem = ({ label, value, icon }: { label: string; value: React.ReactNode; icon: React.ReactNode }) => (
  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm">{value}</p>
    </div>
    {icon}
  </div>
);
