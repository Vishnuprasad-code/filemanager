import { uploadConfirmModalType } from '../Types/types.tsx'

import './UploadPopup.css'

export default function UploadPopup(
    {
        uploadObject,
        setUploadObject,
        searchPath,
        onConfirm,
    }: uploadConfirmModalType
){
    console.log(uploadObject);
    const fileObject = uploadObject.newFile;
    const uploadPath = searchPath.replace(/^\/+|\/+$/g, '') + '/' + fileObject!.name

    return (
        <>
        <button className='close-btn' onClick={() => setUploadObject({
            isModalOpen: false,
            newFile: null
        })}>
        </button>
        <h3>Confirm Upload Path</h3>
        <p>path: <strong>{uploadPath}</strong></p>
        <button className='modal-popup-btn' onClick={() => onConfirm(uploadObject.newFile!)}>Confirm</button>
        <button className='modal-popup-btn' onClick={() => setUploadObject({
            isModalOpen: false,
            newFile: null
        })}
        >
            Close
        </button>
        </>
    )
    
}