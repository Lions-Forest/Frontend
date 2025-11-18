import Layout from "@/components/layout/Layout";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import StepOneInfo from "./StepOneInfo";
import StepTwoName from "./StepTwoName";
import StepThreeType from "./StepThreeType";
import StepFourMembers from "./StepFourMembers";
import StepFiveDate from "./StepFiveDate";
import StepSixLocation from "./StepSixLocation";
import ResultPage from "./ResultPage";
import InfoButton from "@/components/common/InfoButton";

const TOTAL_STEPS = 7;

// 모임 생성 데이터 타입
interface MeetingFormData {
    title: string;
    photos: File[];
    category: "MEAL" | "WORK" | "SOCIAL" | "CULTURE" | "ETC" | null;
    meetingAt: string;
    capacity: number;
    location: string;
}

function index() {
    const navigate = useNavigate();
    const location = useLocation();
    
    // 모든 Step의 데이터를 관리하는 상태
    const [formData, setFormData] = useState<MeetingFormData>({
        title: "",
        photos: [],
        category: null,
        meetingAt: "",
        // 인원 선택을 하지 않아도 기본값 2명이 되도록 초기값 설정
        capacity: 2,
        location: "",
    });
    const [topAlert, setTopAlert] = useState<string | null>(null);

    useEffect(() => {
        if (!topAlert) return;

        const timerId = window.setTimeout(() => {
            setTopAlert(null);
        }, 4000);

        return () => {
            window.clearTimeout(timerId);
        };
    }, [topAlert]);

    // URL에서 현재 step 추출
    const getStepFromPath = (pathname: string): number => {
        if (pathname.includes('/result')) return 7;
        if (pathname.includes('/step6')) return 6;
        if (pathname.includes('/step5')) return 5;
        if (pathname.includes('/step4')) return 4;
        if (pathname.includes('/step3')) return 3;
        if (pathname.includes('/step2')) return 2;
        return 1; // 기본값은 step1
    };

    const step = getStepFromPath(location.pathname);

    // 잘못된 경로로 접근 시 step1으로 리다이렉트
    useEffect(() => {
        if (!location.pathname.includes('/step') && !location.pathname.includes('/result')) {
            navigate('/home/create-meeting/step1', { replace: true });
        }
    }, [location.pathname, navigate]);

    const handleNextStep = async () => {
        if (step === 5) {
            if (!formData.meetingAt) {
                setTopAlert("모임 날짜/시각은 현재 시점 이후로만 설정 가능합니다");
                return;
            }

            const meetingDate = new Date(formData.meetingAt);
            const now = new Date();

            if (isNaN(meetingDate.getTime()) || meetingDate <= now) {
                setTopAlert("모임 날짜/시각은 현재 시점 이후로만 설정 가능합니다");
                return;
            }
        }

        if (step === 6) {
            // Step 6일 때는 API 호출을 위해 StepSixLocation의 handleComplete를 호출
            // 하지만 여기서는 직접 API를 호출하는 것이 더 간단함
            return;
        }
        if (step < TOTAL_STEPS) {
            const nextStep = step + 1;
            if (nextStep === 7) {
                navigate('/home/create-meeting/result');
            } else {
                navigate(`/home/create-meeting/step${nextStep}`);
            }
        }
    };

    // Step 6에서 확인 버튼 클릭 시 API 호출
    const handleStepSixComplete = async () => {
        const { makeClass } = await import('@/api/class/makeClassAPI');
        
        // 필수 필드 검증
        if (!formData.title || !formData.category || !formData.meetingAt || !formData.capacity || !formData.location) {
            alert('모든 필수 항목을 입력해주세요.');
            return;
        }

        // capacity 검증 (2~50)
        if (formData.capacity < 2 || formData.capacity > 50) {
            alert('인원은 2명 이상 50명 이하여야 합니다.');
            return;
        }

        try {
            const requestData = {
                title: formData.title,
                category: formData.category,
                capacity: formData.capacity,
                meetingAt: formData.meetingAt,
                location: formData.location,
                photos: formData.photos,
            };

            await makeClass(requestData);
            
            // 성공 시 다음 단계로 이동
            navigate('/home/create-meeting/result');
        } catch (error: any) {
            alert('모임 생성에 실패했습니다. 다시 시도해주세요.');
        }
    };

    const handlePrevStep = (prevStep: number) => {
        if (prevStep === 1) {
            navigate('/home/create-meeting/step1');
        } else {
            navigate(`/home/create-meeting/step${prevStep}`);
        }
    };

    if (step === 7) {
        return <ResultPage />;
    }

    return(
        <Layout page="create-meeting" showBackNavBar={true} backNavBarText="모임 개설하기">
            <CreateMeetingLayout>
                {topAlert && <TopAlert role="alert">{topAlert}</TopAlert>}
                <ProgressBarContainer>
                    <ProgressBarWrapper>
                        <ProgressBarFill progress={(step / TOTAL_STEPS) * 100} />
                    </ProgressBarWrapper>
                </ProgressBarContainer>
                <StepLayout>
                    {step === 1 && (
                        <StepOneInfo 
                            onNextStep={() => navigate('/home/create-meeting/step2')}
                            onDataChange={(title, photos) => {
                                setFormData(prev => ({ ...prev, title, photos }));
                            }}
                            initialTitle={formData.title}
                            initialPhotos={formData.photos}
                        />
                    )}
                    {step === 2 && (
                        <StepTwoName 
                            onNextStep={() => navigate('/home/create-meeting/step3')} 
                            onPrevStep={() => handlePrevStep(1)} 
                        />
                    )}
                    {step === 3 && (
                        <StepThreeType 
                            onNextStep={() => navigate('/home/create-meeting/step4')} 
                            onPrevStep={() => handlePrevStep(2)}
                            onDataChange={(category) => {
                                setFormData(prev => ({ ...prev, category }));
                            }}
                            initialCategory={formData.category}
                        />
                    )}
                    {step === 4 && (
                        <StepFourMembers 
                            onNextStep={() => navigate('/home/create-meeting/step5')} 
                            onPrevStep={() => handlePrevStep(3)}
                            onDataChange={(capacity) => {
                                setFormData(prev => ({ ...prev, capacity }));
                            }}
                            initialCapacity={formData.capacity}
                        />
                    )}
                    {step === 5 && (
                        <StepFiveDate 
                            onNextStep={() => navigate('/home/create-meeting/step6')} 
                            onPrevStep={() => handlePrevStep(4)}
                            onDataChange={(meetingAt) => {
                                setFormData(prev => ({ ...prev, meetingAt }));
                            }}
                            initialMeetingAt={formData.meetingAt}
                        />
                    )}
                    {step === 6 && (
                        <StepSixLocation 
                            onNextStep={() => navigate('/home/create-meeting/result')} 
                            onPrevStep={() => handlePrevStep(5)}
                            onDataChange={(location) => {
                                setFormData(prev => ({ ...prev, location }));
                            }}
                            initialLocation={formData.location}
                        />
                    )}
                </StepLayout>
                <ButtonWrapper>
                    <InfoButton 
                        onNext={step !== 6} 
                        onComplete={step === 6} 
                        onClick={step === 6 ? handleStepSixComplete : handleNextStep} 
                    />
                </ButtonWrapper>
            </CreateMeetingLayout>
        </Layout>
    )
}

export default index;

const CreateMeetingLayout = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background-color: #E4F2EA;
    overflow: hidden;
`;

const ProgressBarContainer = styled.div`
    width: 100%;
    padding: 0 16px;
    flex-shrink: 0;
    background-color: #E4F2EA;
`;

const ProgressBarWrapper = styled.div`
    width: 100%;
    height: 3px;
    background-color: #E5E5E5; /* Semantic/Line/Normal/Neutral 색상 */
    border-radius: 1.5px;
    overflow: hidden;
`;

const ProgressBarFill = styled.div<{ progress: number }>`
    width: ${props => props.progress}%;
    height: 100%;
    background-color: #00A057;
    transition: width 0.3s ease;
`;

const StepLayout = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 32px 16px;
    align-items: flex-start;
    justify-content: flex-start;
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;
`;

const ButtonWrapper = styled.div`
    width: 100%;
    padding-bottom: 54px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const TopAlert = styled.div`
    position: fixed;
    top: 16px;
    left: 50%;
    transform: translateX(-50%);
    min-width: 280px;
    max-width: 480px;
    padding: 12px 20px;
    border-radius: 12px;
    background: rgba(255, 77, 79, 0.9);
    color: #fff;
    font-family: Pretendard;
    font-size: 14px;
    font-weight: 600;
    text-align: center;
    line-height: 1.5;
    word-break: keep-all;
    box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.25);
    z-index: 999;
    white-space: pre-line;
`;