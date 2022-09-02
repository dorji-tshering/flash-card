import { TbMenu } from 'react-icons/tb';
import styled from 'styled-components';
import Link from 'next/link';
import { BiLogOutCircle } from 'react-icons/bi';

import { useAuthValue } from '../utils/authContext';
import { logOutHelper } from '../utils/logoutHelper';

const Container = styled.header`
    background-color: var(--dark-background-color);
    display: flex;
    align-items: center;
    padding: 20px;
    box-shadow: 0px 1px 2px 2px rgb(0 0 0 / 25%);
    height: 80px;

    .logo {
        margin-left: 15px;

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
            display: flex;
            justify-content: center;
            align-items: center;
            margin-right: 15px;
            min-width: auto;
            border-radius: 50%;
            width: 37px;
            height: 37px;
            padding: 0;
        }
    }

    .menu-button {
        cursor: pointer;
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
                        <button onClick={logOutHelper} className="logout secondary-button"><BiLogOutCircle size={20}/></button>
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