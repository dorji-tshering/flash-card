import styled from 'styled-components';
import Link from 'next/link';
import Router from 'next/router';

import { useCategoryContext } from '../utils/categoryContext';

const Container = styled.div`
    height: 100%;

    .github-link {
        font-weight: 400;
        color: var(--secondary-text-color);
        position: absolute;
        bottom: 0px;
        text-align: center;
        width: 100%;
        margin: 0px;
        padding: 20px;
        border-top: 1px solid var(--border-color);
        background: var(--main-background-color);
    }

    .wrapper {
        overflow-y: auto;
        height: 100%;
    }

    .category-title {
        font-weight: 500;
        margin: 0;
        padding: 15px 0px 15px 20px;
        border-bottom: 1px solid var(--border-color);
        text-transform: uppercase;
        font-size: 9px;
        letter-spacing: 2px;
    }

    .category-wrapper {
        margin: 0;

        li {
            list-style-type: none;

            a {
                display: block;
                color: var(--primary-text-color);
                padding: 15px 20px;

                &.active {
                    color: var(--yellow-color);
                }
            }
        }
    }

    .no-category {
        padding: 30px;
        margin-top: 100px;
        text-align: center;
    }
`;

const UserMenu = () => {
    const { categories } = useCategoryContext();

    return (
        <Container>
            <Link href="https://github.com/dorji-tshering/flash-card">
                <a className="github-link">Github</a>
            </Link>
            { categories.length > 0 ?
                <div className="wrapper">
                    <h3 className="category-title">{categories.length === 1 ? 'Category' : 'Categories'}</h3> 
                    <ul className="category-wrapper">
                        { categories.map((cat: string, idx: number) => (
                            <li key={idx} className="category">
                                <Link href={`/category/${cat}`}>
                                    <a className={Router.query?.id === cat ? 'active' : ''}>{cat}</a>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            :
            <div className="no-category">
                <p>You don't have any categories for now. It will appear here once you start creating cards.</p>
            </div>
            }
        </Container>
    )
}

export default UserMenu;