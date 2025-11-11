import React from "react";
import Header from "./Header";
import styled from "styled-components";
import Footer from "./Footer";
import BackToNavBar from '../common/BackToNavBar'; // Import BackToNavBar

interface LayoutProps {
    children: React.ReactNode;
    showBackNavBar?: boolean; // New prop for conditional rendering
    backNavBarText?: string; // New prop for BackToNavBar text
}

function Layout({ children, showBackNavBar = false, backNavBarText = "" }: LayoutProps) {
    return(
        <Root>
            <HeaderWrapper>
                <Header page="home" />
            </HeaderWrapper>
            {showBackNavBar && <BackToNavBar text={backNavBarText} />} {/* 뒤로가기 NavBar 필요할 때만 사용 */}
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

