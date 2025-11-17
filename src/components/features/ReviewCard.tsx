import type { Review } from "@/types";
import styled from "styled-components";
import { HiOutlineStar as FullStar} from "react-icons/hi";
import { HiStar as EmptyStar} from "react-icons/hi";
import ScoreNav from "../common/ScoreNav";
import zoomIcon from "../../assets/icons/pan_zoom.svg";
import { useNavigate } from "react-router-dom";

function ReviewCard({ review }: { review: Review }){

    const navigate = useNavigate();
    const handleCardClick = () => {
        navigate('/home/review-collection');
    };

    return(
        <CardLayout  onClick={handleCardClick}>
            <Header>
            <ProfileImg src={review.userProfile || ""} />
                <ProfileName>{review.userName}</ProfileName>
            </Header>
            <CardPhoto src={(review.photo && (review.photo.find(p => p.order === 0)?.photoUrl || review.photo[0]?.photoUrl)) || ''}/>
            <DetailSection>
                <ScoreNav review={review} />
                <ZoomIcon src={zoomIcon}/>
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
    width: 100%;
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
    width: 100%;
    height: 79px;
    // flex-shrink: 0;
    background: #848484;
    object-fit: cover;
`;

const DetailSection = styled.div`
    display: flex;
    width: 100%;
    padding: 3px;
    align-items: center;
    justify-content: space-between;
    // gap: 4px;
    box-sizing: border-box;
    overflow: hidden;
`;

const CardDetail = styled.div`
    display: -webkit-box;
    padding: 0px 5px;
    width: 100%;
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

const ZoomIcon = styled.img`
    // width: 14px;
    // height: 14px;
    aspect-ratio: 1/1;
    color: #515151;
`;