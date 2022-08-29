import { deleteDoc, doc, DocumentData, updateDoc } from '@firebase/firestore';
import styled from 'styled-components';
import { useSliderContextValue } from '../utils/sliderContext';
import { MdOutlineArrowBack, MdOutlineArrowForward, MdModeEdit, MdDelete } from 'react-icons/md';
import { IoCloseSharp } from 'react-icons/io5';
import { BsDot, BsToggle2Off, BsToggle2On } from 'react-icons/bs';
import { useState } from 'react';
import Router from 'next/router';

import RenderCode from '../renderCode/RenderCode';
import EditCard from '../popups/EditCard';
import { useAuthValue } from '../utils/authContext';
import { database } from '../../firebaseClient';
import Success from '../notice/Success';
import Loader from '../loader/Loader'; 
import { useRenderContext } from '../utils/renderContext';

const Container = styled.div`
    position: absolute;
    display: flex;
    justify-content: stretch;
    align-items: center;
    width: 100%;
    height: 100%;
    top: 0;
    right: 0;
    background: var(--main-background-color);
    z-index: 99;

    .flex {
        display: flex;
    }

    .center-content {
        justify-content: center;
        align-items: center;
    }

    .noti-wrapper {
        position: absolute;
    }

    .middle {
        width: 70%;
        max-height: 70%;
        height: 70%;

        .note-wrapper {
            height: 100%;
            width: 80%;
            flex-direction: column;
            justify-content: space-between;

            .note-meta {
                justify-content: space-around;
                align-items: center;

                .content-type {
                    text-transform: capitalize;
                }

                span {
                    margin-right: 10px;
                    color: var(--secondary-text-color);
                }

            }

            .note-content {
                height: 65%;
                overflow: auto;
                padding: 20px;
                border-radius: 10px;
                border: 1px solid var(--border-color);
                background: var(--main-background-color);

                .note {
                    font-family: Roboto;
                    font-weight: 300;
                    color: var(--light-text-color);
                }
            }
    
            .actions {
                justify-content: space-between;
                align-items: flex-end;

                button {
                    background: none;
                }

                .edit, .delete {
                    border: 1px solid transparent;
                    color: var(--secondary-text-color);

                    & * {
                        transition: all 0s;
                    }

                    .icon {
                        margin-right: 4px;
                    }

                    &:hover {
                        border: 1px solid var(--border-color);
                        color: var(--primary-text-color);
                    }
                }

                .toggle-known {
                    color: var(--secondary-text-color);
                    font-weight: 600;

                    &.known {
                        color: #3b92fa;
                    }

                    .icon {
                        margin-left: 5px;
                    }
                }
            }
        }
        
    }

    .left, .right {
        width: 15%;
    }

    .previous, .next, .close-slider {
        cursor: pointer;
    }

    .previous, .next {
        height: 70px;
        width: 70px;
        border-radius: 50%;
        color: var(--secondary-text-color);

        &:hover {
            background: var(--light-background-color);
            color: var(--primary-text-color);
            box-shadow: var(--action-hover-box-shadow);
        }
    }

    .close-slider {
        position: absolute;
        top: 60px;
        right: 60px;
        height: 50px;
        width: 50px;
        border-radius: 50%;

        &:hover {
            box-shadow: var(--action-hover-box-shadow);
            background: var(--light-background-color);
        }
    }

    .confirm-delete {
        height: 100%;
        width: 100%;
        position: absolute;

        .wrapper {
            background: var(--dark-background-color);
            border-radius: 10px;
            padding: 30px;
            text-align: center;
            
            .actions {
                margin-top: 40px;

                button {
                    margin: 0px 10px;
                    color: var(--primary-text-color);

                    &.cancel {
                        background: none;
                        border: 1px solid var(--border-color);
                    }

                    &.delete-note {
                        background: var(--red-color);
                        border: 1px solid var(--red-color);
                    }
                }
            }
        }

    }

    @media screen and (max-width: 768px) {
        .middle {
            width: 80%;

            .note-wrapper {
                width: 90%;
            }
        }

        .close-slider {
            top: 30px;
            right: 30px;
        }

        .previous, .next {
            height: 50px;
            width: 50px;
        }
    }

    @media screen and (max-width: 600px) {
        justify-content: center;

        .left, .right {
            position: absolute;
            bottom: 30px;
        }

        .left {
            left: 30px;
        }

        .right {
            right: 30px;
        }

        .middle {
            width: 95%;
            max-height: 80%;
            height: 80%;
            padding-bottom: 30px;

           pre code *, pre code {
               font-size: 14px;
           }
        }

        .close-slider {
            top: 8px;
            right: 10px;
        }
    }
`;

interface Props {
    notes: DocumentData[],
    currentNote: DocumentData
}

const NotesSlider = ({ notes, currentNote }: Props) => {  
    const [activeIdx, setActiveIdx] = useState<number>(notes.indexOf(currentNote));
    const [editCard, setEditCard] = useState<boolean>(false);
    const [notification, setNotification] = useState<string>(null);
    const [confirmDelete, showConfirmDelete] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const { setShowSlider } = useSliderContextValue();
    const { currentUser } = useAuthValue();
    const { render, toggleRender } = useRenderContext();

    const nextNote = () => {
        setLoading(true);
        if(activeIdx + 1 === notes.length) {
            setActiveIdx(0);
        }else {
            setActiveIdx(activeIdx + 1);
        }
        setLoading(false);
    }

    const prevNote = () => {
        setLoading(true);
        if(activeIdx - 1 < 0) {
            setActiveIdx(notes.length - 1);
        } else {
            setActiveIdx(activeIdx - 1);
        }
        setLoading(false);
    }

    const toggleKnown = (note: DocumentData) => {
        setLoading(true);
        const docRef = doc(database, 'CategoryCollection', currentUser.uid, note.data().category, note.id);
        updateDoc(docRef, {
            known: !note.data().known,
        }).then(() => {
            note.data().known = !note.data().known;
            setNotification('Update successfull. Changes will appear after the slider is closed.');
            setLoading(false);
        }).catch((err) => {
            console.log(err.code);
            setLoading(false);
        });
    }

    const deleteNote = (note: DocumentData) => {
        setLoading(true);
        const docRef = doc(database, 'CategoryCollection', currentUser.uid, note.data().category, note.id);
        deleteDoc(docRef).then(() => {
            notes.splice(notes.indexOf(note), 1);
            if(notes.length === 0) {
                setLoading(false);
                Router.replace(Router.asPath);
            };

            if(activeIdx === 0) {
                setActiveIdx(notes.length -1);
            }else {
                setActiveIdx(activeIdx - 1);
            }

            setLoading(false);
            setNotification('Your note is deleted.')
            showConfirmDelete(false);
        }).catch((err) => {
            console.log(err);
            setLoading(false);
        });
    }

    return (
        <Container>
            { loading ? <Loader background="transparent"/> : ''}

            { editCard ? <EditCard note={ notes[activeIdx] } goBack={() => setEditCard(false)}/> : ''}

            { confirmDelete ? 
                <div className="confirm-delete flex center-content">
                    <div className="wrapper">
                        <p>You sure about this?</p>
                        <div className="actions">
                            <button className="cancel" onClick={() => showConfirmDelete(false)}>Nope, cancel</button>
                            <button className="delete-note" onClick={() => deleteNote(notes[activeIdx])}>Yes, delete</button>
                        </div>
                    </div>
                </div>
                :
                ''
            }

            <span onClick={() => {setShowSlider(false); toggleRender(!render)}} className="close-slider flex center-content">
                <IoCloseSharp size={30}/>
            </span>
            <div className="left flex center-content">
                <span onClick={prevNote} className="previous flex center-content"><MdOutlineArrowBack size={30}/></span>
            </div>
            <div className="middle flex center-content">
                { notification ? 
                    <div className="noti-wrapper">
                        <Success message={notification} setNotification={setNotification} closeable={true}/>
                    </div>
                    :
                    ''
                }
                <div className="note-wrapper flex">
                    <div className="note-meta flex">
                        <span className="category flex center-content">
                            <BsDot size={28} color="#FEAE12" className="icon"/>{ notes[activeIdx].data().category }
                        </span>
                        <span className="counter">{activeIdx + 1} of {notes.length}</span>
                        <span className="content-type flex center-content">
                            <BsDot color="#e91e63" size={28} className="icon"/>{ notes[activeIdx].data().contentType }
                        </span>
                    </div>
                    <div className="note-content">
                        { notes[activeIdx].data().contentType === 'text' ?
                            <p className="note">{notes[activeIdx].data().data}</p>
                            :
                            <RenderCode 
                                code={notes[activeIdx].data().data}
                                language={notes[activeIdx].data().language}
                            />
                        }
                    </div>
                    <div className="actions flex">
                        <button onClick={() => setEditCard(true)} className="edit flex center-content">
                            <MdModeEdit className="icon"/>
                            <span>Edit</span>
                        </button>
                        <button onClick={() => toggleKnown(notes[activeIdx])} className={`toggle-known flex center-content ${notes[activeIdx].data().known ? 'known' : ''}`}>
                            <span>Known</span>
                            { notes[activeIdx].data().known ?                            
                                <BsToggle2On size={22} color="#3b92fa" className="icon on"/>                          
                                :                        
                                <BsToggle2Off size={22} className="icon off"/>
                            }
                        </button>
                        <button onClick={() => showConfirmDelete(true)} className="delete flex center-content">
                            <MdDelete className="icon"/>
                            <span>Delete</span>
                        </button>
                    </div>
                </div>
            </div>
            <div className="right flex center-content">
                <span onClick={nextNote} className="next flex center-content"><MdOutlineArrowForward size={30}/></span>
            </div>
        </Container>
    );
}

export default NotesSlider