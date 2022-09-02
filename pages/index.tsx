
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import cookie from 'cookie';
import { verifySessionCookie } from '../firebaseAdmin';
import { DocumentData, DocumentReference, getDoc, getDocs } from '@firebase/firestore';
import { database } from '../firebaseClient';
import { doc } from 'firebase/firestore';
import Head from 'next/head';

import Layout from '../components/layout/Layout';
import HomeContent from '../components/home/HomeContent';
import { useCategoryContext } from '../components/utils/categoryContext';
import { useEffect } from 'react';

export default function Home({ userId, noteCategories }) {
    const { categories, setCategories } = useCategoryContext();

    useEffect(() => {
        if(categories.length === 0) {
            setCategories(noteCategories);
        }
    },[])

    return (
        <>
            <Head>
                <title key='title'>FC: Home</title>
            </Head>
            <Layout>
                <HomeContent userId={userId}/>
            </Layout>
        </>
    );
}


export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
    let userId: string = null;
    let noteCategories: string[] = [];
 
    const cookieObject: string = ctx.req.headers.cookie;
    // return if no cookie found
    if(!cookieObject) {
        return { 
            props: {
                userId: null,
                noteCategories: []
            } 
        }
    } 

    const getCategories = async (categoryDocRef: DocumentReference<DocumentData>) =>{
        const categoriesSnapshot = await getDoc<DocumentData>(categoryDocRef);
        const categoriesObject = categoriesSnapshot.data();

        // return if user doesn't have any documents
        if(!categoriesObject) {
            return;
        }else {
            noteCategories = categoriesObject.categories;
        }
    } 

    try {
        const sessionCookie = cookie.parse(cookieObject)['__session'];
        const decodedClaims = await verifySessionCookie(sessionCookie, true);
        userId = decodedClaims.uid;
        const categoryDocRef = doc(database, "CategoryCollection", userId);
        await getCategories(categoryDocRef);
    } catch(err) {
        console.log(err);
        return {
            props: {
                userId: null,
                noteCategories: []
            }
        }
    }

    return {
        props: {
            userId: userId,
            noteCategories: noteCategories
        }
    }
} 
