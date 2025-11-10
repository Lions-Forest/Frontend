import React from "react";
import Header from "./Header";
import styled from "styled-components";
import Footer from "./Footer";

interface LayoutProps {
    page?: string;
    children: React.ReactNode;
}

function Layout({ page, children }: LayoutProps) {
    return(
        <Root>
            <HeaderWrapper>
                <Header page={page} />
            </HeaderWrapper>
            <Content>
                {children}
            </Content>
            <FooterWrapper>
                <Footer />
            </FooterWrapper>
        </Root>
    )
}

export default Layout;

const Root = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100vh;
    overflow: hidden;
`;

const HeaderWrapper = styled.div`
    flex-shrink: 0;
    width: 100%;
`;

const Content = styled.div`
    flex: 1;
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    // padding: 16px 7px;
`;

const FooterWrapper = styled.div`
    flex-shrink: 0;
    width: 100%;
`;

