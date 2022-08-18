import styled from 'styled-components';

const Container = styled.div`
    background: red;
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

    p {
        color: green;
    }
`;


const Loader = () => {
  return (
    <Container>
        <p>Loading...</p>
    </Container>
  )
}

export default Loader;