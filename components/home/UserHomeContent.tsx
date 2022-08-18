import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { collection, getDocs, getDoc, doc, DocumentData, DocumentReference } from 'firebase/firestore';
import RenderCode from '../renderCode/RenderCode';
import { BiFilter } from 'react-icons/bi';



import { useAuthValue } from '../utils/authContext';
import { database } from '../../firebaseConfig';
import Loader from '../loader/Loader';



const Container = styled.div`
    padding: 50px 50px;

    .top-bar {
        display: flex;
        justify-content: space-between;
        margin-bottom: 30px;
        align-items: center;

        h4 {
            margin: 0;
        }

        .filter-wrapper {
            position: relative;

            .filter-options {
                position: absolute;
                display: flex;
                flex-direction: column;
                background: var(--dark-background-color);
                border-radius: 5px;
                right: 0;
                top: 50px;
                overflow: hidden;
                box-shadow: rgb(0 0 0) 0px 1px 2px 0px, rgb(52 55 56) 0px 1px 3px 1px;

                .filter {
                    display: block;
                    width: 100%;
                    text-align: center;
                    padding: 10px 30px;
                    cursor: pointer;

                    &:hover {
                        background: var(--light-background-color);
                    }

                }

            }

            .toggle-filter {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 38px;
                width: 38px;
                min-width: auto;
                background: none;
                border-radius: 50%;
                color: var(--tuo-secondary-text);
                padding: 0;
                

                &:hover {
                    background: var(--light-background-color);
                    box-shadow: rgb(0 0 0) 0px 1px 2px 0px, rgb(52 55 56) 0px 1px 3px 1px;
                    transition: all .4s;
                }

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

const GridContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 30px;

    @media screen and (max-width: 991px) {
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 20px;
    }

    @media screen and (max-width: 700px) {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 15px;
    }
`;

const GridElement = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-radius: 5px;
    padding: 15px;
    box-shadow: rgb(0 0 0 / 12%) 0px 2px 3px, rgb(0 0 0 / 24%) 0px 1px 50px;

    .wrapper {
        overflow: auto;
        max-height: 250px;

        p {
            color: var(--light-text-color);
            font-family: 'Roboto';
            font-weight: 300;
        }
    }

    .meta {
        color: var(--secondary-text-color);
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        margin-top: 10px;
        
        span {
            font-family: 'Roboto';
        }
    }

    @media screen and (max-width: 480px) {
        p {
            font-size: 12px;
        }
    }

    @media screen and (max-width: 360px) {
        p {
            font-size: 10px;
        }
    }
`;

const UserHomeContent = () => {
    const [notes, setNotes] = useState<Array<DocumentData>>(null);
    const [filteredNotes, setFilteredNotes] = useState<Array<DocumentData>>(null);
    const [showFilter, setShowFilter] = useState<boolean>(false);
    const { currentUser }  = useAuthValue();

    // retrieve all the notes of a user with default sorting
    useEffect(() => {
        const getNotes = async(ref: DocumentReference<DocumentData>, userId: string) =>{
            const categoriesSnapshot = await getDoc<DocumentData>(ref);
            const categoriesObject = categoriesSnapshot.data();

            // return if user doesn't have any documents
            if(!categoriesObject) {
                return;
            }

            let tempNotes = [];

            const promises: [] = categoriesObject.categories.map((category: string) => {
                const userCategoriesRef = collection(database, 'CategoryCollection', userId, category);
                return getDocs(userCategoriesRef); // returns a promise
            });

            // allQuerySnapshots contains array of documents from different collections
            // querySnapshot: QuerySnapshot contains documents from single collection
            Promise.all<DocumentData>(promises).then((allQuerySnapshots) => {
                allQuerySnapshots.forEach((querySnapshot) => {
                    // push documents to tempNotes from each collection
                    tempNotes.push(...querySnapshot.docs);
                });

                setNotes(tempNotes);
                setFilteredNotes(tempNotes);
            }).catch((err) => {
                console.log(err.code);
            });
        }

        if(currentUser) {
            const categoryDocRef = doc(database, "CategoryCollection", currentUser.uid);
            getNotes(categoryDocRef, currentUser.uid).catch(err => console.log(err))
        }
    },[]);

    // filter function for notes 
    const filterNotes = (filter: string) => {
        if(filter === 'default') {
            setFilteredNotes(notes);
        } else if (filter === 'known') {
            setFilteredNotes(notes.filter((note) => note.data().known === true));
        } else if(filter === 'unknown') {
            setFilteredNotes(notes.filter((note) => note.data().known === false));
        }
        setShowFilter(false);
    }

    return (
        <Container>
            { filteredNotes ? 
                <div className="notes-container">
                    <div className="top-bar">
                        <h4 className="title">Your Cards: <span className="card-count">{filteredNotes.length}</span></h4>
                        <div className="filter-wrapper">
                            <button onClick={() => setShowFilter(!showFilter)} className="toggle-filter"><BiFilter size={22}/></button>
                            { showFilter ? 
                                <div className="filter-options">
                                    <span onClick={() => filterNotes('default')} className="filter">Default</span>
                                    <span onClick={() => filterNotes('known')} className="filter">Known</span>
                                    <span onClick={() => filterNotes('unknown')} className="filter">Unknown</span>
                                </div>
                                :
                                ''
                            }
                        </div>
                    </div>
                    <GridContainer>
                        { filteredNotes.map((note, idx) => {
                            return (
                                <GridElement key={idx}>
                                    { note.data().contentType === 'code' ? 
                                        <div className="wrapper"><RenderCode language={note.data().language} code={note.data().data} /></div>
                                        :
                                        <div className="wrapper"><p>{ note.data().data }</p></div>
                                    }
                                    <p className="meta">
                                        <span className="category">{ note.data().category }</span>
                                        <span className="content-type">{ note.data().contentType }</span>
                                    </p>                                  
                                </GridElement>)
                            }) 
                        }
                    </GridContainer>
                </div>
                :

                <div className="no-notes-content">
                    You don't have any notes yeT
                </div>
            }
        </Container>
    )
}

export default UserHomeContent;