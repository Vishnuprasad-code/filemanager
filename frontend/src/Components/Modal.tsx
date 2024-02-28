import ReactDOM from 'react-dom';
import { modalPropsObject } from '../Types/types.ts'

import "./Modal.css";

export function Modal(
    {
        isModalOpen,
        children
    }: modalPropsObject
){
    if (!isModalOpen) return null;

    return ReactDOM.createPortal(
        <>
            <div className="overlay">
                <div className='modal-popup'>

                    { children }

                </div>

            </div>
        </>,
        document.getElementById('modal')!
    )
}