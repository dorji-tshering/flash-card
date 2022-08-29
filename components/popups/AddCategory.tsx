import { useState, useContext } from 'react';
import styled from 'styled-components';
import { CategoryContext } from '../editor/Editor';

const Container = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--dark-background-color);
    border-radius: 5px;
    border: 1px solid var(--border-color);

    .add-category-form {

        input {
            width: 200px;
            margin: 10px auto;
        }

        h4 {
            text-align: center;
        }

        .actions {
            display: flex;
            justify-content: center;
            margin-top: 50px;

            button {
                margin: 20px 10px;
            }
        }
    }

`;

interface Props {
    goBack: Function,
    setCategory: Function,
    modular: boolean,
}

const AddCategory = ({ goBack }) => {
    const [newCategory, setNewCategory] = useState(null);

    const { setCategory } = useContext(CategoryContext);

    const addCategory = (event: React.FormEvent) => {
        event.preventDefault();
        setCategory(newCategory);
        goBack();
    }

    return (
        <Container>
            <form onSubmit={addCategory} className="add-category-form">
                <h4>Add Category</h4>
                <input 
                    type="text" 
                    placeholder="Category Name"
                    onChange={(e) => setNewCategory(e.target.value)}
                />
                <div className="actions">
                    <button type="button" onClick={goBack} className="back secondary-button">Back</button>
                    <button type="submit" className="save primary-button">Save</button>
                </div>
            </form>

        </Container>
    )
}

export default AddCategory;