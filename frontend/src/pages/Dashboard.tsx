import { useUser } from "../hooks/useUser";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import { AlertCircle, Clock, Coins, RefreshCw, PieChart, Activity } from "lucide-react";
import { Button } from "../components/ui/button";
// Remove or modify the Icons import if not needed
// import { Icons } from "../components/ui/icons";
import { ProfileCard } from "../components/dashboard/ProfileCard";

const Dashboard = () => {
  const { loadingUser, userDetails } = useUser();

  const handleProfileClick = () => {
    window.location.href = "/profile";
  };

  const dummyActivity = [
    { 
      description: "Received Education Grant", 
      timestamp: "2023-09-01T10:00:00Z",
      type: "credit",
      amount: 500
    },
    { 
      description: "Used Healthcare Token", 
      timestamp: "2023-09-02T15:30:00Z",
      type: "debit",
      amount: 100
    },
    { 
      description: "Housing Assistance Approved", 
      timestamp: "2023-09-03T09:15:00Z",
      type: "credit",
      amount: 800
    },
  ];

  const activities = userDetails?.activity?.length
    ? userDetails.activity
    : dummyActivity;

  const dummyTokens = [
    { id: 1, name: "Loan", count: 5 },
    { id: 2, name: "Food", count: 10 },
    { id: 3, name: "Healthcare", count: 3 },
    { id: 4, name: "Transportation", count: 7 },
    { id: 5, name: "Education", count: 4 },
    { id: 6, name: "Housing", count: 2 },
  ];

  const tokens = userDetails?.tokens?.length ? userDetails.tokens : dummyTokens;

  if (loadingUser) {
    return (
      <div className="p-6 space-y-6 max-w-6xl mx-auto">
        <Skeleton className="h-[500px] w-full rounded-xl" />
      </div>
    );
  }

  if (!userDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="w-full max-w-md border-destructive/50">
          <CardContent className="p-6 flex flex-col items-center space-y-4">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <h2 className="text-xl font-bold">Profile Unavailable</h2>
            <p className="text-center text-muted-foreground">
              We couldn't retrieve your profile data. Please try again.
            </p>
            <Button variant="destructive">
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
          <ProfileCard userDetails={userDetails} onProfileClick={handleProfileClick} />
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="h-5 w-5 mr-2 text-primary" />
                Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Assistance Received</span>
                  <span className="font-medium">${userDetails?.totalAssistance || "1,400"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Active Programs</span>
                  <span className="font-medium">{userDetails?.activePrograms || "3"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Completed Programs</span>
                  <span className="font-medium">{userDetails?.completedPrograms || "2"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Coins className="h-5 w-5 mr-2 text-primary" />
                Your Tokens
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {tokens.map((token: any) => (
                  <div
                    key={token.id}
                    className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg"
                  >
                    <div className="text-primary font-bold text-lg">{token.count}</div>
                    <div>
                      <p className="text-sm font-medium">{token.name}</p>
                      <p className="text-xs text-muted-foreground">Available</p>
                    </div>
                  </div>
                ))}
              </div>
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
                        <p className="text-sm font-medium">{activity.description}</p>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-xs text-muted-foreground">
                            {new Date(activity.timestamp).toLocaleString()}
                          </p>
                          <span className={`text-xs font-medium ${
                            activity.type === 'credit' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {activity.type === 'credit' ? '+' : '-'}${activity.amount}
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
