import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { UserDetails } from "@/shared/types";

export const useUser = () => {
  const [loadingUser, setLoadingUser] = useState(true);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

  const getDetails = useCallback(async () => {
    try {
      const res = await axios.get<UserDetails>("/auth/me", {
        withCredentials: true,
      });
      setUserDetails({
        ...res.data,
        createdAt: new Date(res.data.createdAt),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingUser(false);
    }
  }, []);

  const updateUserDetails = useCallback(async (data: Partial<UserDetails>) => {
    try {
      const res = await axios.post<UserDetails>("/profile/update", data, {
        withCredentials: true,
      });
      setUserDetails((prev) => ({
        ...prev,
        ...res.data,
        createdAt: new Date(res.data.createdAt),
      }));
      return res.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }, []);

  useEffect(() => {
    getDetails();
  }, [getDetails]);

  return { loadingUser, userDetails, updateUserDetails, setUserDetails };
};
