import { useState } from 'react';
import { DocumentData } from '@firebase/firestore';

import DesktopHeader from '../header/DesktopHeader';
import MobileHeader from '../header/MobileHeader';
import Footer from '../footer/Footer';
import styled from 'styled-components';
import useMediaQuery from '../utils/useMediaQuery';
import MobileMenu from '../menu/MobileMenu';
import LoginRegister from '../login/LoginRegister';
import CreateCard from '../popups/CreateCard';
import NotesSlider from '../slider/NotesSlider';
import { SliderProvider } from '../utils/sliderContext';



const Container = styled.div`
    background-color: var(--main-background-color);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 100vh;
    max-height: 100vh;

    .main-content {
        position: relative;
        flex: 2;
        overflow-y: auto;
    }
`;     

interface childType {
    children: React.ReactNode
}

const Layout = ({ children }: childType) => {
    const [showMenu, setShowMenu] = useState<boolean>(false);
    const [showLogin, setShowLogin] = useState<boolean>(false);
    const [createCard, setCreateCard] = useState<boolean>(false);
    const [showSlider, setShowSlider] = useState<boolean>(false);
    const [sliderData, setSliderData] = useState<{notes: DocumentData[], currentNote: DocumentData}>(null);
 
    const mobileDevice = useMediaQuery('991');

    // slider context value 
    const sliderContextValue = {
        setShowSlider: setShowSlider,
        setSliderData: setSliderData
    }

    return (
        <Container className="main-entry">
            { showSlider ? 
                <SliderProvider value={sliderContextValue}>
                    <NotesSlider
                        notes={sliderData.notes}
                        currentNote={sliderData.currentNote}
                    />
                </SliderProvider>
                : 
                '' 
            }

            { createCard ? <CreateCard setCreateCard={setCreateCard} /> : '' }

            { showLogin ? <LoginRegister onClickOutside={() => setShowLogin(false)}/> : ''}

            <MobileMenu showMenu={showMenu} setShowMenu={setShowMenu} />

            { mobileDevice ? 
                <MobileHeader 
                    setShowMenu={setShowMenu} 
                    setShowLogin={setShowLogin}
                    setCreateCard={setCreateCard}
                /> 
                : 
                <DesktopHeader
                    setShowLogin={setShowLogin}
                    setCreateCard={setCreateCard}
                /> 
            }

            <SliderProvider value={sliderContextValue}>
                <main className='main-content'>{ children }</main>
            </SliderProvider>

            <Footer/>
        </Container>
    );
}

export default Layout;