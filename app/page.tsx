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
import { useState } from "react";
import Search from "@/components/Search";
import Link from "next/link";
import { Doc } from "@/convex/_generated/dataModel";
import { Filter } from "lucide-react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Box,
} from '@chakra-ui/react';

export default function Home() {
  const user = useUser();
  const organization = useOrganization();
  let orgId: string | undefined = undefined;
  const [searchQuery, setSearchQuery] = useState('');
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  const [isImagesOnly, setIsImagesOnly] = useState(false);
  const [isFilesOnly, setIsFilesOnly] = useState(false);

  const allFiles = useQuery(api.files.getFiles, orgId ? { orgId, query: searchQuery } : "skip");

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

  function reduceFileCount(files: Doc<"files">[]) {
    return files.filter((file) => !file.isDeleted).length;
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="sticky top-0 z-50 h-16"><Header /></div>

      <main className="flex flex-col px-4 sm:px-6 md:px-10 py-4 sm:py-6 md:py-10 max-w-full overflow-x-hidden">
        <div className="flex flex-row sm:flex-row justify-between items-center pb-5 gap-4">
          <h1 className="text-3xl h-10 sm:h-20 sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-normal bg-gradient-to-br from-blue-500 via-green-400 to-yellow-300 bg-clip-text text-transparent text-center sm:text-left">
            <Link href="" onClick={() => {
              setSearchQuery('');
              setIsImagesOnly(false);
              setIsFilesOnly(false);
            }} className="text-[1.5rem] sm:text-[3rem]">{isImagesOnly ? "Images Only" : isFilesOnly ? "Files Only" : "Your Files"}</Link>
          </h1>
          <UploadButton />
          <div className="w-[120px] sm:w-[100px] md:w-[250px] flex justify-end gap-2 sm:gap-4"><Search query={searchQuery} setSearchQuery={setSearchQuery} />
            <Box>
              <Menu>
                <MenuButton
                  as={IconButton}
                  aria-label="Options"
                  icon={<Filter className="size-7 sm:size-8" />}
                  variant="unstyled"
                  color="white" 
                  size="sm"
                  _hover={{}}
                  _active={{}}
                  style={{ cursor: 'pointer' }}
                />
                <MenuList className="mt-2" bg="black" color="white">
                  <MenuItem onClick={() => { setIsImagesOnly(false); setIsFilesOnly(false) }} color="white" backgroundColor={!isImagesOnly && !isFilesOnly ? 'gray.600' : 'black'}>All</MenuItem>
                  <MenuItem onClick={() => { setIsImagesOnly(true); setIsFilesOnly(false) }} color="white" backgroundColor={isImagesOnly ? 'gray.600' : 'black'}>Images</MenuItem>
                  <MenuItem onClick={() => { setIsImagesOnly(false); setIsFilesOnly(true) }} color="white" backgroundColor={isFilesOnly ? 'gray.600' : 'black'}>Files</MenuItem>
                </MenuList>
              </Menu>
            </Box>
          </div>
        </div>

        {!isImagesOnly && !isFilesOnly && allFiles && allFiles.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">

            {allFiles.filter((file) => !file.isDeleted).map((file) => (
              <Filecard key={file._id} file={file} />
            ))}
          </div>
        )}

        {isImagesOnly && !isFilesOnly && allFiles && allFiles.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
            {allFiles.filter((file) => !file.isDeleted && (file.type === "image/jpeg" || file.type === "image/png")).map((file) => (
              <Filecard key={file._id} file={file} />
            ))}
          </div>
        )}


        {isFilesOnly && !isImagesOnly && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
            {allFiles.filter((file) => !file.isDeleted && (file.type === "application/pdf" || file.type === "application/x-compressed" || file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")).map((file) => (
              <Filecard key={file._id} file={file} />
            ))}
          </div>
        )}
        
         

        {reduceFileCount(allFiles) === 0 && (
          <div className="flex flex-col justify-center items-center h-[50vh] sm:h-[90vh] md:h-[90vh]">
            <Image src="/noFiles.svg" alt="No files" width={300} height={300} className="w-full max-w-[200px] sm:max-w-[300px] md:max-w-[400px]" />
            <p className="text-white text-lg sm:text-xl md:text-2xl font-bold text-center mt-6 sm:mt-8 md:mt-10">No files found</p>
          </div>
        )}
      </main>
    </div>
  );
}
