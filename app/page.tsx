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
  
  //show a loader until allFiles is loaded
  if (!allFiles) {
    return <Loader />;
  } 

  return (
    <div className="min-h-screen bg-black">
      <div className="sticky top-0 z-50 h-16 pt-3"><Header /></div>
      
      <main className="flex flex-col px-4 sm:px-6 md:px-10 py-4 sm:py-6 md:py-10 max-w-full overflow-x-hidden">
        <div className="flex flex-row sm:flex-row justify-between items-center pb-5 gap-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-normal bg-gradient-to-br from-blue-500 via-green-400 to-yellow-300 bg-clip-text text-transparent text-center sm:text-left">Your Files
          </h1>
          <UploadButton />
        </div>
        
        {allFiles && allFiles.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
            {allFiles.map((file) => (
              <Filecard key={file._id} file={file} />
            ))}
          </div>
        )}

        {allFiles && allFiles.length === 0 && (
          <div className="flex flex-col justify-center items-center h-[50vh] sm:h-[60vh] md:h-[70vh]">
            <Image src="/noFiles.svg" alt="No files" width={300} height={300} className="w-full max-w-[200px] sm:max-w-[300px] md:max-w-[400px]" />
            <p className="text-white text-lg sm:text-xl md:text-2xl font-bold text-center mt-6 sm:mt-8 md:mt-10">No files found</p>
          </div>
        )}
      </main>
    </div>
  );
}
