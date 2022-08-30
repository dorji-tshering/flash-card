import cookie from 'cookie';
import { NextApiRequest, NextApiResponse } from "next";



export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if(req.body.key !== 'key123') {
        res.status(403).json({
            'status': 'Forbidden',
        });
    }else {
        res.setHeader("Set-Cookie",
            cookie.serialize("__session", '', {
                maxAge: -1,
                path: "/",
            })
        );
        res.status(200).json({
            'status': 'Successfully logged out.'
        });
    }

    
}