import styled from 'styled-components';
import { AiFillMeh } from 'react-icons/ai';
import Layout from '../components/layout/Layout';
import Link from 'next/link';
import Head from 'next/head';

const Container = styled.div`
    text-align: center;

    .icon {
        margin-top: 150px;
        color: var(--secondary-text-color);
    }

    .message {
        color: var(--secondary-text-color);
    }

    .action {
        a {
            display: inline-block;
            margin-top: 35px;
            color: var(--primary-text-color);
            border: 1px solid var(--border-color);
        }
    }
`;

const PageNotFound = () => {


    return (
        <Layout>
            <Head>
                <title>Not Found</title>
            </Head>
            <Container>
                <p className="icon"><AiFillMeh size={34}/></p>
                <p className="message">Uhh oh! Looks like the page you are requesting doesn't exist.</p>
                <div className="action">
                    <Link href="/">
                        <a className='button'>Back to Home</a>
                    </Link>
                </div>
            </Container>
        </Layout>  
    );
}

export default PageNotFound;

