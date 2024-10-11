'use client';
import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import UploadButton from "@/components/uploadButton";
import Filecard from "@/components/Filecard"
import Image from "next/image";
import Header from "@/components/Header";
import Landing from "@/components/Landing";
import Loader from "@/components/Loader";

export default function Home() {
  const user = useUser();
  const organization = useOrganization();
  let orgId: string | undefined = undefined;
  
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }
  
  const allFiles = useQuery(api.files.getFiles, orgId ? { orgId } : "skip");
  
  if (!user.isLoaded) {
    return <Loader />;
  }
  

  if (!user.isSignedIn) {
    return (
      <Landing />
    );
  }

  return (
    <>
      <div className="bg-black"><Header /></div>
      <div className="min-h-screen bg-black flex flex-col p-10">
        <div className="flex justify-between items-center pb-5">
          <h1 className="text-white text-4xl sm:text-6xl font-extrabold tracking-normal">Your Files</h1>
          <UploadButton />
        </div>
        
        {allFiles && allFiles.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mt-5">
            {allFiles.map((file) => (
              <Filecard key={file._id} file={file} />
            ))}
          </div>
        )}

        {/* if no files show this */}
        {allFiles && allFiles.length === 0 && (
          <div className="flex flex-col justify-center items-center h-[70vh]">
            <Image src="/noFiles.svg" alt="No files" width={500} height={500} />
            <p className="text-white text-2xl font-bold text-center mt-10 ">No files found</p>
          </div>
        )}
      </div>
    </>
  );
}
