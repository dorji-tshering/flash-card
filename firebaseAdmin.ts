import admin from 'firebase-admin';
import { SessionCookieOptions } from 'firebase-admin/lib/auth/base-auth';

// get this JSON from the Firebase board
// you can also store the values in environment variables

if(!admin.apps.length) {
    admin.initializeApp({
        credential : admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            // replace `\` and `n` character pairs w/ single `\n` character
            privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
        }),
        databaseURL: process.env.DATABASE_URL,
    });
}

export const verifyIdToken = (token: string) => {
    return admin.auth().verifyIdToken(token);
}

export const createSessionCookie = (idToken: string, expiresIn: SessionCookieOptions) => {
    return admin.auth().createSessionCookie(idToken, expiresIn);
} 

export const verifySessionCookie = (sessionCookie: string, checkRevoked: boolean) => {
    return admin.auth().verifySessionCookie(sessionCookie, checkRevoked);
}
