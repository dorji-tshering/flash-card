import { arrayRemove, doc, updateDoc } from '@firebase/firestore';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { database } from '../../firebaseClient';
import NotesContainer from '../containers/NotesContainer';
import { useAuthValue } from '../utils/authContext';
import { useCategoryContext } from '../utils/categoryContext';
import Loader from '../loader/Loader';
import { useState } from 'react';

const Container = styled.div`
    height: 100%;
    width: 100%;
    padding: 50px;

    .top {
        margin-bottom: 40px;

        h4 {
            margin: 0;
            text-align: center;
            color: var(--secondary-text-color);
        }
    }

    .no-notes-wrapper {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        margin-top: 150px;
        text-align: center;

        .action {
            margin-top: 20px;

            button:hover {
                background: var(--red-color);
            }
        }
    }

    @media screen and (max-width: 991px) {
        padding: 40px 30px;
    }

    @media screen and (max-width: 480px) {
        padding: 30px 10px;
    } 
`;

const CategoryContent = ({ notes }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const { categories, setCategories } = useCategoryContext();
    const { currentUser } = useAuthValue();
    const category = useRouter().query.id as string;
    const router = useRouter();

    const deleteCategory = async () => {
        const docRef = doc(database, 'CategoryCollection', currentUser.uid);
        try {
            setLoading(true);
            await updateDoc(docRef, {
                categories: arrayRemove(category),
            });
            categories.splice(categories.indexOf(category), 1);
            setCategories(categories);
            setLoading(false);
            router.replace('/');
        }catch(err) {
            console.log(err);
            setLoading(false);
        }
    }

    return (
        <Container>
            { loading ? <Loader background="transparent"/> : ''}
            { notes.length > 0 ? 
                <div className="notes-wrapper">
                    <div className="top">
                        <h4>My {category} Notes</h4>
                    </div>
                    <NotesContainer notes={notes}/>
                </div>
                : 
                <div className="no-notes-wrapper">
                    <p>You don't have any notes for this category.</p>
                    <div className="action">
                        <button onClick={deleteCategory} className="secondary-button">Delete Category</button>
                    </div>
                </div>
            }
        </Container>
    );
}

export default CategoryContent;