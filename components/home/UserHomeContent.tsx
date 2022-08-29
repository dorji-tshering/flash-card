import styled from 'styled-components';
import React, { useEffect, useState } from 'react';
import { BiFilter } from 'react-icons/bi';
import { GiNotebook } from 'react-icons/gi';

import NotesContainer from '../containers/NotesContainer';
import { useAuthValue } from '../utils/authContext';
import { useCategoryContext } from '../utils/categoryContext';
import { database } from '../../firebaseClient';
import { collection, DocumentData, getDocs, onSnapshot, query } from 'firebase/firestore';
import Loader from '../loader/Loader';
import { useRenderContext } from '../utils/renderContext';


const Container = styled.div`
    padding: 50px;

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

    .no-filter-notes {
        text-align: center;
        margin-top: 150px;
        color: var(--secondary-text-color);
    }

    .no-notes-content {
        text-align: center;
        margin-top: 100px;
        color: var(--secondary-text-color);
    }

    @media screen and (max-width: 991px) {
        padding: 40px 30px;
    }

    @media screen and (max-width: 480px) {
        padding: 30px 10px;
    } 
`; 

const UserHomeContent = () => {
    const [oriNotes, setOriNotes] = useState<Array<DocumentData>>([]);
    const [filteredNotes, setFilteredNotes] = useState<Array<DocumentData>>([]);
    const [showFilter, setShowFilter] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuthValue();
    const { categories } = useCategoryContext();
    const { render } = useRenderContext();

    // fetch notes for the userId
    useEffect(() => {
        const getNotes = async () =>{
            setLoading(true);
            let tempNotes: DocumentData[] = [];
    
            const promises: [] = categories.map((category: string) => {
                const userCategoriesRef = collection(database, 'CategoryCollection', currentUser.uid, category);
                return getDocs(userCategoriesRef); // returns a promise
            });   
    
            const allQuerySnapshots = await Promise.all<DocumentData>(promises);
            allQuerySnapshots.forEach((querySnapshot) => {
                tempNotes.push(...querySnapshot.docs);
            }); 
            
            setOriNotes(tempNotes);
            setFilteredNotes(tempNotes);
            setLoading(false);
        }

        if(currentUser) {
            getNotes();
        }
    }, [categories, currentUser, render]);

    // filter function for notes 
    const filterNotes = (filter: string) => {
        setLoading(true);
        if(filter === 'default') {
            setFilteredNotes(oriNotes);
        } else if (filter === 'known') {
            setFilteredNotes(oriNotes.filter((note) => note.data().known === true));
        } else if(filter === 'unknown') {
            setFilteredNotes(oriNotes.filter((note) => note.data().known === false));
        }
        setShowFilter(false);
        setLoading(false);
    }

    return (
        <Container>
            { loading ? 
                <Loader background="var(--main-background-color)"/>
                :
                oriNotes.length !== 0 ? 
                    <>
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
                        
                        { filteredNotes.length !== 0 ? 
                            <NotesContainer notes={filteredNotes}/>
                            :
                            <div className="no-filter-notes">
                                <p>You don't have notes for this filter.</p>
                            </div>    
                        }
                    </>
                    :
                    <div className="no-notes-content">
                        <p className="icon"><GiNotebook size={50}/></p>
                        <p>Looks like you don't have any notes for now. Start creating one.</p>
                    </div>
            }
        </Container>
    )
}

export default UserHomeContent;