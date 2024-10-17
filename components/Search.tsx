'use client'
import { useState, Dispatch, SetStateAction } from 'react';
import {
    Button,
    Input,
    FormControl,
} from "@chakra-ui/react";
import { SearchIcon } from 'lucide-react';

const Search = ({ query, setSearchQuery }: { query: string, setSearchQuery: Dispatch<SetStateAction<string>> }) => {

    
    const [fileName, setFileName] = useState('');   
    


    const handleSearch = async () => {
       setSearchQuery(fileName);
    };

    return (
        <>

            <FormControl isRequired>
                <Input
                    className="text-white w-[150px]"   
                    value={fileName}
                    onChange={(e) => {
                        setFileName(e.target.value);
                    }}
                    placeholder={query ? query : "Search"} 
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSearch();
                        }
                    }}
                />
            </FormControl>

            <Button
                colorScheme="blue"
                mr={3}
                onClick={handleSearch}
                // isLoading={isLoading}
                // disabled={isLoading}
            >
                <SearchIcon />
            </Button>
        </>
    )
}

export default Search
