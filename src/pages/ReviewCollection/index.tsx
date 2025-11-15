import { fetchAllReview } from "@/api/meeting/reviewListApi";
import ReviewBox from "@/components/features/ReviewBox";
import Layout from "@/components/layout/Layout";
import type { Review } from "@/types";
import { useEffect, useState } from "react";
import styled from "styled-components";

function groupBy<T>(array: T[], keyFn: (item: T) => number): {[key: number]: T[]} {
    return array.reduce((acc: {[key: number]: T[]}, item: T) => {
      const key = keyFn(item);
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});
}

type ColorTheme = 'green' | 'blue' | 'yellow' | 'pink';

function getColorByIndex(index: number): ColorTheme {
  const colors: ColorTheme[] = ['green', 'blue', 'yellow', 'pink'];
  return colors[index % 4];
}

function index() {
    const [groupedReviews, setGroupedReviews] = useState<{[key: number]: Review[]}>({});
    const [sortedGroupIds, setSortedGroupIds] = useState<number[]>([]);
  
    // API에서 전체 reviews 받아와서 groupId로 묶기
    useEffect(() => {
      (async () => {
        try {
          const result = await fetchAllReview();
          console.log("전체 후기 리스트: ", result);

          const reviews = Array.isArray(result) ? result : [];
          // groupId로 묶고, key(=groupId) 내림차순 정렬
          const grouped = groupBy(reviews, (r: Review) => r.meetingId);
          const groupIds = Object.keys(grouped)
            .map(Number)
            .sort((a, b) => b - a);
          setGroupedReviews(grouped);
          setSortedGroupIds(groupIds);
        } catch (e) {
          console.error("후기 데이터 로딩 실패:", e);
          setGroupedReviews({});
          setSortedGroupIds([]);
        }
      })();
    }, []);

    return(
        <Layout showBackNavBar={true} backNavBarText="모임후기">
            <CollectionLayout>
            {sortedGroupIds.length > 0 ? (
                sortedGroupIds.map((groupId, index) => {
                  const reviews = groupedReviews[groupId] || [];
                  const color = getColorByIndex(index);
                  return reviews.length > 0 ? (
                    <ReviewBox key={groupId} reviews={reviews} color={color}/>
                  ) : null;
                })
            ) : (
                <EmptyText>아직 모임 후기가 없습니다</EmptyText>
            )}
        </CollectionLayout>
        </Layout>
    )
}

export default index;

const CollectionLayout = styled.div`
    background: #E4F2EA;
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    padding: 16px;
    gap: 16px;
`;

const EmptyText = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6B7280;
    font-family: dongleLight;
    font-size: 30px;
    font-style: normal;
    font-weight: 700;
`;