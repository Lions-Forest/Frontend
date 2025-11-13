import type { Review } from "@/types";
import styled from "styled-components";
import { HiOutlineStar as FullStar} from "react-icons/hi";
import { HiStar as EmptyStar} from "react-icons/hi";
import ScoreNav from "../common/ScoreNav";

const MAX_STARS = 5;

function ReviewCard({ review }: { review: Review }){
    return(
        <CardLayout>
            <Header>
            <ProfileImg src={review.userProfile || ""} />
                <ProfileName>김중앙</ProfileName>
                {/* <ProfileName>{review.userName}</ProfileName> */}
            </Header>
            <CardPhoto src={(review.photo && (review.photo.find(p => p.order === 0)?.photoUrl || review.photo[0]?.photoUrl)) || ''}/>
            <DetailSection>
                <ScoreNav review={review} />
            </DetailSection>
            <CardDetail>{review.detail}</CardDetail>
        </CardLayout>
    )
}

export default ReviewCard;

const CardLayout = styled.div`
    // width: 80px;
    width: 24%;
    height: 100%;
    flex-shrink: 0;
    border-radius: 7px;
    background: #FFFFFF;
    padding: 5px 0px;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const Header = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 4px;
    gap: 4px;
`;

const ProfileImg = styled.img`
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    background: #D9D9D9;
    border-radius: 100%;
`;

const ProfileName = styled.div`
    display: -webkit-box;
    width: 51px;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    color: #000;
    text-overflow: ellipsis;
    font-family: Pretendard;
    font-size: 10px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
`;

const CardPhoto = styled.img`
    width: 80px;
    height: 79px;
    flex-shrink: 0;
    background: #848484;
`;

const DetailSection = styled.div`
    display: flex;
    width: 100%;
    padding: 3px;
`;

const CardDetail = styled.div`
    display: -webkit-box;
    width: 73px;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    color: #000;
    text-align: center;
    text-overflow: ellipsis;
    font-family: Pretendard;
    font-size: 8px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
`;