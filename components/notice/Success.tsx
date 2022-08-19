import styled from 'styled-components';
import { MdCloudDone } from 'react-icons/md';
import { CgClose } from 'react-icons/cg';

const Container = styled.div`
    position: absolute;
    width: 100%;
    height: auto;
    padding: 25px;
    background: var(--green-color);
    color: var(--primary-text-color);
    z-index: 5;
    border-radius: 5px;
    top: -55px;

    .message {
        display: flex;
        align-items: center;

        span {
            margin-left: 10px;
        }
    }

    .close {
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        height: 20px;
        width: 20px;
        position: absolute;
        right: 5px;
        top: 5px;
        cursor: pointer;

        &:hover {
            background: var(--light-background-color);
        }
    }
`;

interface Props {
    message: string;
    closeable: boolean;
    showNotification: Function;
}

const Success = ({ message, closeable, showNotification }: Props) => {
  return (
    <Container>
        <p className="message">
            <MdCloudDone size={40} /><span>{ message }</span>
        </p>
        { closeable ? <span onClick={() => showNotification(false)} className="close"><CgClose/></span> : ''}
    </Container>
  )
}

export default Success;