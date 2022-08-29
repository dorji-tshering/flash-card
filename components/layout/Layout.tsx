import { useState } from 'react';
import { DocumentData } from '@firebase/firestore';
import styled from 'styled-components';

import DesktopHeader from '../header/DesktopHeader';
import MobileHeader from '../header/MobileHeader';
import Footer from '../footer/Footer';
import useMediaQuery from '../utils/useMediaQuery';
import MobileMenu from '../menu/MobileMenu';
import LoginRegister from '../login/LoginRegister';
import CreateCard from '../popups/CreateCard';
import NotesSlider from '../slider/NotesSlider';
import { SliderProvider } from '../utils/sliderContext';
import { RenderContextProvider } from '../utils/renderContext';



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
    const [render, toggleRender] = useState<boolean>(false);
 
    const mobileDevice = useMediaQuery('991');

    // slider context value 
    const sliderContextValue = {
        setShowSlider: setShowSlider,
        setSliderData: setSliderData
    }

    const renderContextValue = {
        render,
        toggleRender
    }

    return (
        <Container className="main-entry">
            { showSlider ? 
                <RenderContextProvider value={renderContextValue}>
                    <SliderProvider value={sliderContextValue}>
                        <NotesSlider
                            notes={sliderData.notes}
                            currentNote={sliderData.currentNote}
                        />
                    </SliderProvider>
                </RenderContextProvider>
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

            <RenderContextProvider value={renderContextValue}>
                <SliderProvider value={sliderContextValue}>
                    <main className='main-content'>{ children }</main>
                </SliderProvider>
            </RenderContextProvider>

            <Footer/>
        </Container>
    );
}

export default Layout;