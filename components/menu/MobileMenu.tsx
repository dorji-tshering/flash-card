import React, { useRef } from 'react';
import styled from 'styled-components';
import { useAuthValue } from '../utils/authContext';
import UserMenu from './UserMenu';
import GuestMenu from './GuestMenu';
import { RiArrowLeftFill } from 'react-icons/ri';

const Container = styled.div`
    width: 280px;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    height: 100vh;
    transform: translateX(-100%);
    background: var(--main-background-color);
    z-index: 1;
    overflow-y: auto;

    &.show {
        transform: none;
        transition: all .3s;
    }

    .close-menu {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        height: 30px;
        width: 30px;
        top: 10px;
        right: 10px;
        background: var(--light-background-color);
        cursor: pointer;
    }

`;

interface MenuProps {
    showMenu: boolean,
    setShowMenu: Function,
}

const MobileMenu = ({ showMenu, setShowMenu}: MenuProps) => {
    const ref = useRef(null);
    const { currentUser } = useAuthValue();

    function hideMenu() {
        // set style only once
        if(!ref.current.style.transition) {
            ref.current.style.transition = 'all .3s';
        }
        setShowMenu(false);
    } 

    return (
        <Container ref={ref} className={showMenu ? 'show' : ''}>
            { currentUser ? 
                <UserMenu/>
            :
                <GuestMenu/>
            }
        <span className="close-menu" onClick={hideMenu}> <RiArrowLeftFill size='18'/></span>
        </Container>
    );
}

export default MobileMenu;