import styled from 'styled-components';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BsQuestionOctagon } from 'react-icons/bs';
import { doc, getDoc } from 'firebase/firestore';

import { database } from '../../firebaseConfig';
import { useAuthValue } from '../utils/authContext';
import { logOut } from '../utils/logout';

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

`;

interface Props {
    setShowLogin: Function
    setCreateCard: Function
}

const DesktopHeader = ({ setShowLogin, setCreateCard }: Props) => {
    const [categories, setCategories] = useState<Array<string>>(null);
    const { currentUser } = useAuthValue();

    // get categories for a user
    useEffect(() => {
        if(currentUser) {
            const categoryDocRef = doc(database, "CategoryCollection", currentUser.uid);
            getDoc(categoryDocRef).then((docSnap) => {
                setCategories(docSnap.data().categories);
            }).catch((err) => {
                console.log(err.code);
            });
        }
    },[currentUser])

    return (
        <Container className="desktop">
            <div className="logo">
                <Link href="/">
                    <a>
                        <Image priority height={40} width={40} src="/fclogo.png" alt="fc-logo" className="logo-image" />
                    </a>
                </Link>
            </div> 
            { currentUser ? 
                <div className="card-categories">
                    { categories ? 
                        <ul>
                            { categories.map((category, idx) => {
                                return (
                                    <li key={idx}>
                                        <Link href={`/category/${category}`}>
                                            <a>{category}</a>
                                        </Link>
                                    </li>)
                            }) }
                        </ul>
                        :
                        <div className="no-category">No Categories</div>
                    }
                    <div className="add-category-info">
                        <span className="tooltip">Adding new category is allowed only when you create a new card.</span>
                        <BsQuestionOctagon className='icon' size={20}/>
                    </div>
                </div>
                :
                ''
            }
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
    )
}

export default DesktopHeader;