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
    Box, Flex
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

            <Box width={["100%", "50%", "33%", "25%"]} p={2}>
                <Card key={file._id} className="ml-3 h-[50vh] w-[80vw] sm:h-[50vh] sm:w-[25vw]">
                    <CardBody>
                        <Flex direction="column" align="center" justify="center" height="100%">
                            {file.type === "application/pdf" && <Image src="/file-text.svg" boxSize={["100px", "150px"]} alt={file.name} borderRadius='lg' />}
                            {file.type === "image/jpeg" && <Image src="" alt={file.name} borderRadius='lg' objectFit="cover" boxSize={["100px", "150px"]} />}
                            {file.type === "text/csv" && <Image src="/csv.png" alt={file.name} borderRadius='lg' boxSize={["100px", "150px"]} />}
                            <Box mt={4} textAlign="center">
                                <p className="font-bold text-lg">{file.name}</p>
                            </Box>
                        </Flex>
                    </CardBody>
                    <CardFooter>
                        <ButtonGroup spacing='3' width="100%" justifyContent="center">
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
                    </CardFooter>
                </Card>
            </Box>
        </>
    );
}
