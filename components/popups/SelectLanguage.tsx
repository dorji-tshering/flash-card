import styled from 'styled-components';



const Container = styled.div`
    position: absolute;
    width: 70%;
    height: 70%;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: var(--dark-background-color);
    border: 1px solid var(--border-color);
    margin: auto;
    border-radius: 10px;

    .wrapper {

        h3 {
            text-align: center;
        }

        ul {
            margin: 30px 0px;
            max-height: 150px;
            overflow-y: auto;

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

        .actions {
            display: flex;
            justify-content: center;

            button {
                margin: 20px 10px;
            }
        }
    }
`;

const languages = ['javascript', 'python', 'typescript', 'css'];

const SelectLanguage = ({ goBack, next, setLanguage }) => {
    const chooseLanguage = (event: React.MouseEvent<HTMLLIElement>, language: string) => {
        setLanguage(language);
        let siblings = document.querySelectorAll('.languages li') as NodeListOf<HTMLElement>;
        siblings.forEach((el) => {
            el.style.borderColor = 'transparent';
        });
        event.currentTarget.style.borderColor = 'var(--border-color)';
        event.currentTarget.style.transition = 'all .3s';
    }

    return (
        <Container>
            <div className="wrapper">
                <h3>Select Language</h3>
                <ul className="languages">
                    { languages.map((language, idx) =>
                        <li onClick={(event) => chooseLanguage(event, language)} key={idx}>{ language }</li>
                    )}
                </ul>
                <div className="actions">
                    <button onClick={goBack} className="back secondary-button">Back</button>
                    <button onClick={next} className="next primary-button">Next</button>
                </div>
            </div>
        </Container>
    )
}

export default SelectLanguage;