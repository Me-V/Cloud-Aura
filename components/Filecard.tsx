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
import { StarIcon, StarOffIcon } from "lucide-react";


export default function Filecard({ file }: { file: Doc<"files"> }) {

    const user = useUser();
    const organization = useOrganization();
    const deleteFiles = useMutation(api.files.deleteFile);
    const getFileUrl = useQuery(api.files.list, { fileId: file.fileId as Id<"_storage"> });
    let orgId: string | undefined = undefined;
    const toast = useToast();
    const starFile = useMutation(api.files.starFile);
    const unstarFile = useMutation(api.files.unstarFile);
    const [isLoading, setIsLoading] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isImageModalOpen, onOpen: openImageModal, onClose: closeImageModal } = useDisclosure();

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
    
    const openOtherFileModal = () => {
        window.open(getFileUrl ?? '', "_blank");
    };

    const onFav = () => {
        starFile({ fileId: file._id, orgId: orgId as string });
        toast({
            title: "File starred successfully",
            status: "success",
            duration: 1500,
            isClosable: true,
            position: "bottom-right"
        });
    };

    const onRemoveFav = () => {
        unstarFile({ fileId: file._id, orgId: orgId as string });
        toast({
            title: "File unstarred successfully",
            status: "success",
            duration: 1500,
            isClosable: true,
            position: "bottom-right"
        });
    };

    return (
        <>
            {/* Confirmation Modal for Deleting Files */}
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

            {/* Image Preview Modal */}
            <Modal isOpen={isImageModalOpen} onClose={closeImageModal} isCentered>
                <ModalOverlay />
                <ModalContent mx="4" bg="black" color="white" borderRadius="lg" border="3px solid white" maxH={["80vh", "90vh", "auto"]}>
                    <ModalHeader className="text-4xl font-extrabold">{file.name}</ModalHeader>
                    
                    <ModalCloseButton 
                        _hover={{ 
                            color: 'white',
                            transform: 'scale(1.2)',
                            transition: 'transform 0.2s',
                            backgroundColor: 'red.500'
                        }} 
                    /> 
                    <ModalBody>
                            <div className="flex justify-center pb-5">
                                <Image 
                                    src={getFileUrl ?? ''} 
                                    width={250}
                                    height={250}
                                    alt={file.name} 
                                    className="rounded-lg"
                                    style={{ maxHeight: '60vh', width: 'auto' }}
                                />
                            </div>
                    </ModalBody>
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
                            className="rounded-t-lg cursor-pointer"
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
                    <div className="mt-4 flex gap-3 items-center">
                        <Button
                            colorScheme="red"
                            size="sm"
                            onClick={onOpen} // Open the confirmation modal
                            isLoading={isLoading}
                        >
                            Delete
                        </Button>
                        <Button
                            colorScheme="blue"
                            size="sm"
                            onClick={file.type === "image/jpeg" ? openImageModal : openOtherFileModal}
                        >
                            View
                        </Button>
                        {/* <button onClick={onFav}>
                            {file.isStarred ? <MoonStarIcon className="w-6 h-6" /> : <StarIcon className="w-6 h-6" />}  
                        </button> */}

                        {file.isStarred ? (
                            <Button
                                colorScheme="transparent"
                                size="sm"
                                onClick={onRemoveFav}
                            >
                                <StarOffIcon className="w-6 h-6 text-black" />
                            </Button>
                        ): (
                            <Button
                                colorScheme="transparent"
                                size="sm"
                                onClick={onFav}
                            >
                                <StarIcon className="w-6 h-6 text-black" />
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
