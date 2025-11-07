import Header from '@/components/layout/Header';
import React from 'react'
import styled from 'styled-components';

function index() {
    return (
        <HomeLayout>
            <Header />
        </HomeLayout>
    )
}

export default index;

const HomeLayout = styled.div`
    background: #E4F2EA;
    width: 100%;
`;