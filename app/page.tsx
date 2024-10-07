'use client'
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { SignedIn, SignedOut, SignInButton, SignOutButton } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function Home() {

  const createFiles = useMutation(api.files.createFile);
  const allFiles = useQuery(api.files.getFiles);

  return (
    <>
      <div className="h-[100vh] bg-black flex items-center justify-center">

        <SignedOut>
          <SignInButton>
            <Button>Sign In</Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <SignOutButton>
            <Button>Sign Out</Button>
          </SignOutButton>
        </SignedIn>


        {allFiles?.map((file) => {
          return <div key={file._id}>
            {file.name}
          </div>
        })}
        <Button onClick={() => {

          createFiles({
            name: "hello world"
          })
        }}> Click me</Button>

      </div>
      <div className="flex items-center juscen"></div>


    </>
  );
}
