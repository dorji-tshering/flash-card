import styled from 'styled-components';
import { CgClose } from 'react-icons/cg';

const Container = styled.div`
    padding: 10px 40px 10px 15px;
    background: var(--green-color);
    border-radius: 5px;
    position: relative;

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
    setNotification: Function;
}

const Success = ({ message, closeable, setNotification }: Props) => {
    console.log(closeable);

    return (
        <Container>
            <p className="message">
                { message }
            </p>
            { closeable ? <span onClick={() => setNotification(null)} className="close"><CgClose/></span> : ''}
        </Container>
    )
}

export default Success;