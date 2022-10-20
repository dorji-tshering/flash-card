import { signOut } from 'firebase/auth';
import { auth } from '../../firebaseClient';
import Router from 'next/router';
import { Dispatch, SetStateAction } from 'react';

export const logOutHelper = async ( setCurrentUserId:Dispatch<SetStateAction<string>> ) => {
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
        setCurrentUserId(null);
        Router.replace('/');
    }
}