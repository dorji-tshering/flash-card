import { useEffect, useState, createContext, SetStateAction, Dispatch } from 'react';
import styled from 'styled-components';
import { RiArrowDownSLine } from 'react-icons/ri';
import { collection, addDoc, doc, getDoc, setDoc, arrayUnion, updateDoc, DocumentData } from 'firebase/firestore';
import { useAuthValue } from '../utils/authContext';

import ace from 'ace-builds/src-noconflict/ace';
import monokai from 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-python';  
import 'ace-builds/src-noconflict/mode-typescript';
import 'ace-builds/src-noconflict/mode-css';

import SelectCategory from '../popups/SelectCategory';
import { database } from '../../firebaseClient';
import Success from '../notice/Success';
import Loader from '../loader/Loader';
import Router from 'next/router';


const Container  = styled.div`
    position: relative;

   .form-wrapper {
       .text-area, .code-area {
           background-color: transparent;
           border-color: var(--border-color);
           border-radius: 5px;
           padding: 15px;
           resize: none;
           overflow-y: auto;

           &:focus {
               outline: 0;
           }
       }

       .select-category {
            text-align: center;

            button {
                background: none;
                color: var(--primary-text-color);
                display: flex;
                justify-content: center;
                align-items: center;
                margin: 15px auto;
                border: 1px solid var(--border-color);

                .icon {
                    margin-left: 5px;
                    color: var(--secondary-text-color);
                }
            }
       }

       .actions {
           display: flex;
           justify-content: center;
           align-items: center;

           .save, .back {
                margin: 15px;
           }
       }
   }

   .noti-wrapper {
        position: absolute;
        top: -50px;
        width: 100%;
        z-index: 10;
   }

   .editor {
        position: relative;
        height: 300px;
        width: 300px;
        margin-bottom: 30px;

        .text-area {
            height: 100%;
            width: 100%;
        }

        #code-editor {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            border-radius: 4px;
            margin-bottom: -20px;

            & * {
                font-family: monospace;
            }

            .ace_content {
                padding: 8px 0px;
            }

            .ace_scrollbar-v {
                display: none;
            }
 
        }

   }
`;

// set category context
export const CategoryContext = createContext(null);

interface Props {
    goBack: Function,
    contentType: string
    language: string
    forEdit?: boolean,
    note?: any
}

const Editor = ({ goBack, contentType, language, note, forEdit=false }: Props) => {
    const [doneEditing, setDoneEditing] = useState<boolean>(false);
    const [showCategory, setShowCategory] = useState<boolean>(false);
    const [category, setCategory] = useState<string>(null);
    const [textContent, setTextContent] = useState<string>(null);
    const [notification, setNotification] = useState<string>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const catContextValue = {
        setCategory: setCategory,
    }

    const { currentUser } = useAuthValue();

    let editor: any;

    // save card
    const saveContent = (event: React.FormEvent) => {
        event.preventDefault();

        if(!category) {
            alert('Please select a category');
            return;   
        }

        // check for any non-space characters or empty string
        if(contentType === 'text') {
            if (!/\S/.test(textContent) || !textContent) {
                alert('Your text note is empty');
                return;
            }
        } else if(contentType === 'code') {
            if(!/\S/.test(editor.getValue())) {
                alert('Your code note is empty');
                return;
            }
        }

        setLoading(true);

        const categoryCollectionRef = collection(database, 'CategoryCollection', currentUser.uid, category );

        const cardData = {
            data: contentType === 'text' ? textContent : editor.getValue(),
            category: category,
            userId: currentUser.uid,
            contentType : contentType,
            language: contentType === 'code' ? language : null,
            known: false
        }

        // create or update category array of a user
        const docRef = doc(database, "CategoryCollection", currentUser.uid);
        getDoc(docRef).then((doc) => {
            if(doc.exists()) {
                updateDoc(docRef, {
                    categories: arrayUnion(category)
                }).then((res) => {
                    console.log('');
                }).catch((err) => {
                    console.log(err.code); 
                });
            }else {
                setDoc(docRef, {
                    categories: [category]
                }).catch((err) => {
                    console.log(err.code);
                });
            }
        }).catch((err) => {
            console.log(err.code);
        });

        // add notes under the specified category collection
        addDoc(categoryCollectionRef, cardData).then((res) => {
            setNotification('Card saved successfully.');
            setLoading(false);
            Router.replace(`/category/${category}`);
        }).catch((err) => {
            console.log(err);
            setLoading(false);
        });
        
    }

    const updateCard = (event: React.FormEvent) => {
        event.preventDefault();
        const docRef = doc(database, 'CategoryCollection', currentUser.uid, note.category, note.docId);
        setLoading(true);
        updateDoc(docRef, {
            data: contentType === 'text' ? textContent : editor.getValue(),
        }).then(() => {
            note.data = contentType === 'text' ? textContent : editor.getValue();
            setDoneEditing(true);
            setLoading(false);
            setNotification('Card updated successfully.');
        }).catch(err => {
            console.log(err.code);
            setLoading(false);
        });
    }

    // set up ace code editor 
    useEffect(() => {
        // only if the contentType is code 
        if(contentType === 'code') {
            editor = ace.edit('code-editor');
            editor.setTheme(monokai);
            if(forEdit) {
                editor.setValue(note.data);
            }
            editor.setOptions({
                useWorker: false,
                showGutter: false,
                cursorStyle: 'slim',
                wrap: true
            });
            

            // set mode based on language selected by the user
            switch(language) {
                case 'javascript':
                    editor.session.setMode("ace/mode/javascript");
                    break;
                case 'typescript':
                    editor.session.setMode("ace/mode/typescript");
                    break;
                case 'python':
                    editor.session.setMode("ace/mode/python");
                    break;
                default:
                    editor.session.setMode("ace/mode/css");
                    break;
                
            }
        }
    },[]);

    return (
        <CategoryContext.Provider value={catContextValue}>
            <Container>
                { loading ? <Loader background="transparent"/> : ''}

                { notification ? 
                    <div className="noti-wrapper">
                        <Success message={notification} closeable={true} setNotification={setNotification}/>
                    </div>
                    :
                    ''
                }

                { showCategory ? 
                <SelectCategory 
                    goBack={() => setShowCategory(false)}
                    setCategory={setCategory}
                /> : ''}

                <div className="form-wrapper">
                    <form onSubmit={forEdit ? updateCard : saveContent}>
                        <div className="editor">
                            { contentType === 'text' ? 
                                <textarea 
                                    name="text-content" 
                                    onChange={(e) => setTextContent(e.target.value)} 
                                    className="text-area" 
                                    placeholder="Enter your text..."
                                    defaultValue={note?.data}>
                                </textarea>
                                :
                                <div id="code-editor"></div>
                            }
                        </div>
                        { forEdit ? 
                            ''
                            :
                            <div className="select-category">
                                <button type="button" onClick={() => setShowCategory(true)} >
                                    <span>{ category ? category : 'Select Category' }</span> <RiArrowDownSLine className="icon" size={20}/>
                                </button>
                            </div>
                        }
                        <div className="actions">
                            <button type="button" onClick={() => goBack()} className="back secondary-button">
                                { forEdit ? doneEditing ? 'Done' : 'Cancel' : 'Back'}
                            </button>
                            <button type='submit' className="save primary-button">
                                { forEdit ? 'Update' : 'Save'}
                            </button>
                        </div>
                    </form>
                </div>
            
            </Container>
        </CategoryContext.Provider>
    )
}

export default Editor;