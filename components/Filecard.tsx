'use client';
import {
    Button, Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
} from "@chakra-ui/react";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { useToast } from '@chakra-ui/react'
import { Doc, Id } from "@/convex/_generated/dataModel";
import Image from 'next/image';

export default function Filecard({ file }: { file: Doc<"files"> }) {
    const user = useUser();
    const organization = useOrganization();
    const deleteFiles = useMutation(api.files.deleteFile);
    const getFileUrl = useQuery(api.files.list, { fileId: file.fileId as Id<"_storage"> });
    let orgId: string | undefined = undefined;
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();

    if (organization.isLoaded && user.isLoaded) {
        orgId = organization.organization?.id ?? user.user?.id;
    }

    const letsToast = () => {
        toast({
            title: "File deleted successfully",
            status: "error",
            duration: 2000,
            isClosable: true,
            position: "bottom-right"
        });
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Please Confirm</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <p>Are You Sure You Want To Delete This File?</p>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                        <Button
                            variant='solid'
                            colorScheme='red'
                            onClick={() => {
                                setIsLoading(true);
                                if (!orgId) return;
                                deleteFiles({ id: file._id, orgId });
                                setIsLoading(false);
                                letsToast();
                            }}
                        >
                            Delete</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <div className="h-auto w-full max-w-sm mx-auto border rounded-lg bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                <div className="relative h-48 bg-gray-100">
                    {file.type === "application/pdf" && (
                        <Image 
                            src="/file-text.svg" 
                            layout="fill"
                            objectFit="contain"
                            alt={file.name} 
                            className="p-4"
                        />
                    )}
                    {file.type === "image/jpeg" && (
                        <Image 
                            src={getFileUrl ?? ''} 
                            layout="fill"
                            objectFit="cover"
                            alt={file.name} 
                            className="rounded-t-lg"
                        />
                    )}
                    {file.type === "text/csv" && (
                        <Image 
                            src="/csv.png" 
                            layout="fill"
                            objectFit="contain"
                            alt={file.name} 
                            className="p-4"
                        />
                    )}
                </div>
                <div className="p-4">
                    <h2 className="font-bold text-xl truncate">{file.name}</h2>
                    {/* <p className="text-sm text-gray-600 mt-1">{file.type}</p> */}
                    <div className="mt-4 flex justify-between items-center">
                        {/* <span className="text-sm text-gray-500">
                            {new Date(file._creationTime).toLocaleDateString()}
                        </span> */}
                        <Button
                            colorScheme="red"
                            size="sm"
                            onClick={() => {
                                onOpen(); // Open the confirmation modal
                            }}
                            isLoading={isLoading}
                        >
                            Delete
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
