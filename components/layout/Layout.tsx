import { useState } from 'react';

import DesktopHeader from '../header/DesktopHeader';
import MobileHeader from '../header/MobileHeader';
import Footer from '../footer/Footer';
import styled from 'styled-components';
import useMediaQuery from '../utils/useMediaQuery';
import MobileMenu from '../menu/MobileMenu';
import LoginRegister from '../login/LoginRegister';
import CreateCard from '../popups/CreateCard';
import Modal from '../modal/Modal';

const Container = styled.div`
    background-color: var(--main-background-color);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 100vh;
    max-height: 100vh;

    .main-content {
        flex: 2;
        overflow-y: auto;
    }
`;

interface childType {
    children: React.ReactNode
}

const Layout = ({ children }: childType) => {
    const [showMenu, setShowMenu] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [createCard, setCreateCard] = useState(false);
    const [addCategory, setAddCategory] = useState(false);

    const mobileDevice = useMediaQuery('991');

    return (
        <Container className="main-entry">
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

            <main className='main-content'>{ children }</main>

            <Footer/>
        </Container>
    );
}

export default Layout;