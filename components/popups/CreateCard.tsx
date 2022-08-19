import styled from 'styled-components';
import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';

import Modal from "../modal/Modal";
import SelectLanguage from "../popups/SelectLanguage";

const DynamicEditor = dynamic(() => import('../editor/Editor'), {
    ssr: false
});

const Container = styled.div`
    padding: 30px;
    min-width: 480px;
    min-height: 500px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    .choose-content {
        margin-top: -100px;
    }

    .choose-content-type {
        text-align: center;
    }

    .choose-content-type {
        .title {
            margin-top: 0;
        }

        .content-types {
            margin-top: 30px;

            button {
                background-color: var(--light-background-color);
                border: 1px solid var(--border-color);
                margin: 0px 10px;
                min-width: 120px;
                color: var(--primary-text-color);

                &.selected {
                    border-width: 2px;
                }
            }
        }
    }

    .action {
        margin-top: 80px;
        text-align: center;

        button {
            margin: 0px 10px;
        }
    }
`;


const CreateCard = ({ setCreateCard }) => {
    const [showContentChoose, setShowContentChoose] = useState<boolean>(true);
    const [editor, setEditor] = useState<string>(null);
    const [showEditor, setShowEditor] = useState<boolean>(false);
    const [language, setLanguage] = useState<string>(null);
    const [selectLanguage, setSelectLanguage] = useState<boolean>(false);
    const nextButtonRef = useRef<HTMLButtonElement>(null);
    
    const setContentEditor = (event: React.MouseEvent<HTMLButtonElement>, type: string) => {
        if(type === 'text') {
            setEditor('text');
            event.currentTarget.style.borderWidth = '2px';
            let otherButton = document.querySelector('.content-types .code') as HTMLElement | null;
            otherButton.style.borderWidth = '1px';
        } else if(type === 'code') {
            setEditor('code');
            event.currentTarget.style.borderWidth = '2px';
            let otherButton = document.querySelector('.content-types .text') as HTMLElement | null;
            otherButton.style.borderWidth = '1px';
        }
    }

    const showContentEditor = () => {
        if(editor === 'text') {
            setShowEditor(true);
            setShowContentChoose(false);
        } else if(editor === 'code') {
            setSelectLanguage(true);
            setShowContentChoose(false);
        }
    }

    const goBack = () => {
        setEditor(null);
        setShowEditor(false);
        setShowContentChoose(true);
        setLanguage(null);
        setSelectLanguage(false);
    }

    // disable next button if no content type is selected
    useEffect(() => {
        if(editor === null) {
            nextButtonRef.current.disabled = true;
        }else {
            nextButtonRef.current.disabled = false;
        }
    }, [editor])


    return (
        <Modal onClickOutside={() => setCreateCard(false)}>
            <Container>
                { selectLanguage ? 
                    <SelectLanguage 
                        goBack={goBack} 
                        next={() => 
                            {
                                setSelectLanguage(false);
                                setShowEditor(true);
                                setShowContentChoose(false);
                            }
                        }
                        setLanguage={setLanguage}
                    />
                    : '' }

                { showContentChoose ? 
                    <div className="choose-content">
                        <div className="choose-content-type">
                            <h3 className="title">Choose Content Type</h3>
                            <div className="content-types">
                                <button onClick={(event) => setContentEditor(event, 'text')} className="text">Text</button>
                                <button onClick={(event) => setContentEditor(event, 'code')} className="code">Code</button>
                            </div>
                        </div>
                        <div className="action">
                            <button onClick={() => setCreateCard(false)} className="cancel secondary-button">Cancel</button>
                            <button ref={nextButtonRef} onClick={showContentEditor} className="next primary-button">Next</button>
                        </div> 
                    </div> : ''
                }

                { showEditor && editor ? 
                    <DynamicEditor language={language} goBack={goBack} contentType={editor} /> : ''
                }

            </Container>
        </Modal>
    );
}

export default CreateCard;