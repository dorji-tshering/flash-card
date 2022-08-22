
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import cookie from 'cookie';
import { verifySessionCookie } from '../firebaseAdmin';
import { collection, DocumentData, DocumentReference, getDoc, getDocs } from '@firebase/firestore';
import { database } from '../firebaseClient';
import { doc } from 'firebase/firestore';

import Layout from '../components/layout/Layout';
import HomeContent from '../components/home/HomeContent';
import { useCategoryContext } from '../components/utils/categoryContext';
import { useEffect } from 'react';

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
    let userId: string = null;
    let notes: Object[] = [];
    let noteCategories: string[] = null;

    const cookieObject: string = ctx.req.headers.cookie;
    // return if no cookie found
    if(!cookieObject) {
        return { 
            props: {
                notes: notes,
                userId: userId,
                noteCategories: noteCategories
            } 
        }
    }

    const getNotes = async (categoryDocRef: DocumentReference<DocumentData>, uid: string) =>{
        let tempNotes: DocumentData[] = [];
        const categoriesSnapshot = await getDoc<DocumentData>(categoryDocRef);
        const categoriesObject = categoriesSnapshot.data();

        // return if user doesn't have any documents
        if(!categoriesObject) {
            return;
        }else {
            noteCategories = categoriesObject.categories;
        }

        const promises: [] = categoriesObject.categories.map((category: string) => {
            const userCategoriesRef = collection(database, 'CategoryCollection', uid, category);
            return getDocs(userCategoriesRef); // returns a promise
        });   

        const allQuerySnapshots = await Promise.all<DocumentData>(promises);
        allQuerySnapshots.forEach((querySnapshot) => {
            tempNotes.push(...querySnapshot.docs);
        });

        tempNotes.forEach((doc) => {
            let docObject = doc.data();
            docObject.docId = doc.id;
            notes.push(docObject);
        });
    }

    try {
        const sessionCookie = cookie.parse(cookieObject).session;
        const decodedClaims = await verifySessionCookie(sessionCookie, true);
        const uid = decodedClaims.uid;
        userId = uid;
        const categoryDocRef = doc(database, "CategoryCollection", uid);
        await getNotes(categoryDocRef, uid);

    } catch(err) {
        console.log('Error: ' + err);
        return {
            props: {
                notes: notes,
                userId: userId,
                noteCategories: noteCategories
            }
        }
    }

    console.log(noteCategories);

    return {
        props: {
            notes: notes,
            userId: userId,
            noteCategories: noteCategories
        }
    }
}

export default function Home({ notes, userId, noteCategories }) {
    const { setCategories } = useCategoryContext();

    useEffect(() => {
        setCategories(noteCategories);
    },[])

    return (
        <Layout>
            <HomeContent notes={notes} userId={userId}/>
        </Layout>
    );
}
