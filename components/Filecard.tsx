'use client';
import {
    Button, Card, CardBody, CardFooter, Image, ButtonGroup, Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
} from "@chakra-ui/react";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { useToast } from '@chakra-ui/react'
import { Doc } from "@/convex/_generated/dataModel";

export default function Filecard({ file }: { file: Doc<"files"> }) {
    const user = useUser();
    const organization = useOrganization();
    const deleteFiles = useMutation(api.files.deleteFile);
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

            <Card key={file._id} maxW='sm'>
                <CardBody>
                    <Image
                        src='https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'
                        alt={file.name}
                        borderRadius='lg'
                    />
                    <p>{file.name}</p>
                </CardBody>
                <CardFooter>
                    <ButtonGroup spacing='2'>
                        <Button variant='solid' colorScheme='blue' onClick={() => handleView(file._id)}>
                            View
                        </Button>
                        <Button
                            variant='solid'
                            colorScheme='red'
                            onClick={() => onOpen()}
                            isLoading={isLoading}
                            disabled={isLoading}
                        >
                            Delete
                        </Button>
                    </ButtonGroup>
                </CardFooter>
            </Card>
        </>
    );
}
