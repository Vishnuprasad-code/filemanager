import { useState, useContext, useEffect } from 'react'

import { 
    CredentialsContext,
    ListPanelContext

} from '../Contexts/contexts.tsx'
import { CredentialsContextType } from '../Types/types.tsx'


import { fetchFilePaths } from '../Http/http.ts';
import { FilePathSearchBar } from './FilePathSearchBar.tsx'
import { FileListings } from './FileListings.tsx'


export function ListPanel(
    // { credentials }: ListPanelPropsObject
) {
    const [fileList, setFileList] = useState([]);
    const [searchPath, setSearchPath] = useState('');
    const [isFetching, setIsFetching] = useState(false);

    const { credentials } = useContext<CredentialsContextType>(CredentialsContext);

    useEffect(() => {
        setFileList([]);
        setSearchPath('');
        setIsFetching(false);
      }, [credentials]);

    // function sleep(ms: number){
    //     return new Promise(resolve => setTimeout(resolve, ms));
    // }

    async function onSearch(directory: string){
        console.log('Go Clicked');
        setIsFetching(true);

        const newSearchPath = directory.replace(/^\/+|\/+$/g, '')
        const responseData = await fetchFilePaths(
            '/api/s3/list',
            credentials!.bucketName,
            newSearchPath || '',
        );
        if (responseData.error){
            setIsFetching(false);
            return
        }

        setFileList(responseData.filePaths);
        setSearchPath(responseData.prefix);
        // await sleep(5000);

        setIsFetching(false);
    }

    // function handleDownload(fileName){
    //     console.log(fileName);
    // }
    const ListPanelCtxValue = {
        'isFetching': isFetching,
        'searchPath': searchPath,
        'fileList': fileList,
        'onSearch': onSearch,
    }

    return (
        <ListPanelContext.Provider value={ListPanelCtxValue}>
            <FilePathSearchBar/>
            <FileListings/>
        </ListPanelContext.Provider>
    )
};