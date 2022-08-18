import { useState } from 'react';
import { TbMenu } from 'react-icons/tb';
import { FiPlus } from 'react-icons/fi';
import styled from 'styled-components';
import Link from 'next/link';
import { useAuthValue } from '../utils/authContext';
import { logOut } from '../utils/logout';


const Container = styled.header`
    background-color: var(--dark-background-color);
    display: flex;
    align-items: center;
    padding: 20px;
    box-shadow: 0px 1px 2px 2px rgb(0 0 0 / 25%);
    height: 80px;

    .logo {
        margin-left: 30px;

        height: 40px;
        
        img {
            height: 100%;
        }
    }

    .action {
        margin-left: auto;
        display: flex;
        align-items: center;

        .logout {
            margin-right: 15px;
        }
    }
`;

interface MenuProps { 
    setShowMenu: Function,
    setShowLogin: Function,
    setCreateCard: Function
}

const MobileHeader = ({ setShowMenu, setShowLogin, setCreateCard }: MenuProps) => {
    const { currentUser } = useAuthValue();

    return (
        <Container className="mobile">
            <div className="menu-button">
                <span onClick={() => setShowMenu(true)}><TbMenu size='28'/></span>
            </div>
            <div className="logo">
                <Link href="/">
                    <a>
                        <img src="/fclogo.png" alt="fc-logo" className="fclogo" />
                    </a>
                </Link>
            </div>
            <div className="action">
                { currentUser ? 
                    <>
                        <button onClick={logOut} className="logout secondary-button">Logout</button>
                        <button onClick={() => setCreateCard(true)} className="create-card primary-button"> 
                            <span>Create</span>
                        </button>
                    </>
                    :
                    <button onClick={() => setShowLogin(true)} className="login primary-button">Login</button>
                }
            </div>
        </Container>
    );
}

export default MobileHeader;