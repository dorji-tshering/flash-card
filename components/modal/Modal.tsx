import styled from 'styled-components';
import { CgClose } from 'react-icons/cg';
import { MouseEventHandler } from 'react';

const Container = styled.div`
    position: fixed;
    height: 100vh;
    width: 100vw;
    z-index: 6; 
    display: flex;
    justify-content: center;
    align-items: center;

    .modal-content {
        z-index: 10;
        padding: 30px;
        border-radius: 10px;
        position: relative;
        background-color: var(--dark-background-color);

        .close-modal {
            position: absolute;
            right: 14px;
            top: 10px;
            background: transparent;
            color: #ffffff;
            height: 34px;
            width: 34px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 50%;
            cursor: pointer;

            &:hover {
                background-color: var(--light-background-color);
            }
        }

    }

    @media screen and (max-width: 480px) {
        .modal-content {
            height: 100%;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }

    @media screen and (max-width: 360px) {
        .modal-content {
            padding: 15px;
        }
    }

`;

const Backdrop = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
`;

interface Props {
    children: React.ReactNode,
    onClickOutside: MouseEventHandler,
    className?: string
}

const Modal = ({ children, onClickOutside, className }: Props) => {
  return (
    <Container>
        <Backdrop onClick={onClickOutside}/>
            <div className={`modal-content ${className}`}>
                <span className="close-modal" onClick={onClickOutside}><CgClose size='20'/></span>
                { children }
            </div>
    </Container>
  );
}

export default Modal;