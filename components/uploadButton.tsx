import { useState, useRef } from 'react';
import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    FormControl,
    FormLabel,
    Input,
    Text,
    CircularProgress,
    CircularProgressLabel,
    Flex,
    Tooltip,
} from "@chakra-ui/react";
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useOrganization, useUser } from '@clerk/nextjs';
import { useToast } from '@chakra-ui/react'
import { FileType } from '@/convex/schema';


const UploadButton = () => {
    const toast = useToast();
    const createFiles = useMutation(api.files.createFile);
    const user = useUser();
    const organization = useOrganization();
    let orgId: string | undefined = undefined;

    if (organization.isLoaded && user.isLoaded) {
        orgId = organization.organization?.id ?? user.user?.id;
    }

    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [fileName, setFileName] = useState('');
    // const [fileType, setFileType] = useState('');
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const generateUploadUrl = useMutation(api.files.generateUploadUrl);
    const [isFormValid, setIsFormValid] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const onOpen = () => setIsOpen(true);
    const onClose = () => {
        setIsOpen(false);
        setFileName('');
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const validateForm = () => {
        const isValid = fileName.trim() !== '' && fileInputRef.current?.files?.[0] !== undefined;
        setIsFormValid(isValid);
    };

    const handleSubmit = async () => {
        setError(null);
        setIsLoading(true);
        if (!orgId) return;

        if (!fileName.trim()) {
            setError("File name is required");
            return;
        }

        if (!fileInputRef.current?.files?.[0]) {
            setError("Please select a file to upload");
            return;
        }

        const postUrl = await generateUploadUrl();

        const xhr = new XMLHttpRequest();
        xhr.open("POST", postUrl);
        xhr.setRequestHeader("Content-Type", fileInputRef.current!.files![0].type);

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const percentComplete = (event.loaded / event.total) * 100;
                setUploadProgress(percentComplete);
            }
        };

        xhr.onload = async () => {
            if (xhr.status === 200) {
                const { storageId } = JSON.parse(xhr.responseText);
                await createFiles({ name: fileName, orgId, fileId: storageId, type: fileInputRef.current!.files![0].type as FileType });
                onClose();
                setIsLoading(false);
                setFileName('');
                setUploadProgress(0);
                setError(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }

                toast({
                    title: "File uploaded successfully",
                    status: "success",
                    duration: 2000,
                    isClosable: true,
                    position: "bottom-right"
                });
            } else {
                setError("Failed to upload file");
                toast({
                    title: "Failed to upload file",
                    status: "error",
                    duration: 2000,
                    isClosable: true,
                    position: "bottom-right"
                });
            }
        };

        xhr.onerror = () => {
            setError("Failed to upload file");
            toast({
                title: "Failed to upload file",
                status: "error",
                duration: 2000,
                isClosable: true,
                position: "bottom-right"
            });
        };

        xhr.send(fileInputRef.current!.files![0]);
    };

    return (
        <>
            <Tooltip label="Upload" placement="top">
                <Button
                    onClick={onOpen}
                    position="fixed"
                    bottom={["30px", "50px"]}
                    right={["30px", "50px"]}
                    zIndex="sticky"
                    boxShadow="lg"
                    aria-label="Upload File"
                    borderRadius="full"
                    width={["60px", "75px"]}
                    height={["60px", "75px"]}
                    bgGradient="linear(to-br, blue.500, green.400, yellow.300)"
                    _hover={{
                        bgGradient: "linear(to-br, blue.600, green.500, yellow.400)"
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width={30} height={30} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                </Button>
            </Tooltip>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Upload File</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>

                        <FormControl mt={4} isRequired isInvalid={!!error}>
                            <FormLabel>Select File</FormLabel>
                            <Input
                                type="file"
                                ref={fileInputRef}
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        // setFileName(file.name);
                                        // setFileType(file.type);
                                        validateForm();
                                    } 
                                }}
                            />
                        </FormControl>

                        <FormControl isRequired isInvalid={!!error}>
                            <FormLabel>File Name</FormLabel>
                            <Input
                                value={fileName}
                                onChange={(e) => {
                                    setFileName(e.target.value);
                                    validateForm();
                                }}
                                placeholder="Enter file name"
                            />
                        </FormControl>
                        {error && (
                            <Text color="red.500" mt={2}>
                                {error}
                            </Text>
                        )}
                        
                    </ModalBody>

                    <ModalFooter>
                    
                            <Flex alignItems="center" justifyContent="flex-end" mt={2}>
                                <Button
                                    colorScheme="blue"
                                    mr={3}
                                    onClick={handleSubmit}
                                    isLoading={isLoading}
                                    disabled={isLoading || !isFormValid}
                                >
                                    Submit
                                </Button>
                                </Flex>
                                {uploadProgress > 0 && uploadProgress < 100 && (
                                <CircularProgress value={uploadProgress} color="blue.400" size="50px" thickness="4px">
                                    <CircularProgressLabel fontSize="xs">{`${Math.round(uploadProgress)}%`}</CircularProgressLabel>
                                </CircularProgress>
                            
                        )}
                        <Button variant="ghost" onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default UploadButton
