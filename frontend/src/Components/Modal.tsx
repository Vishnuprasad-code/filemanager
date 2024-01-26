import ReactDOM from 'react-dom';
import { uploadConfirmModalType } from '../Types/types.tsx'

import "./Modal.css";

export function Modal(
    {
        uploadObject,
        setUploadObject,
        searchPath,
        onConfirm
    }: uploadConfirmModalType
){
    if (!uploadObject.isModalOpen) return null;

    console.log(uploadObject);
    const fileObject = uploadObject.newFiles[0];
    const uploadPath = searchPath.replace(/^\/+|\/+$/g, '') + '/' + fileObject.name

    return ReactDOM.createPortal(
        <>
            <div className="overlay">
                <div className='upload-popup'>
                    <button className='close-btn' onClick={() => setUploadObject({
                        isModalOpen: false,
                        newFiles: []
                    })}></button>
                    <h3>Confirm Upload Path</h3>
                    <p>path: <strong>{uploadPath}</strong></p>
                    <button className='upload-popup-btn' onClick={() => onConfirm(uploadObject.newFiles)}>Confirm</button>
                    <button className='upload-popup-btn' onClick={() => setUploadObject({
                        isModalOpen: false,
                        newFiles: []
                    })}
                    >
                        Close
                    </button>
                </div>

            </div>
        </>,
        document.getElementById('modal')!
    )
}