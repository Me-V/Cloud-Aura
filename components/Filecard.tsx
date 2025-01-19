"use client";
import {
  Button,
  Modal,
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
import { useToast } from "@chakra-ui/react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import Image from "next/image";
import { StarIcon, DownloadIcon } from "lucide-react";

export default function Filecard({ file }: { file: Doc<"files"> }) {
  const user = useUser();
  const organization = useOrganization();
  const getFileUrl = useQuery(api.files.list, {
    fileId: file.fileId as Id<"_storage">,
  });
  let orgId: string | undefined = undefined;
  const toast = useToast();
  const starFile = useMutation(api.files.starFile);
  const unstarFile = useMutation(api.files.unstarFile);
  const deleteFile = useMutation(api.files.deleteCron);
  const notDeleteFile = useMutation(api.files.notDeleteCron);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isImageModalOpen,
    onOpen: openImageModal,
    onClose: closeImageModal,
  } = useDisclosure();

  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  const onFav = () => {
    starFile({ fileId: file._id, orgId: orgId as string });
    toast({
      title: "File starred successfully",
      status: "success",
      duration: 1500,
      isClosable: true,
      position: "bottom-right",
    });
  };

  const onRemoveFav = () => {
    unstarFile({ fileId: file._id, orgId: orgId as string });
    toast({
      title: "File unstarred successfully",
      status: "success",
      duration: 1500,
      isClosable: true,
      position: "bottom-right",
    });
  };

  const onDel = () => {
    deleteFile({ fileId: file._id, orgId: orgId as string });
    toast({
      title: "File marked for deletion",
      status: "success",
      duration: 1500,
      isClosable: true,
      position: "bottom-right",
    });
  };

  const handleAllFilesDownload = async () => {
    if (!getFileUrl) {
        toast({
            title: "Unable to downlaod the file at the moment",
            description: "Please try again later.",
            status: "error",
            duration: 2000,
            isClosable: true,
            position: "bottom-right",
        });
        return;
    }

    try {
        // Fetch the file as a blob
        const response = await fetch(getFileUrl);
        if (!response.ok) {
            throw new Error("Failed to fetch file");
        }

        const blob = await response.blob(); // Get the file as a blob
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob); // Create an object URL
        link.download = file.name; // Set the filename for the download
        document.body.appendChild(link);
        link.click(); // Trigger the download
        document.body.removeChild(link); // Clean up the link

        toast({
            title: "Download started",
            description: `${file.name} is being downloaded.`,
            status: "success",
            duration: 1500,
            isClosable: true,
            position: "bottom-right",
        });
    } catch (error) {
        console.error("Download failed:", error);
        toast({
            title: "Download failed",
            description: "There was an error downloading the file.",
            status: "error",
            duration: 2000,
            isClosable: true,
            position: "bottom-right",
        });
    }
};


  const onNotDel = () => {
    notDeleteFile({ fileId: file._id, orgId: orgId as string });
    toast({
      title: "File Restored",
      status: "success",
      duration: 1500,
      isClosable: true,
      position: "bottom-right",
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
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button
              variant="solid"
              colorScheme="red"
              onClick={() => {
                setIsLoading(true);
                if (!orgId) return;
                onDel();
                setIsLoading(false);
              }}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Image Preview Modal */}
      <Modal isOpen={isImageModalOpen} onClose={closeImageModal} isCentered>
        <ModalOverlay />
        <ModalContent
          mx="4"
          bg="black"
          color="white"
          borderRadius="lg"
          border="3px solid white"
          maxH={["80vh", "90vh", "auto"]}
        >
          <ModalHeader className="text-4xl font-extrabold">
            {file.name}
          </ModalHeader>

          <ModalCloseButton
            _hover={{
              color: "white",
              transform: "scale(1.2)",
              transition: "transform 0.2s",
              backgroundColor: "red.500",
            }}
          />
          <ModalBody>
            <div className="flex justify-center pb-5">
              <Image
                src={getFileUrl ?? ""}
                width={250}
                height={250}
                alt={file.name}
                className="rounded-lg"
                style={{ maxHeight: "60vh", width: "auto" }}
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
          {file.type === "application/x-compressed" && (
            <Image
              src="/zip.svg"
              layout="fill"
              objectFit="contain"
              alt={file.name}
              className="p-4"
            />
          )}
          {file.type === "image/jpeg" && (
            <Image
              src={getFileUrl ?? ""}
              layout="fill"
              objectFit="cover"
              alt={file.name}
              className="rounded-t-lg cursor-pointer"
            />
          )}
          {file.type === "image/png" && (
            <Image
              src={getFileUrl ?? ""}
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
          {file.type ===
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" && (
            <Image
              src="/xlsx.svg"
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
            {file.isDeleted ? (
              <Button colorScheme="green" size="sm" onClick={onNotDel}>
                Restore
              </Button>
            ) : (
              <Button
                colorScheme="red"
                size="sm"
                onClick={onOpen} // Open the confirmation modal
                isLoading={isLoading}
              >
                Delete
              </Button>
            )}

            {(file.type === "image/jpeg" || file.type === "image/png") && (
              <Button colorScheme="blue" size="sm" onClick={openImageModal}>
                View
              </Button>
            )}

            {file.isStarred ? (
              <Button colorScheme="transparent" size="sm" onClick={onRemoveFav}>
                <StarIcon className="w-6 h-6 text-green-700 fill-current" />
              </Button>
            ) : (
              !file.isDeleted && (
                <Button colorScheme="transparent" size="sm" onClick={onFav}>
                  <StarIcon className="w-6 h-6 text-black" />
                </Button>
              )
            )}

            <Button
              colorScheme="transparent"
              size="sm"
              onClick={handleAllFilesDownload}
            >
              <DownloadIcon className="w-6 h-6 text-black" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
