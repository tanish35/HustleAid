import { useState, useEffect } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Bus, Calendar } from "lucide-react";
import { abi } from "@/lib/abi";
import { useToast } from "@/hooks/use-toast";

const CONTRACT_ADDRESS: `0x${string}` =
  (import.meta.env.VITE_CONTRACT_ADDRESS as `0x${string}`) || "0x";
const RAILWAY_ADDRESS = "0xf2eAcB364AD62cA6aaCEcF207aBf93FA7de4E03B";

const trainRoutes = [
  {
    name: "Howrah Mail",
    route: "Kolkata to Mumbai",
    days: ["Monday", "Wednesday", "Friday"],
    code: "12309",
  },
  {
    name: "Rajdhani Express",
    route: "Kolkata to Delhi",
    days: ["Tuesday", "Thursday", "Saturday"],
    code: "12301",
  },
  {
    name: "Coromandel Express",
    route: "Kolkata to Chennai",
    days: ["Monday", "Thursday", "Sunday"],
    code: "12841",
  },
  {
    name: "Shatabdi Express",
    route: "Kolkata to Bangalore",
    days: ["Wednesday", "Friday", "Sunday"],
    code: "12018",
  },
  {
    name: "Falaknuma Express",
    route: "Kolkata to Hyderabad",
    days: ["Tuesday", "Saturday"],
    code: "12703",
  },
  {
    name: "Azad Hind Express",
    route: "Kolkata to Pune",
    days: ["Monday", "Friday"],
    code: "12113",
  },
  {
    name: "Poorva Express",
    route: "Kolkata to Jaipur",
    days: ["Thursday", "Sunday"],
    code: "12381",
  },
];

const TrainBookingPage = () => {
  const { address } = useAccount();
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const { data: hash, writeContract, isPending } = useWriteContract();
  //@ts-ignore
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });
  const { toast } = useToast();
  const { data: tokens, isLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: "getAllTokensOfOwner",
    args: [address!],
  }) as { data: number[] | bigint[]; isLoading: boolean };

  const transportationTokens = tokens ? tokens[3].toString() : "0";

  const getDayOfWeek = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { weekday: "long" });
  };

  const availableTrains = trainRoutes.filter((train) =>
    train.days.includes(getDayOfWeek(selectedDate))
  );

  const handleBooking = async () => {
    try {
      writeContract({
        address: CONTRACT_ADDRESS,
        abi,
        functionName: "transferToken",
        args: [RAILWAY_ADDRESS, BigInt(4), BigInt(1)],
      });

      toast({
        title: "Booking in progress",
        description: "Please wait while we process your booking.",
      });
    } catch (error) {
      toast({
        title: "Booking Failed",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (isConfirmed) {
      toast({
        title: "Booking Confirmed",
        description: "Your train ticket has been booked successfully!",
        variant: "default",
      });
    }
  }, [isConfirmed, toast]);

  if (!address) {
    return (
      <div className="container mx-auto px-4 py-8 bg-white dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Connect Your Wallet</h1>
          <p className="text-muted-foreground">
            Please connect your wallet to book a train.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-white dark:bg-gray-900">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Indian Railway Booking
          </h1>
          <p className="text-muted-foreground mt-2">
            Use your transportation tokens to book train journeys across India
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <Card className="w-full md:w-1/3">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bus className="h-6 w-6" />
                <span>Transportation Tokens</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl font-bold">{transportationTokens}</div>
              )}
              <p className="text-sm text-muted-foreground">Tokens Available</p>
            </CardContent>
          </Card>

          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-4">
              <Calendar className="h-6 w-6" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="p-2 border rounded-lg bg-white text-black dark:bg-gray-800 dark:text-white"
              />
              <span className="font-medium">
                {getDayOfWeek(selectedDate)} Trains
              </span>
            </div>

            {availableTrains.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No trains available on selected date
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {availableTrains.map((train) => (
                  <Card key={train.code}>
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{train.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {train.route} | {train.days.join(", ")}
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                          Train No: {train.code}
                        </p>
                      </div>
                      <Button
                        onClick={() => handleBooking()}
                        disabled={
                          parseInt(transportationTokens) < 1 || isPending
                        }
                        variant="outline"
                        className="hover:bg-gray-100 dark:hover:bg-gray-700" // Updated for dark mode hover
                      >
                        {isPending ? "Processing..." : "Book (1 Token)"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainBookingPage;
