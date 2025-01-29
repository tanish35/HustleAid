import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { useAccount, useReadContract } from "wagmi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft } from "lucide-react";

const CONTRACT_ADDRESS: `0x${string}` =
  (import.meta.env.VITE_CONTRACT_ADDRESS as `0x${string}`) || "0x";

const TOKEN_TYPES = [
  { id: 1, name: "Loan" },
  { id: 2, name: "Food" },
  { id: 3, name: "Healthcare" },
  { id: 4, name: "Transportation" },
];

interface Transaction {
  vendor: string;
  amount: bigint;
  timestamp: bigint;
}

interface Vendor {
  name: string;
  walletAddress: string;
}

export default function TransactionDetails() {
  const { tokenType } = useParams<{ tokenType: string }>();
  const safeTokenType = Number(tokenType) || 0;
  const { address } = useAccount();
  const [vendors, setVendors] = useState<Record<string, Vendor>>({});

  const { data: transactions, isLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: [
      {
        inputs: [
          { internalType: "address", name: "owner", type: "address" },
          { internalType: "uint256", name: "tokenType", type: "uint256" },
        ],
        name: "getTransactionsByType",
        outputs: [
          {
            components: [
              { internalType: "address", name: "vendor", type: "address" },
              { internalType: "uint256", name: "amount", type: "uint256" },
              { internalType: "uint256", name: "timestamp", type: "uint256" },
            ],
            internalType: "struct SubsidyToken.Transaction[]",
            name: "",
            type: "tuple[]",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ],
    functionName: "getTransactionsByType",
    args: [address!, BigInt(safeTokenType)],
  }) as { data: Transaction[] | undefined; isLoading: boolean };

  useEffect(() => {
    const fetchVendors = async () => {
      if (transactions) {
        const vendorAddresses = [
          ...new Set(transactions.map((tx) => tx.vendor)),
        ];
        const vendorData: Record<string, Vendor> = {};

        for (const address of vendorAddresses) {
          try {
            const response = await axios.get(`/vendor/${address}`);
            vendorData[address] = response.data;
          } catch (error) {
            console.error(`Error fetching vendor data for ${address}:`, error);
            vendorData[address] = {
              name: "Unknown Vendor",
              walletAddress: address,
            };
          }
        }

        setVendors(vendorData);
      }
    };

    fetchVendors();
  }, [transactions]);

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) * 1000).toLocaleString();
  };

  // const formatAddress = (address: string) => {
  //   return `${address.slice(0, 6)}...${address.slice(-4)}`;
  // };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        to="/tokens"
        className="inline-flex items-center mb-6 text-primary hover:text-primary/80 transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Tokens
      </Link>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {TOKEN_TYPES.find((t) => t.id === Number(tokenType))?.name} Token
            Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading transactions...</div>
          ) : transactions && transactions.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Link
                        to={`/vendor/${tx.vendor}`}
                        className="text-primary hover:underline"
                      >
                        {vendors[tx.vendor]?.name || "Loading..."}
                      </Link>
                    </TableCell>
                    <TableCell>{tx.amount.toString()}</TableCell>
                    <TableCell>{formatDate(tx.timestamp)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-4">
              No transactions found for this token type.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
