import MyActivities from "@/components/features/MyActivities";
import MyInfoCard from "@/components/features/MyInfoCard";
import Layout from "@/components/layout/Layout";
import styled from "styled-components";

function index() {
    return(
        <Layout>
            <MyPageLayout>
                <MyInfoCard />
                <DivideLine />
                <MyActivities></MyActivities>
            </MyPageLayout>
        </Layout>
    )
}

export default index;

const MyPageLayout = styled.div`
    background: #E4F2EA;
    width: 100%;
    height: 100vh;
    // overflow: auto;
    display: flex;
    padding: 0px 0px 14px 0px;
    flex-direction: column;
    align-items: center;
    gap: 16px;
`;

const DivideLine = styled.div`
width: 95%;
height: 8px;
    border-bottom: solid 2px #E2E2E2;
`