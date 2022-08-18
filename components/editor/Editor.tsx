import { useEffect, useState, createContext } from 'react';
import styled from 'styled-components';
import { RiArrowDownSLine } from 'react-icons/ri';
import { collection, addDoc, doc, getDoc, setDoc, arrayUnion, updateDoc } from 'firebase/firestore';
import { useAuthValue } from '../utils/authContext';

import ace from 'ace-builds/src-noconflict/ace';
import monokai from 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-python'; 
import 'ace-builds/src-noconflict/mode-typescript';
import 'ace-builds/src-noconflict/mode-css';

import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/ext-elastic_tabstops_lite';

import SelectCategory from '../popups/SelectCategory';
import { database } from '../../firebaseConfig';
import Success from '../notice/Success';


//ace.config.set("basePath", "/node_modules/ace-builds/src-noconflict/");


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

   .editor {
        position: relative;
        height: 280px;
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
}

const Editor = ({ goBack, contentType, language }: Props) => {
    const [showCategory, setShowCategory] = useState<boolean>(false);
    const [category, setCategory] = useState<string>(null);
    const [textContent, setTextContent] = useState<string>(null);
    const [notification, showNotification] = useState<string>(null);

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

        let userId: string = currentUser.uid;
        const categoryCollectionRef = collection(database, 'CategoryCollection', userId, category );

        const cardData = {
            data: contentType === 'text' ? textContent : editor.getValue(),
            category: category,
            userId: userId,
            contentType : contentType,
            language: contentType === 'code' ? language : null,
            known: false
        }

        // create or update category array of a user
        const docRef = doc(database, "CategoryCollection", userId);
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
            if(res) {
                showNotification('Card saved successfully.');
            }
        }).catch((err) => {
            console.log(err);
        });
        
    }

    // set up ace code editor
    useEffect(() => {
        // only if the contentType is code 
        if(contentType === 'code') {
            editor = ace.edit('code-editor');
            editor.setTheme(monokai);
            editor.setOptions({
                autoScrollEditorIntoView: true,
                copyWithEmptySelection: true,
                useWorker: false,
                hScrollBarAlwaysVisible: false,
                vScrollBarAlwaysVisible: false,
                showGutter: false,
                animatedScroll: true,
                scrollPastEnd: true,
                wrap: true,
                enableBasicAutocompletion: true,
                enableLiveAutocompletion:   true,
                enableSnippets: true
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
    })

    return (
        <CategoryContext.Provider value={catContextValue}>
            <Container>
                { notification ? 
                    <Success message={notification} closeable={true} showNotification={showNotification}/> : ''
                
                }

                { showCategory ? 
                <SelectCategory 
                    goBack={() => setShowCategory(false)}
                    setCategory={setCategory}
                /> : ''}

                <div className="form-wrapper">
                    <form onSubmit={saveContent}>
                        <div className="editor">
                            { contentType === 'text' ? 
                                <textarea 
                                    name="text-content" 
                                    onChange={(e) => setTextContent(e.target.value)} 
                                    className="text-area" 
                                    placeholder="Enter your text...">
                                </textarea>
                                :
                                <div id="code-editor"></div>
                            }
                        </div>
                        <div className="select-category">
                            <button type="button" onClick={() => setShowCategory(true)} >
                                <span>{ category ? category : 'Select Category' }</span> <RiArrowDownSLine className="icon" size={20}/>
                            </button>
                        </div>
                        <div className="actions">
                            <button type="button" onClick={() => goBack()} className="back secondary-button">Back</button>
                            <button type='submit' className="save primary-button">Save</button>
                        </div>
                    </form>
                </div>
            
            </Container>
        </CategoryContext.Provider>
    )
}

export default Editor;