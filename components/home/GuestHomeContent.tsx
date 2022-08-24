import styled from 'styled-components';
import { AiFillGithub } from 'react-icons/ai';

const Container  = styled.div`
    text-align: center;
    
    p {
        max-width: 400px;
        margin: 150px auto auto;

        a {
            color: var(--yellow-color);
            border-bottom: 1px dotted var(--yellow-color);
        }
    }

    .repo-link {
        margin-top: 50px;

        a {
            color: var(--secondary-text-color);

            &:hover {
                color: var(--theme-color);
            }
        }
    }
`;

const GuestHomeContent = () => {
    return (
        <Container>
            <p>If you wish to try the application, please contact me via <a href="mailto:dorji.contact@gmail.com" target="_blank">dorji.contact@gmail.com</a> to authorize your email.</p>
            <div className="repo-link">
                <a href="https://github.com/dorji-tshering/flash-card" className="github"><AiFillGithub size={34}/></a>
            </div>
        </Container>
    );
}

export default GuestHomeContent;