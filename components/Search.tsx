'use client'
import { useState, Dispatch, SetStateAction } from 'react';
import {
    Input,
    FormControl,
} from "@chakra-ui/react";
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

        </>
    )
}

export default Search
