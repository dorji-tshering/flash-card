import styled from 'styled-components';
import { FaHeart } from 'react-icons/fa';

const Container = styled.footer`
    text-align: center;
    padding: 15px;
    background-color: var(--light-background-color);

    p {
        color: var(--secondary-text-color);
    }

    .made-with {
        display: flex;
        align-items: center;
        justify-content: center;

        span {
            margin-right: 10px;
        }
    }

    .built-with {
        .next {
            color: var(--yellow-color);
        }

        .firebase {
            color: var(--theme-color);
        }
    }
`;



const Footer = () => {
  return (
    <Container>
        <p className="made-with"><span>Made with</span> 
            <FaHeart size='16' fill='#F70EE9'/>
        </p>
        <p className="built-with">Built with <a href='https://nextjs.org/' className="next" target='_blank'>NextJs</a> and <a href='https://firebase.google.com/' className="firebase" target="_blank">Firebase</a>
        </p>
    </Container>
  )
}

export default Footer;