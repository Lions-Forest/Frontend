import MyActivities from "@/components/features/MyActivities";
import MyInfoCard from "@/components/features/MyInfoCard";
import Layout from "@/components/layout/Layout";
import styled from "styled-components";

function index() {
    return(
        <Layout>
            <MyPageLayout>
                <MyInfoCard />
                <MyActivities></MyActivities>  {/*여기서부터 다시 봐야함*/}
            </MyPageLayout>
        </Layout>
    )
}

export default index;

const MyPageLayout = styled.div`
    background: #E4F2EA;
    width: 100%;
    height: auto;
    // overflow: auto;
    display: flex;
    padding: 16px 0px 14px 0px;
    flex-direction: column;
    align-items: center;
    gap: 16px;
`;