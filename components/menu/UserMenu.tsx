import styled from 'styled-components';
import Link from 'next/link';

import { useAuthValue } from '../utils/authContext';
import { useCategoryContext } from '../utils/categoryContext';

const Container = styled.div`

    * {
        text-align: center;
    }

    .user {
        font-weight: 400;
        color: var(--secondary-text-color);
    }

    .category-title {
        font-weight: 500;
        margin-top: 30px;
        padding-bottom: 15px;
        border-bottom: 1px solid var(--secondary-text-color);
        text-transform: uppercase;
        font-size: 13px;
    }

    .category-wrapper {
        li {
            list-style-type: none;

            a {
                display: block;
                color: var(--primary-text-color);
                padding: 15px;
            }
        }
    }

    .no-category {
        padding: 30px;
        margin-top: 100px;
    }
`;

const UserMenu = () => {
    const { categories } = useCategoryContext();
    const { currentUser } = useAuthValue();

    return (
        <Container>
            <h4 className="user">{currentUser.email}</h4>
            { categories.length > 0 ?
                <>
                    <h3 className="category-title">Category</h3> 
                    <ul className="category-wrapper">
                        { categories.map((cat: string, idx: number) => (
                            <li key={idx} className="category">
                                <Link href={`/category/${cat}`}>
                                    <a>{cat}</a>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </>
            :
            <div className="no-category">
                <p>You don't have any categories for now. It will appear here once you start creating cards.</p>
            </div>
            }
        </Container>
    )
}

export default UserMenu;