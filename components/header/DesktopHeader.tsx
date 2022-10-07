import styled from 'styled-components';
import Image from 'next/image';
import Link from 'next/link';
import Router from 'next/router';

import { useAuthValue } from '../utils/authContext';
import { logOutHelper } from '../utils/logoutHelper';
import { useCategoryContext } from '../utils/categoryContext';

const Container = styled.header`
    background: var(--dark-background-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 100px;
    box-shadow: 0px 1px 2px 2px rgb(0 0 0 / 25%);
    height: 80px;

    .logo {

    } 

    .card-categories {
        display: flex;
        align-items: center;
        
        ul {
            display: flex;
            list-style-type: none;
            
            li {
                padding: 0px 10px;
                cursor: pointer;

                a {
                    color: var(--primary-text-color);
                    text-transform: capitalize;

                    &.active {
                        color: var(--yellow-color);
                    }

                    &:hover {
                        color: var(--yellow-color);
                    }
                } 
            }
        }

        .add-category-info {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 10px;
            margin-left: 15px;
            border-radius: 50%;
            color: var(--secondary-text-color);
            position: relative;
            
            &:hover {
                background: var(--light-background-color);
                color: var(--primary-text-color);
                transition: all .3s;

                .tooltip {
                    visibility: visible;
                }
            }

            .tooltip {
                visibility: hidden;
                position: absolute;
                z-index: 1;
                display: block;
                width: 250px;
                right: 50px;
                font-size: 12px;
                line-height: 1.3;
                background: var(--light-background-color);
                padding: 8px 10px;
                border-radius: 10px;
                color: var(--secondary-text-color);
                transition: all .3s;
                text-align: center;
            }


            
            
        }
    
    }

    .action {
        display: flex;
        align-items: center;

        .logout {
            margin-right: 10px;
        }
    }

    @media screen and (max-width: 1190px) {
        .card-categories {
            max-width: 400px;
            overflow-x: auto;
        }
    }

`;

interface Props {
    setShowLogin: Function
    setCreateCard: Function
}

const DesktopHeader = ({ setShowLogin, setCreateCard }: Props) => {
    const { currentUserId } = useAuthValue();
    const { categories } = useCategoryContext();

    return (
        <Container className="desktop">
            <div className="logo">
                <Link href="/">
                    <a>
                        <Image priority height={40} width={40} src="/fclogo.png" alt="fc-logo" className="logo-image" />
                    </a>
                </Link>
            </div> 
            { currentUserId ? 
                <div className="card-categories">
                    { categories ? 
                        <ul>
                            { categories.map((category: string, idx: number) => {
                                return (
                                    <li key={idx}>
                                        <Link href={`/category/${category}`}>
                                            <a className={Router.query?.id === category ? 'active' : ''}>{category}</a>
                                        </Link>
                                    </li>)
                            }) }
                        </ul>
                        :
                        ''
                    }
                </div>
                :
                ''
            }
            <div className="action">
                { currentUserId ? 
                    <>
                        <button onClick={logOutHelper} className="logout secondary-button">Logout</button>
                        <button onClick={() => setCreateCard(true)} className="create-card primary-button"> 
                            <span>Create</span>
                        </button>
                    </>
                    :
                    <button onClick={() => setShowLogin(true)} className="login primary-button">Login</button>
                }
            </div>
        </Container>
    )
}

export default DesktopHeader;