"use client"
import React from 'react'
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useOrganization } from '@clerk/nextjs';
import { useUser } from '@clerk/nextjs';
import Filecard from '@/components/Filecard';
import Loader from '@/components/Loader';
import Image from 'next/image';
import Header from '@/components/Header';


const favourites = () => {

  const user = useUser();
  const organization = useOrganization();
  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  const starredFiles = useQuery(api.files.getStarredFiles, {
    orgId: orgId as string,
  });


  if (!starredFiles) {
    return <Loader />;
  }

  return (
    <div className='min-h-screen bg-black'>
      <div className="sticky top-0 z-50 h-16 bg-black shadow-md"><Header /></div>
      <div className="h-[100px] flex flex-col sm:flex-row justify-between items-center pb-5 gap-4 px-4">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-normal bg-gradient-to-br from-blue-500 via-green-400 to-yellow-300 bg-clip-text text-transparent text-center sm:text-left">
          
          Starred Files
        </h1>
        {/* Uncomment if you want to add an upload button */}
        {/* <UploadButton /> */}
      </div>


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {starredFiles.length > 0 ? (
          starredFiles.map((file) => (
           <div className='pb-10 px-4'> <Filecard key={file._id} file={file} /></div>
          ))
        ) : (
          <div className="flex flex-col justify-center w-[100vw] items-center h-[50vh] sm:h-[90vh] md:h-[70vh]">
            <Image src="/noFiles.svg" alt="No files" width={400} height={400} className="w-full max-w-[200px] sm:max-w-[300px] md:max-w-[400px]" />
            <p className="text-lg text-white sm:text-xl md:text-2xl font-bold text-center mt-6 sm:mt-8 md:mt-10">No starred files found</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default favourites