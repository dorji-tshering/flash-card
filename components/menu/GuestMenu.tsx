import styled from 'styled-components';
import { VscAccount } from 'react-icons/vsc';


const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    height: 100%;
    width: 100%;

    .icon {
        margin-top: -50px;
        margin-bottom: 15px;
        color: var(--secondary-text-color);
    }
`;

const GuestMenu = () => {
  return (
    <Container>
        <p className="icon"><VscAccount size={34}/></p>
        <p>Sign in to get started.</p>
    </Container>
  )
}

export default GuestMenu; 