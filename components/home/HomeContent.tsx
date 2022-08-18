import styled from 'styled-components';

import GuestHomeContent from "./GuestHomeContent";
import UserHomeContent from "./UserHomeContent";
import { useAuthValue } from '../utils/authContext';

const Container = styled.div`

`;

const HomeContent = () => {
    const { currentUser } = useAuthValue();

    return (
            <Container>
                { currentUser  ?
                    <UserHomeContent/>
                    :
                    <GuestHomeContent/>
                }
            </Container>
        )
    }

export default HomeContent;