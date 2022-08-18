import { useRef } from 'react';
import styled from 'styled-components';
import { CgClose } from 'react-icons/cg';

const Container = styled.div`
    width: 100vw;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    height: 100vh;
    transform: translateX(-100%);
    background: var(--main-background-color);

    &.show {
        transform: none;
        transition: all .3s;
    }

    .close-menu {
        position: absolute;
        top: 20px;
        right: 20px;
    }

`;

interface MenuProps {
    showMenu: boolean,
    setShowMenu: Function,
}

const MobileMenu = ({ showMenu, setShowMenu}: MenuProps) => {
    const ref = useRef(null);

    function hideMenu() {
        // set style only once
        if(!ref.current.style.transition) {
            ref.current.style.transition = 'all .3s';
        }
        setShowMenu(false);
    }

    return (
        <Container ref={ref} className={showMenu ? 'show' : ''}>
            <ul className="menu-items">
                <li>Menu One</li>
                <li>Menu One</li>
                <li>Menu One</li>
                <li>Menu One</li>
            </ul>

        <span className="close-menu" onClick={hideMenu}> <CgClose size='24'/></span>
        </Container>
    );
}

export default MobileMenu;