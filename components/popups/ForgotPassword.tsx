import { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    padding: 30px;
    background: rgb(23 23 22 / 80%);
    z-index: 1;
    border-radius: 10px;

    .inner-wrapper {
        width: 85%;
        height: 85%;
        background: var(--light-background-color);
        border-radius: 7px;
    }
`;

interface Prop {
    back: Dispatch<SetStateAction<boolean>>
}

const ForgotPassword = ({ back }: Prop) => {
  return (
    <Container>
        <div className="inner-wrapper">

        </div>
    </Container>
  )
}

export default ForgotPassword