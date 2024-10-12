'use client';
import {
    Button, Card, CardBody, Image, ButtonGroup, Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Box
} from "@chakra-ui/react";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { useToast } from '@chakra-ui/react'
import { Doc, Id } from "@/convex/_generated/dataModel";

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

    // const handleView = (fileId: string) => {

    //     //todo
    // }

    const letsToast = () => {
        toast({
            title: "File deleted successfully",
            status: "error",
            duration: 2000,
            isClosable: true,
            position: "bottom-right"
        });
    }


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

            <Box width={["100%", "50%", "33%", "25%"]} p={2}>
                <Card key={file._id} className="ml-3 h-[40vh] sm:h-[50vh] w-[80vw] sm:w-[25vw]">
                    <CardBody>
                        <div className="mt-4">
                            {file.type === "application/pdf" && (
                                <Image 
                                    src="/file-text.svg" 
                                    height={[130, 150, 150]}
                                    width={["80%", "90%", 280]}
                                    alt={file.name} 
                                    borderRadius='lg'
                                    mx="auto"
                                    display="block"
                                />
                            )}
                            {file.type === "image/jpeg" && (
                                <Image 
                                    src={getFileUrl ?? ''} 
                                    height={[130, 150, 200]}
                                    width={["80%", "90%", 280]}
                                    alt={file.name} 
                                    borderRadius='lg' 
                                    objectFit="cover" 
                                    mx="auto"
                                    display="block"
                                />
                            )}
                            {file.type === "text/csv" && (
                                <Image 
                                    src="/csv.png" 
                                    alt={file.name} 
                                    borderRadius='lg' 
                                    boxSize={["80px", "100px", "150px"]}
                                    mx="auto"
                                    display="block"
                                />
                            )}
                        </div>
                        <div className="mt-4">
                            {file.type === "image/jpeg" ? 
                                <p className="font-bold text-xl sm:text-2xl">{file.name}</p> : 
                                <p className="font-bold text-2xl sm:text-3xl mt-4 sm:mt-10">{file.name.split(".")[0]}</p>
                            }
                        </div>
                    </CardBody>
                    
                        <ButtonGroup marginLeft={5} marginBottom={6} spacing='3' width="100%" justifyContent="">
                            <Button variant='solid' colorScheme='blue' size={["sm", "md"]}>
                                View
                            </Button>
                            <Button
                                variant='solid'
                                colorScheme='red'
                                onClick={() => onOpen()}
                                isLoading={isLoading}
                                disabled={isLoading}
                                size={["sm", "md"]}
                            >
                                Delete
                            </Button>
                        </ButtonGroup>
                    
                </Card>
            </Box>
        </>
    );
}
