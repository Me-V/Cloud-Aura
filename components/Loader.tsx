import { Spinner} from '@chakra-ui/react'

const Loader = () => {
    return (
        <>
            <div className="flex justify-center items-center bg-black h-screen">
                <Spinner size="xl" borderWidth="4px" color="white" />
                <p className="text-white text-2xl font-semibold p-4">Loading...</p>
            </div>
        </>
    )
}

export default Loader