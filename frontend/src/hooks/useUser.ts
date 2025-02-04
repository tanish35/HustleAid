import axios from "axios";
import { useEffect, useState } from "react";

interface UserDetails {
  userId: string;
  name: string;
  email: string;
  isVerified: boolean;
  walletId?: string | null;
  panNo?: string | null;
  createdAt: string | Date;
}

export const useUser = () => {
  const [loadingUser, setLoadingUser] = useState(true);
  const [userDetails, setUserDetails] = useState<UserDetails>();

  async function getDetails() {
    try {
      const res = await axios.get("/auth/me", {
        withCredentials: true,
      });
      setUserDetails(res.data);
      setLoadingUser(false); // Move setLoading inside try block to ensure it's always set
    } catch (err) {
      console.log(err);
      setLoadingUser(false); // Set loading to false in case of error
    }
  }

  async function updateUserDetails() {
    try {
      const res = await axios.post("/profile/update", {
        ...userDetails,
      });
      setUserDetails(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getDetails();
  }, []);

  useEffect(() => {
    if (userDetails) {
      console.log("User details:", userDetails);
    }
  }, [userDetails]); // Log userDetails whenever it changes

  return { loadingUser, userDetails, updateUserDetails };
};
