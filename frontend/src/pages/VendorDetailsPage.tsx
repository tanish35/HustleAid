// VendorDetails.tsx
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Vendor {
  vendorId: string;
  walletAddress: string;
  name: string;
  email: string;
  phone: string;
  description?: string;
  gstin?: string;
  rating?: number;
  createdAt: string;
  updatedAt: string;
}

export default function VendorDetails() {
  const { walletAddress } = useParams<{ walletAddress: string }>();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendorDetails = async () => {
      try {
        const response = await axios.get(`/vendor/${walletAddress}`);
        setVendor(response.data);
      } catch (error) {
        console.error("Error fetching vendor details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVendorDetails();
  }, [walletAddress]);

  if (loading) {
    return <div className="text-center py-8">Loading vendor details...</div>;
  }

  if (!vendor) {
    return <div className="text-center py-8">Vendor not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        to="/tokens"
        className="inline-flex items-center mb-6 text-primary hover:text-primary/80 transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Transactions
      </Link>
      <Card>
        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
          <Avatar className="h-16 w-16 mr-4">
            <AvatarImage src="/placeholder-logo.png" alt={vendor.name} />
            <AvatarFallback>
              {vendor.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl font-bold">{vendor.name}</CardTitle>
            {vendor.rating && (
              <Badge variant="secondary" className="mt-1">
                Rating: {vendor.rating.toFixed(1)}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900">{vendor.email}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Phone</dt>
              <dd className="mt-1 text-sm text-gray-900">{vendor.phone}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">
                Wallet Address
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {vendor.walletAddress}
              </dd>
            </div>
            {vendor.gstin && (
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">GSTIN</dt>
                <dd className="mt-1 text-sm text-gray-900">{vendor.gstin}</dd>
              </div>
            )}
            {vendor.description && (
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">
                  Description
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {vendor.description}
                </dd>
              </div>
            )}
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Joined</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(vendor.createdAt).toLocaleDateString()}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">
                Last Updated
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(vendor.updatedAt).toLocaleDateString()}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
