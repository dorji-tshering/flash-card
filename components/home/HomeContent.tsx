import styled from 'styled-components';

import GuestHomeContent from "./GuestHomeContent";
import UserHomeContent from "./UserHomeContent";

const Container = styled.div`

`;

interface Props {
    userId: string
}

const HomeContent = ({ userId }: Props) => {
    console.log('UserId: ' + userId);
    return (
            <Container>
                { userId ?
                    <UserHomeContent/>
                    :
                    <GuestHomeContent/>
                }
            </Container>
        )
    } 

export default HomeContent;