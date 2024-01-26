import { useState } from 'react'

import { fetchFilePaths } from '../Http/http.js';
import { ListPanelPropsObject } from '../Types/types.tsx'

import { FilePathSearchBar } from './FilePathSearchBar.tsx'
import { FileListings } from './FileListings.tsx'


export function ListPanel(
    { credentials }: ListPanelPropsObject
) {
    const [fileList, setFileList] = useState([]);
    const [searchPath, setSearchPath] = useState("");
    const [isFetching, setIsFetching] = useState(false);

    // function sleep(ms: number){
    //     return new Promise(resolve => setTimeout(resolve, ms));
    // }

    async function handleSearchPathClick(directory: string){
        console.log('Go Clicked');
        setIsFetching(true);

        const newSearchPath = directory.replace(/^\/+|\/+$/g, '')
        const responseData = await fetchFilePaths(
            '/api/s3/list',
            credentials.bucket_name,
            newSearchPath,
        );
        setFileList(responseData.filePaths);
        setSearchPath(responseData.prefix);
        // await sleep(5000);

        setIsFetching(false);
    }

    // function handleDownload(fileName){
    //     console.log(fileName);
    // }
    return (
        <>
        <FilePathSearchBar
            searchPath={searchPath}
            onSearch={handleSearchPathClick}
            isFetching={isFetching}
        />
        <FileListings
            searchPath={searchPath}
            isFetching={isFetching}
            bucketName={credentials.bucket_name}
            fileList={fileList}
            onSearch={handleSearchPathClick}
        />   
        </>
    )
};