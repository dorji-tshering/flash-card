import cookie from 'cookie';
import { NextApiRequest, NextApiResponse } from "next";



export default function handler(req: NextApiRequest, res: NextApiResponse) {
    res.setHeader("Set-Cookie",
        cookie.serialize("session", '', {
            maxAge: -1,
            path: "/",
        })
    );
    res.status(200).send({status: 'Successfully logged out.'});
}