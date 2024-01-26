import { useState } from 'react'

import { fetchDownloadresponse, fetchUploadresponse } from '../Http/http.js';

import { 
    FileListingsPropsObject,
    fileListRowObject,
    uploadObjectType
 } from '../Types/types.tsx'

import { Modal } from './Modal.tsx'

import "./FileListings.css";

export function FileListings(
    {   
        searchPath,
        isFetching,
        bucketName,
        fileList,
        onSearch
    }: FileListingsPropsObject
){
    const [uploadObject, setUploadObject] = useState<uploadObjectType>({
        isModalOpen: false,
        newFiles: []
    });
    const [isUploading, setIsUploading] = useState(false);

    function handleTraverse(row: fileListRowObject) {
        (row.type === 'Folder') && onSearch(
            searchPath.replace(/^\/+|\/+$/g, '') + '/' + row.fileName);
    }

    async function handleDownload(row: fileListRowObject) {
        const objectName = searchPath.replace(/^\/+|\/+$/g, '') + '/' + row.fileName
        const responseData = await fetchDownloadresponse(
            '/api/s3/download',
            bucketName,
            objectName.replace(/^\/+|\/+$/g, '')
        )
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
        const newFiles = [...event.dataTransfer.files];
        console.log(newFiles);

        setUploadObject({
            isModalOpen: true,
            newFiles: newFiles,
        })
    }

    async function handleUpload(newFiles: File[]) {
        setUploadObject({
            isModalOpen: false,
            newFiles: [],
        })
        setIsUploading(true);

        const fileObject = newFiles[0];
        const uploadPath = searchPath.replace(/^\/+|\/+$/g, '') + '/' + fileObject.name
        const formData = new FormData();
        formData.append("file_to_upload", fileObject);
        formData.append('bucket_name', bucketName);
        formData.append('upload_path', uploadPath.replace(/^\/+|\/+$/g, ''));

        const responseData = await fetchUploadresponse(
            formData
        )
        console.log(responseData);

        // await sleep(5000);
        onSearch(searchPath.replace(/^\/+|\/+$/g, '') + '/');
        setIsUploading(false);
    }

    return (
        <>
        <Modal
            uploadObject={uploadObject}
            setUploadObject={setUploadObject}
            onConfirm={handleUpload}
            searchPath={searchPath}/>
        <div
            id="listing-panel"
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleUploadConfirmation}
        >
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
            {!isFetching && !isUploading && fileList.length > 0 && fileList.map((row, rowIndex) => (
            <ul className="listing-row" key={rowIndex}>
                <li className="listing-cell-item listing-cell-type">{row.type}</li>
                {
                    row.type === 'File'
                    ?
                    <li className="listing-cell-item listing-cell-name">{row.fileName}</li>
                    :
                    <li className="listing-cell-item listing-cell-name" onClick={() => handleTraverse(row)}>{row.fileName}</li>
                }
                <li className="listing-cell-item listing-cell-file-size">{row.displaySize}</li>
                <li className="listing-cell-item listing-cell-last-modified">{row.lastModified}</li>
                {
                    row.type === 'File'
                    ?
                    <li className="listing-cell-item listing-cell-download">
                        <img src="downloaded-symbol-svgrepo-com.svg" alt="!" onClick={() => handleDownload(row)} />
                    </li>
                    :
                    <li className="listing-cell-item listing-cell-dummy"></li>
                }
            </ul>
            ))}
        </div>
        </>
    )
}