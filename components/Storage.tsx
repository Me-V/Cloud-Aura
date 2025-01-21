"use client";
import React from "react";
import { useQuery } from "convex/react";
import { useOrganization, useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import {  Progress } from "@chakra-ui/react"; // Import Chakra UI components

const StorageUsage = () => {
  const user = useUser();
  const organization = useOrganization();
  let orgId: string | undefined = undefined;

  // Fetch storage usage for the organization
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  const storageUsage = useQuery(
    api.files.getStorageInfo,
    orgId ? { orgId } : "skip"
  );

  if (!storageUsage) {
    return <div>Loading...</div>; // Display a loading state
  }

  const storageUsed = (storageUsage.totalStorage || 0) / (1024 * 1024); // Convert to MB
  const storageLimit = 1024; // Convert to MB
  const usagePercentage = (storageUsed / storageLimit) * 100;

  return (
    <div className="storage-usage">
      <p className="font-normal">{storageUsed.toFixed(2)} MB / 1 GB</p>
      <Progress
        value={usagePercentage}
        colorScheme="teal"
        size="lg"
        hasStripe
        isAnimated
      />

      <p className="font-bold">{usagePercentage.toFixed(2)}% of your storage is used.</p> 
    </div>
  );
};

export default StorageUsage;
