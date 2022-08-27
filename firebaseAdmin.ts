import admin from 'firebase-admin';
import { SessionCookieOptions } from 'firebase-admin/lib/auth/base-auth';

if(!admin.apps.length) {
    admin.initializeApp({
        credential : admin.credential.cert(JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS)),
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
