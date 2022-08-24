import styled from 'styled-components';

interface Props {
    background?: string
}

const Container = styled.div<Props>`
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    height: 100%;
    width: 100%; 
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => props.background === "transparent" ? 'transparent' : 'var(--dark-background-color)'};
    z-index: 9999;

    .lds-ring {
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        width: 80px;
        height: 80px;
    }

    .lds-ring div {
        box-sizing: border-box;
        display: block;
        position: absolute;
        width: 50px;
        height: 50px;
        margin: 8px;
        border: 4px solid #fff;
        border-radius: 50%;
        animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
        border-color: #fff transparent transparent transparent;
    }

    .lds-ring div:nth-child(1) {
        animation-delay: -0.45s;
    }

    .lds-ring div:nth-child(2) {
        animation-delay: -0.3s;
    }

    .lds-ring div:nth-child(3) {
        animation-delay: -0.15s;
    }

    @keyframes lds-ring {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }

    @media (max-width: 768px) {
        .lds-ring div {
            height: 30px;
            width: 30px;
            border-width: 2px;
        }
    }
`;


const Loader = ({ background }) => {
  return (
    <Container background={background}>
        <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
    </Container>
  )
}

export default Loader;