import { signOut } from 'firebase/auth';
import { auth } from '../../firebaseClient';
import Router from 'next/router';

export const logOutHelper = async () => {
    await signOut(auth);
    
    let response = await fetch('/api/logout', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            key: 'key123'
        }),
    });

    if(response.status === 200) {
        Router.replace('/');
    }
}