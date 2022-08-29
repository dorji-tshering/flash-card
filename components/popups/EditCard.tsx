import { DocumentData } from '@firebase/firestore';
import styled from 'styled-components';
import { Dispatch, SetStateAction, useState } from 'react';
import dynamic from 'next/dynamic';

const DynamicEditor = dynamic(() => import('../editor/Editor'), {
    ssr: false
});

const Container = styled.div`
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    top: 0;   
    right: 0;
    z-index: 999;

    .wrapper {
        background: var(--dark-background-color);
        padding: 30px;
        border-radius: 10px;
    }
`;

interface Props {
    note: DocumentData,
    goBack: Dispatch<SetStateAction<boolean>>
}

const EditCard = ({ note, goBack }: Props) => {

    return (
        <Container>
            <div className="wrapper">
                <DynamicEditor 
                    goBack={goBack} 
                    contentType={note.data().contentType} 
                    language={note.data().language}
                    forEdit={true}
                    note={note}
                />
            </div>
        </Container>
    );
}

export default EditCard;