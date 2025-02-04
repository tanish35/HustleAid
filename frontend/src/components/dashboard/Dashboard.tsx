import { useUser } from "../../hooks/useUser";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Skeleton } from "../ui/skeleton";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  Check,
  Clock,
  Coins,
  FileText,
  RefreshCw,
} from "lucide-react";
import { Icons } from "../ui/icons";

const Dashboard = () => {
  const { loadingUser, userDetails } = useUser();

  const handleProfileClick = () => {
    window.location.href = "/profile";
  };

  const dummyActivity = [
    { description: "Dummy Activity 1", timestamp: "2023-09-01T10:00:00Z" },
    { description: "Dummy Activity 2", timestamp: "2023-09-02T15:30:00Z" },
  ];

  const activities = userDetails?.activity?.length
    ? userDetails.activity
    : dummyActivity;

  const dummyTokens = [
    { id: 1, name: "Loan", count: 5 },
    { id: 2, name: "Food", count: 10 },
    { id: 3, name: "Healthcare", count: 3 },
    { id: 4, name: "Transportation", count: 7 },
  ];

  const tokens = userDetails?.tokens?.length ? userDetails.tokens : dummyTokens;

  if (loadingUser) {
    return (
      <div className="p-6 space-y-6 max-w-6xl mx-auto">
        <div className="rounded-lg border bg-card p-6 animate-pulse">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="space-y-3">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <Skeleton className="h-20 rounded-xl" />
            <Skeleton className="h-20 rounded-xl" />
          </div>
        </div>
        <Skeleton className="h-96 w-full rounded-xl" />
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
            <Button variant="destructive" className="mt-4">
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <Card
            onClick={handleProfileClick}
            className="group border-[0.01rem] shadow-lg bg-gradient-to-br from-primary/10 to-primary cursor-pointer relative"
          >
            <ArrowRight className="absolute top-8 right-8 h-5 w-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4 border-4 border-background shadow-lg">
                  <AvatarImage
                    src={
                      userDetails.avatar ||
                      "https://media.gq.com/photos/5798cd2dbf91805850f35df9/1:1/w_1012,h_1012,c_limit/ana-de-armas-gq-0816-02.jpg"
                    }
                    alt={userDetails.name}
                  />
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                    {userDetails.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold text-foreground mb-1">
                  {userDetails.name}
                </h2>
                <p className="text-sm text-muted mb-3">{userDetails.email}</p>
                <Badge
                  variant={userDetails.isVerified ? "outline" : "destructive"}
                  className="mb-4"
                >
                  <Check className="h-4 w-4 mr-1" />
                  {userDetails.isVerified ? "Verified" : "Unverified"}
                </Badge>
                <div className="w-full space-y-3">
                  <div className="flex items-center justify-between p-3 bg-background rounded-lg shadow-sm">
                    <div>
                      <p className="text-xs text-foreground/60">Wallet ID</p>
                      <p className="text-sm font-mono text-foreground">
                        {userDetails.walletId?.slice(0, 6)}...
                        {userDetails.walletId?.slice(-4)}
                      </p>
                    </div>
                    <Icons.wallet className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-background rounded-lg shadow-sm">
                    <div>
                      <p className="text-xs text-foreground/60">Member Since</p>
                      <p className="text-sm">
                        {new Date(userDetails.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                          }
                        )}
                      </p>
                    </div>
                    <Calendar className="h-5 w-5 text-secondary" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-background rounded-lg shadow-sm">
                    <div>
                      <p className="text-xs text-foreground/60">PAN Number</p>
                      <p className="text-sm">
                        {userDetails.panNo || (
                          <Button
                            variant="link"
                            className="h-auto p-0 text-primary"
                          >
                            Add PAN
                          </Button>
                        )}
                      </p>
                    </div>
                    <FileText className="h-5 w-5 text-success" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 flex-col space-y-8">
          <Card className="border-[0.01rem] shadow-lg">
            <CardHeader className="bg-gradient-to-r from-muted/10 to-muted">
              <CardTitle className="flex items-center">
                <Coins className="h-6 w-6 mr-2 text-primary" />
                Your Tokens
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-4">
                {tokens.map((token: any) => (
                  <div
                    key={token.id}
                    className="flex items-center space-x-2 p-3 bg-background rounded-lg shadow-sm hover:bg-muted transition-colors"
                  >
                    <div className="text-primary font-bold text-lg">
                      {token.count}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {token.name}
                      </p>
                      <p className="text-xs text-foreground/60">
                        Tokens Available
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-[0.01rem] shadow-lg">
            <CardHeader className="bg-gradient-to-r from-muted/10 to-muted">
              <CardTitle className="flex items-center">
                <Icons.activity className="h-6 w-6 mr-2 text-primary" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {activities.length > 0 ? (
                <div className="space-y-4">
                  {activities.map((activity: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-start p-4 hover:bg-muted rounded-lg transition-colors"
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                        <ArrowRight className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">
                          {activity.description}
                        </p>
                        <p className="text-xs text-foreground/60 mt-1">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <Clock className="h-16 w-16 text-muted" />
                  <h3 className="text-lg font-medium text-foreground">
                    No Recent Activity
                  </h3>
                  <p className="text-sm text-muted">
                    Your recent transactions and activities will appear here
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
