import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { doc, getDoc } from '@firebase/firestore';
import cookie from 'cookie';
import Head from 'next/head';
import { useRouter } from 'next/router';

import CategoryContent from "../../components/category/CategoryContent";
import Layout from "../../components/layout/Layout";
import { database } from '../../firebaseClient';
import { verifySessionCookie } from '../../firebaseAdmin';
import { useCategoryContext } from '../../components/utils/categoryContext';
import { useEffect } from 'react';

export default function CardCategory({ noteCategories }) {
    const { categories, setCategories } = useCategoryContext();

    useEffect(() => {
            if(!categories.length >= noteCategories.length || categories.length === 0) {
                setCategories(noteCategories);
            }
    },[]);
 
    return (
        <>
            <Head>
                <title key='title'>{`FC: ${useRouter().query.id}`}</title>
            </Head>
            <Layout>
                <CategoryContent/>
            </Layout>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async(ctx: GetServerSidePropsContext) => {
    let noteCategories: string[] = [];
    const cookieObject: string = ctx.req.headers.cookie;

    const getCategories = async (uid: string) => {
        const catSnapShot = await getDoc(doc(database, 'CategoryCollection', uid));
        if(catSnapShot.data().categories.length > 0) {
            noteCategories = catSnapShot.data().categories;
        }else {
            return;
        }
    }

    try {
        const sessionCookie = cookie.parse(cookieObject)['__session'];
        const decodedClaims = await verifySessionCookie(sessionCookie, true);
        const uid = decodedClaims.uid;
        const document = await getDoc(doc(database, 'CategoryCollection', uid));
        if(!document.data().categories.includes(ctx.params.id)) {
            return {
                redirect: {
                    permanent: false,
                    destination: `/404`,
                  }
            }
        }
        await getCategories(uid);

    } catch(err) {
        console.log('Error: ' + err);
        return {
            props: {
                noteCategories: noteCategories,
            }
        }
    }

    return {
        props: {
            noteCategories: noteCategories,
        }
    }
}