'use client';
import { Button, Card, CardBody, CardFooter, Image, ButtonGroup } from "@chakra-ui/react";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";


export default function Home() {
  const user = useUser();
  const organization = useOrganization();
  const createFiles = useMutation(api.files.createFile);

  let orgId: string | undefined = undefined;

  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  const allFiles = useQuery(api.files.getFiles, orgId ? { orgId } : "skip");

  return (
    <>
      <div className="h-[100vh] bg-black flex flex-col p-10">
        <div className="flex justify-between items-center pb-5">
          <h1 className="text-white text-5xl">Your Files</h1>
          <Button 
            onClick={() => {
              if (!orgId) return;  
              createFiles({ name: "hello world", orgId });
            }} 
            colorScheme="blue"
            variant="solid"
          >
            Upload
          </Button>
        </div>

        <Card maxW='sm'>
          <CardBody>
            <Image
              src='https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'
              alt='Green double couch with wooden legs'
              borderRadius='lg'
            />
          </CardBody>
          <CardFooter>
            <ButtonGroup spacing='2'>
              <Button variant='solid' colorScheme='blue'>
                View
              </Button>
            </ButtonGroup>
          </CardFooter>
        </Card>
        
      </div>
    </>
  );
}
