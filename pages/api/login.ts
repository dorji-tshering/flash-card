// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import cookie from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';
import { createSessionCookie } from '../../firebaseAdmin';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if(req.body.idToken === undefined) {
        res.status(400).json({
            'status': 'Bad Request'
        });
        return;
    }
    const idToken = req.body.idToken.toString();
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    
    createSessionCookie(idToken, { 
        expiresIn: expiresIn
    }).then((sessionCookie) => {
        res.setHeader("Set-Cookie",
            cookie.serialize("__session", sessionCookie, {
                httpOnly: true,
                maxAge: expiresIn,
                sameSite: 'strict',
                secure: true,
                path: "/",
            }) 
        ); 
    res.status(200).json({status: 'success'});
    }).catch((err) => {
        res.status(401).json({
            'status': 'UNAUTHORIZED REQUEST',
            'error': err,
        });
    });  
}
