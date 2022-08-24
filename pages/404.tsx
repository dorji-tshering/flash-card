import styled from 'styled-components';
import { AiFillMeh } from 'react-icons/ai';
import Layout from '../components/layout/Layout';

const Container = styled.div`
    text-align: center;

    .icon {
        margin-top: 150px;
        color: var(--secondary-text-color);
    }

    .message {
        color: var(--secondary-text-color);
    }
`;

const PageNotFound = () => {
    return (
        <Layout>
            <Container>
                <p className="icon"><AiFillMeh size={34}/></p>
                <p className="message">Uhh oh! Looks like the page you are requesting doesn't exist.</p>
            </Container>
        </Layout>  
    );
}

export default PageNotFound