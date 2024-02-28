import { useState } from 'react'
import { useContext } from 'react';

import { CredentialsContextType,
    ListPanelContextType, fileListRowObject,
    uploadObjectType
} from '../Types/types.tsx'
 import { CredentialsContext,
     ListPanelContext
} from '../Contexts/contexts.tsx'

import { fetchDownloadresponse, fetchUploadresponse } from '../Http/http.ts';
import { Modal } from './Modal.tsx'
import UploadPopup from './UploadPopup.tsx'
import { LoadingSpinner } from './LoadingSpinner.tsx'

import "./FileListings.css";

export function FileListings(){
    const { credentials, setMessage } = useContext<CredentialsContextType>(CredentialsContext);
    const { 
        searchPath,
        isFetching,
        fileList,
        onSearch
    } = useContext<ListPanelContextType>(ListPanelContext);

    const [uploadObject, setUploadObject] = useState<uploadObjectType>({
        isModalOpen: false,
        newFile: null
    });
    const [isUploading, setIsUploading] = useState(false);

    function handleTraverse(row: fileListRowObject) {
        (row.type === 'Folder') && onSearch(
            searchPath.replace(/^\/+|\/+$/g, '') + '/' + row.fileName);
    }

    async function handleDownload(row: fileListRowObject) {
        const objectName = searchPath.replace(/^\/+|\/+$/g, '') + '/' + row.fileName
        const responseData = await fetchDownloadresponse(
            credentials!,
            objectName.replace(/^\/+|\/+$/g, '')
        )

        if (responseData.error){
            setMessage(responseData.error);
            return
        }

        const link = document.createElement('a');
        link.href = responseData.url;
        link.target = '_blank';
        link.setAttribute(
            'download',
            row.fileName,
        );

        // Append to html link element page
        document.body.appendChild(link);

        // Start download
        link.click();

        // Clean up and remove the link
        link!.parentNode!.removeChild(link);
    }

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
    };
    
    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        // setDragging(false);
    };
    
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    // function sleep(ms){
    //     return new Promise(resolve => setTimeout(resolve, ms));
    // }

    async function handleUploadConfirmation(event:  React.DragEvent) {
        event.preventDefault();

        console.log('handleUploadConfirmation:');
        const droppedItems = [...event.dataTransfer.items];
        if (droppedItems[0].webkitGetAsEntry()!.isDirectory) {
            setMessage("Cannot upload a directory! Drop a file instead.")
            return
        }

        setUploadObject({
            isModalOpen: true,
            newFile: droppedItems[0].getAsFile(),
        })
    }

    async function handleUpload(fileObject: File) {
        setUploadObject({
            isModalOpen: false,
            newFile: null,
        })
        setIsUploading(true);

        const uploadPath = searchPath.replace(/^\/+|\/+$/g, '') + '/' + fileObject.name

        const responseData = await fetchUploadresponse(
            credentials!,
            fileObject,
            uploadPath.replace(/^\/+|\/+$/g, '')
        )
        console.log(responseData);
        if (responseData.error){
            setMessage(responseData.error)
            setIsUploading(false);
            return
        }

        // await sleep(5000);
        onSearch(searchPath.replace(/^\/+|\/+$/g, '') + '/');
        setIsUploading(false);
    }

    let listingContentToRender;
    console.log('isFetching || isUploading');
    console.log(isFetching, isUploading);
    if (isFetching || isUploading){
        listingContentToRender = <LoadingSpinner/>
    }
    else {
        listingContentToRender = fileList.map((row, rowIndex) => (
            <ul className="listing-row" key={rowIndex}>
                <li className="listing-cell-item listing-cell-type">{row.type}</li>
                {
                    row.type === 'File'
                    ?
                    <li className="listing-cell-item listing-cell-name">{row.fileName}</li>
                    :
                    <li
                        className="listing-cell-item listing-cell-name"
                        onClick={() => handleTraverse(row)}>
                            {row.fileName}
                    </li>
                }
                <li className="listing-cell-item listing-cell-file-size">{row.displaySize}</li>
                <li className="listing-cell-item listing-cell-last-modified">{row.lastModified}</li>
                {
                    row.type === 'File'
                    ?
                    <li className="listing-cell-item listing-cell-download">
                        <img
                            src="downloaded-symbol-svgrepo-com.svg"
                            alt="!"
                            onClick={() => handleDownload(row)}
                        />
                    </li>
                    :
                    <li className="listing-cell-item listing-cell-dummy"></li>
                }
            </ul>
            ))
    }

    return (
        <>
        <Modal isModalOpen={uploadObject.isModalOpen}>
            <UploadPopup
                uploadObject={uploadObject}
                setUploadObject={setUploadObject}
                searchPath={searchPath}
                onConfirm={handleUpload} />
        </Modal>
        <div
            id="listing-panel"
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleUploadConfirmation}
        >
            <ListingHeaderRow />
            { listingContentToRender }

        </div>
        </>
    )
}


function ListingHeaderRow() {
    return (
    <div className="listing-header">
        <div className="listing-header-item listing-cell-type">
            Type
        </div>
        <div className="listing-header-item listing-cell-name">
            Name
        </div>
        <div className="listing-header-item listing-cell-file-size">
            File Size
        </div>
        <div className="listing-header-item listing-cell-last-modified">
            Last Modified
        </div>
        <div className="listing-header-item listing-cell-download">
            Download
        </div>
    </div>
    )
}