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
        console.log('NotificationCard useEffect');
        const showTime = setTimeout(
          () => setMessage(null), 5000);
        
            return () => clearTimeout(showTime);
      });

    return (
        <div className='notifiy-card'>
            <button className='notify-close' onClick={() => setMessage(null)}></button>
            <p className='notify-text'>{message}</p>
        </div>
    )
}