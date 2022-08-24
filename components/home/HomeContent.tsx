import styled from 'styled-components';
import { useState } from 'react';

import GuestHomeContent from "./GuestHomeContent";
import UserHomeContent from "./UserHomeContent";
import Loader from '../loader/Loader';
import { useAuthValue } from '../utils/authContext';

const Container = styled.div`

`;

interface Props {
    notes: any[],
    userId: string
}

const HomeContent = ({ notes, userId }: Props) => {

    return (
            <Container>
                { userId ?
                    <UserHomeContent notes={notes} userId={userId}/>
                    :
                    <GuestHomeContent/>
                }
            </Container>
        )
    } 

export default HomeContent;