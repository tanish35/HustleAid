import expressAsyncHandler from "express-async-handler";
import prisma from "../lib/prisma";
import { ethers } from "ethers";
import { abi } from "../lib/abi";

const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || "";
const RPC_URL = process.env.RPC_URL;

export const getVendors = expressAsyncHandler(async (req: any, res: any) => {
  const vendors = await prisma.vendor.findMany();
  res.json(vendors);
});

export const getVendorById = expressAsyncHandler(async (req: any, res: any) => {
  const { walletAddress } = req.params;
  const vendor = await prisma.vendor.findUnique({
    where: {
      walletAddress,
    },
  });

  if (!vendor) {
    return res.status(404).json({ message: "Vendor not found" });
  }

  res.json(vendor);
});

export const addApprovedVendor = expressAsyncHandler(
  async (req: any, res: any) => {
    const { walletAddress, name, email, phone, description } = req.body;
    const vendor = await prisma.vendor.create({
      data: {
        walletAddress,
        name,
        email,
        phone,
        description,
      },
    });

    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const signer = new ethers.Wallet(PRIVATE_KEY, provider);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

    const tx = await contract.addApprovedVendor(walletAddress);
    await tx.wait();
    res.json({ vendor, transactionHash: tx.hash });
  }
);
