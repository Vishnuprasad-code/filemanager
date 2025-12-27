import { useEffect } from 'react';

import './NotificationCard.css'


export function NotificationCard(
    {
        message,
        setMessage
    }: {
        message: string | null,
        setMessage: (message: string | null) => void
    }
) {
    useEffect(() => {
        const showTime = setTimeout(
            () => setMessage(null), 1000 * 30);

        return () => clearTimeout(showTime);
    });

    return (
        <div className='notifiy-card'>
            <button className='notify-close' onClick={() => setMessage(null)}></button>
            <p className='notify-text'>{message}</p>
        </div>
    )
}