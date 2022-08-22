import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { database } from '../../firebaseClient';

import AddCategory from './AddCategory';
import { useAuthValue } from '../utils/authContext';
import { useCategoryContext } from '../utils/categoryContext';



const Container = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: var(--dark-background-color);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 1px solid var(--border-color);
    border-radius: 5px;
    padding: 30px;
    z-index: 10;

    .category-wrapper {
        margin-top: -50px;

        h4 {
            margin-top: 30;
            text-align: center;
        }

        .categories {
            margin: 30px 0px;
            max-height: 150px;
            overflow-y: auto;
            min-height: 150px;

            li {
                list-style-type: none;
                padding: 8px;
                cursor: pointer;
                text-align: center;
                transition: all .3s;
                color: var(--secondary-text-color);
                border-radius: 2px;
                border: 2px solid transparent;

                &:hover {
                    background-color: var(--light-background-color);
                    color: var(--primary-text-color);
                }
            }
        }

        .no-category {
            margin-bottom: 100px;
            margin-top: 50px;

            p {
                text-align: center;
                color: var(--secondary-text-color);
            }
        }

        .actions {
            display: flex;
            justify-content: center;    

            button {
                margin: 20px 10px;
            }
        }
    }

`;



interface Props {
    goBack: Function,
    setCategory: Function
}


const CategorySelect = ({ goBack, setCategory }: Props) => {
    const [showAddNew, setShowAddNew] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    
    const { categories } = useCategoryContext();

    const chooseCategory = (event: React.MouseEvent<HTMLLIElement>, category: string) => {
        setCategory(category);
        let siblings = document.querySelectorAll('.categories li') as NodeListOf<HTMLElement>;
        siblings.forEach((el) => {
            el.style.borderColor = 'transparent';
        });
        event.currentTarget.style.borderColor = 'var(--border-color)';
        event.currentTarget.style.transition = 'all .3s';
    }

    return (
        <Container>
            { showAddNew ? 
                <AddCategory goBack={() => setShowAddNew(false)}/>
                : 
                ''
            }

            <div className="category-wrapper">
                { categories.length > 0 ? 
                    <>
                        <h4>You have {categories.length} categories</h4>
                        <ul className="categories">
                            { categories.map((cat, idx) => 
                                <li onClick={(event) => chooseCategory(event, cat)} key={idx}>{cat}</li>
                            ) }
                        </ul>
                        <div className="actions">
                            <button onClick={() => setShowAddNew(true)} className="add-new secondary-button">Add new</button>
                            <button onClick={() => goBack()} className="done primary-button">Done</button>
                        </div>
                    </> 
                    : 
                    <>
                        <div className="no-category">
                            <p>You don't have any categories. Add new to get started. After adding new category, head back to the editor.</p>
                        </div>
                        <div className="actions">
                            <button onClick={() => goBack()} className="done secondary-button">Back</button>
                            <button onClick={() => setShowAddNew(true)} className="add-new primary-button">Add new</button>
                        </div>
                    </>
                }
            </div>
        </Container>
    )
}

export default CategorySelect;