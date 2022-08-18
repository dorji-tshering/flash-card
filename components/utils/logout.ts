import { signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig';

export const logOut = () => {
    signOut(auth).then(() => {
        console.log('success logout');
    }).catch((err) => {
        console.log(err.code);
    });
}