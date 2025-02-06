import { useState } from "react";
import { useUser } from "../hooks/useUser";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import { Clock, Coins, Activity, LayoutGrid, List } from "lucide-react";
import { ProfileCard } from "../components/dashboard/ProfileCard";
import { TokenListView } from "../components/dashboard/TokenListView";
import { TokenCardView } from "../components/dashboard/TokenCardView";
import { api } from "@/lib/axios";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { TokenType, UserToken } from "@/types";

const Dashboard = () => {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const { loadingUser, userDetails } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const handleProfileClick = () => {
    navigate("/profile");
  };

  const dummyActivity = [
    {
      description: "Received Education Grant",
      timestamp: "2023-09-01T10:00:00Z",
      type: "credit",
      amount: 500,
    },
    {
      description: "Used Healthcare Token",
      timestamp: "2023-09-02T15:30:00Z",
      type: "debit",
      amount: 100,
    },
    {
      description: "Housing Assistance Approved",
      timestamp: "2023-09-03T09:15:00Z",
      type: "credit",
      amount: 800,
    },
  ];

  const activities = userDetails?.activity?.length
    ? userDetails.activity
    : dummyActivity;

  const transformUserTokens = (userTokens: UserToken[]) => {
    return userTokens.map((token) => ({
      id: token.tokenId,
      name: token.tokenType,
      count: token.balance,
      description: getTokenDescription(token.tokenType),
      status: token.balance > 0 ? "active" : "pending",
    }));
  };

  const getTokenDescription = (tokenType: TokenType) => {
    const descriptions: Record<TokenType, string> = {
      Loan: "Financial assistance",
      Food: "Meal support",
      Healthcare: "Medical aid",
      Transportation: "Travel assistance",
    };
    return descriptions[tokenType];
  };

  const dummyTokens = [
    {
      id: 1,
      name: "Loan" as TokenType,
      description: "Financial assistance",
      count: 0,
      status: "pending",
    },
    {
      id: 2,
      name: "Food" as TokenType,
      description: "Meal support",
      count: 5,
      status: "active",
    },
    {
      id: 3,
      name: "Healthcare" as TokenType,
      description: "Medical aid",
      count: 0,
      status: "pending",
    },
    {
      id: 4,
      name: "Transportation" as TokenType,
      description: "Travel assistance",
      count: 0,
      status: "pending",
    },
  ];

  const tokens = userDetails?.tokens?.length
    ? transformUserTokens(userDetails.tokens)
    : dummyTokens;

  if (loadingUser) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[150px]" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                {Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent className="space-y-4">
                {Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!userDetails) {
    navigate("/auth");
  }

  const onLogout = async () => {
    await api.get("/auth/logout");
    toast({
      title: "Logged out successfully",
      description: "You have been logged out from your account",
    });
    navigate("/auth");
  };

  const handleTokenClick = (tokenId: number) => {
    navigate(`/transactions/${tokenId}`);
  };

  const toggleView = () => {
    setViewMode(viewMode === "list" ? "grid" : "list");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <ProfileCard
            userDetails={userDetails}
            onProfileClick={handleProfileClick}
            onLogout={onLogout}
          />
        </div>
        <div className="lg:col-span-2 space-y-8">
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center">
                <Coins className="h-5 w-5 mr-2 text-primary" />
                Your Tokens
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleView}
                className="ml-2"
              >
                {viewMode === "list" ? (
                  <LayoutGrid className="h-5 w-5" />
                ) : (
                  <List className="h-5 w-5" />
                )}
              </Button>
            </CardHeader>
            <CardContent className="p-4">
              {viewMode === "list" ? (
                <TokenListView
                  tokens={tokens}
                  onTokenClick={handleTokenClick}
                />
              ) : (
                <TokenCardView
                  tokens={tokens}
                  onTokenClick={handleTokenClick}
                />
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2 text-primary" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activities.length > 0 ? (
                <div className="space-y-4">
                  {activities.map((activity: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-start p-4 bg-muted/50 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {activity.description}
                        </p>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-xs text-muted-foreground">
                            {new Date(activity.timestamp).toLocaleString()}
                          </p>
                          <span
                            className={`text-xs font-medium ${
                              activity.type === "credit"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {activity.type === "credit" ? "+" : "-"}$
                            {activity.amount}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <Clock className="h-12 w-12 text-muted-foreground" />
                  <h3 className="text-lg font-medium">No Recent Activity</h3>
                  <p className="text-sm text-muted-foreground">
                    Your recent transactions will appear here
                  </p>{" "}
                </div>
              )}{" "}
            </CardContent>{" "}
          </Card>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};
export default Dashboard;
