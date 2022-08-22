import { signOut } from 'firebase/auth';
import { auth } from '../../firebaseClient';
import Router from 'next/router';

export const logOutHelper = () => {
    signOut(auth).then(() => {
        fetch('/api/logout', {
            method: 'POST',
        }).then(() => {
            Router.reload();
        });
    }).catch((err) => {
        console.log(err.code);
    });
}