import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { collection, CollectionReference, doc, DocumentData, getDoc, getDocs } from '@firebase/firestore';
import cookie from 'cookie';

import CategoryContent from "../../components/category/CategoryContent";
import Layout from "../../components/layout/Layout";
import { database } from '../../firebaseClient';
import { verifySessionCookie } from '../../firebaseAdmin';
import { User } from '@firebase/auth';
import { useCategoryContext } from '../../components/utils/categoryContext';
import { useEffect } from 'react';

export const getServerSideProps: GetServerSideProps = async(ctx: GetServerSidePropsContext) => {
    let notes: Object[] = [];
    let noteCategories: string[] = null;

    const cookieObject: string = ctx.req.headers.cookie;
    // return if no cookie found
    if(!cookieObject) {
        return { 
            props: {
                notes: notes,
                noteCategories: noteCategories
            }
        }
    }

    const getNotes = async (collRef: CollectionReference<DocumentData>, uid: string) => {
        const catSnapShot = await getDoc(doc(database, 'CategoryCollection', uid));
        if(catSnapShot.data().categories.length > 0) {
            noteCategories = catSnapShot.data()?.categories;
        }else {
            return;
        }

        const snapShot = await getDocs(collRef);
        if(!snapShot) {
            return;
        }

        snapShot.docs.forEach((doc) => {
            let docObject = doc.data();
            docObject.docId = doc.id;
            notes.push(docObject);
        });
    }

    // verify user session and get notes
    try {
        const sessionCookie = cookie.parse(cookieObject).session;
        const decodedClaims = await verifySessionCookie(sessionCookie, true);
        const uid = decodedClaims.uid;
        const collRef = collection(database, 'CategoryCollection', uid, ctx.params.id as string);
        await getNotes(collRef, uid);

    } catch(err) {
        console.log('Error: ' + err);
        return {
            props: {
                notes: notes,
                noteCategories: noteCategories
            }
        }
    }

    return {
        props: {
            notes: notes,
            noteCategories: noteCategories
        }
    }
}

const CardCategory = ({ notes, noteCategories }) => {
    const { categories, setCategories } = useCategoryContext();

    useEffect(() => {
        if(!categories) {
            setCategories(noteCategories);
        }
    },[])

    return (
        <Layout>
            <CategoryContent notes={notes}/>
        </Layout>
    );
}

export default CardCategory;