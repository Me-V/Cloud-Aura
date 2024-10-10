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
} from "@chakra-ui/react";
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useOrganization, useUser } from '@clerk/nextjs';
import { useToast } from '@chakra-ui/react'


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
    const [fileType, setFileType] = useState('');
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const generateUploadUrl = useMutation(api.files.generateUploadUrl);
    const [isFormValid, setIsFormValid] = useState(false);

    const onOpen = () => setIsOpen(true);
    const onClose = () => setIsOpen(false);

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

        const result = await fetch(postUrl, {
            method: "POST",
            headers: { "Content-Type": fileInputRef.current!.files![0].type },
            body: fileInputRef.current!.files![0],
        });
        
        const { storageId } = await result.json(); 

        if(result.ok) {
            await createFiles({ name: fileName, orgId, fileId: storageId });
            onClose();
            setIsLoading(false);
            setFileName('');
            setFileType('');
            setError(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }

            toast({
                title: "File uploaded successfully",
                status: "success",
                duration: 2000,
                isClosable: true,
                position:"bottom-right"
            });
        } else {
            setError("Failed to upload file");
            toast({
                title: "Failed to upload file",
                status: "error",
                duration: 2000,
                isClosable: true,
                position:"bottom-right"
            });
        }
    };

    return (
        <>
            <Button onClick={onOpen}>Upload File</Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Upload File</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
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
                        <FormControl mt={4} isRequired isInvalid={!!error}>
                            <FormLabel>Select File</FormLabel>
                            <Input
                                type="file"
                                ref={fileInputRef}
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        setFileName(file.name);
                                        setFileType(file.type);
                                    }
                                    validateForm();
                                }}
                            />
                        </FormControl>
                        {error && (
                            <Text color="red.500" mt={2}>
                                {error}
                            </Text>
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button 
                            colorScheme="blue" 
                            mr={3} 
                            onClick={handleSubmit} 
                            isLoading={isLoading} 
                            disabled={isLoading || !isFormValid}
                        >
                            Submit
                        </Button>
                        <Button variant="ghost" onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default UploadButton