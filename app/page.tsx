'use client'
import { Button } from "@/components/ui/button";
import { OrganizationSwitcher, SignedIn, SignedOut, SignInButton, SignOutButton, UserButton, useOrganization, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";

export default function Home() {
  
  const user = useUser();
  const organization = useOrganization();
  const createFiles = useMutation(api.files.createFile);
  
  let orgId: string | undefined = undefined;

  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }
    
  const allFiles = useQuery(api.files.getFiles, orgId ? { orgId } : "skip");  

  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <>
      <div className="h-[100vh] bg-black flex flex-col">
        <div className="relative p-4 px-5">
          <Button onClick={() => setDropdownOpen(!dropdownOpen)} className="bg-gray-700 text-white">
            Menu
          </Button>
          {dropdownOpen && (
            <div className="absolute left-0 mt-2 bg-gray-800 rounded shadow-lg p-4">
              <OrganizationSwitcher />
              <div className="flex flex-col py-1 items-center mt-2">
                <SignedOut>
                  <SignInButton>
                    <Button className="mr-2">Sign In</Button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <SignOutButton>
                    <div className="py-2"><Button>Sign Out</Button></div>
                  </SignOutButton>
                </SignedIn>
                <UserButton/>
              </div>
            </div>
          )}
        </div>

        <div className="flex-grow flex flex-col items-center justify-center">
          {allFiles?.map((file) => (
            <div className="text-white" key={file._id}>
              {file.name}
            </div>
          ))}
          <Button onClick={() => {
            if (!orgId) return;  
            createFiles({ name: "hello world", orgId });
          }}>
            Click me
          </Button>
        </div>
      </div>
    </>
  );
}
