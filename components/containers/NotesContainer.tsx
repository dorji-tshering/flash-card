import styled from 'styled-components';
import { RiEyeLine } from 'react-icons/ri';
import { DocumentData } from '@firebase/firestore';

import RenderCode from '../renderCode/RenderCode';
import { useSliderContextValue } from '../utils/sliderContext';

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

    @media screen and (max-width: 480px) {
        gap: 5px;
    }
`;

const GridElement = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-radius: 5px;
    padding: 15px;
    box-shadow: rgb(0 0 0 / 12%) 0px 2px 3px, rgb(0 0 0 / 24%) 0px 1px 50px;

    .wrapper-content {
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
        margin-top: 10px;
        font-size: 12px;
        align-items: center;
        text-transform: capitalize;
        
        span {
            font-family: 'Roboto';

            &.view-note {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 34px;
                width: 34px;
                border-radius: 50%;
                cursor: pointer;

                &:hover {
                    background: var(--light-background-color);
                }
            }
        } 
    }

    @media screen and (max-width: 480px) {
        padding: 10px;

        .wrapper-content {
            p {
                font-size: 12px;  
            }
        }

        .meta {
            font-size: 10px;
        }
    }

    @media screen and (max-width: 360px) {
        .wrapper-content {
            p {
                font-size: 10px;
            }
        }

        .meta {
            font-size: 9px;
        }
    }
`;

interface Props { 
    notes: DocumentData[]
}

const NotesContainer = ({ notes }: Props) => {
    const { setShowSlider, setSliderData } = useSliderContextValue();

    // open notes slider 
    const openSlider = (currentNote: any) => {
        const sliderData = {
            notes: notes,
            currentNote: currentNote
        }

        setSliderData(sliderData);
        setShowSlider(true);
    }

    return (
        <GridContainer>
            { notes.map((note: DocumentData, idx: number) => {
                return (
                    <GridElement key={idx}>
                        { note.data().contentType === 'code' ? 
                            <div className="wrapper-content"><RenderCode language={note.data().language} code={note.data().data} /></div>
                            :
                            <div className="wrapper-content"><p>{ note.data().data }</p></div>
                        }
                        <p className="meta">
                            <span className="category">{ note.data().category }</span>
                            <span className="content-type">{ note.data().contentType }</span>
                            <span onClick={() => openSlider(note)} className="view-note"><RiEyeLine/></span>
                        </p>                                  
                    </GridElement>
                    )
                }) 
            }
        </GridContainer>
    )
}

export default NotesContainer;