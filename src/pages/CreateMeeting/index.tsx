import Layout from "@/components/layout/Layout";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import StepOneInfo from "./StepOneInfo";
import StepTwoName from "./StepTwoName";
import StepThreeType from "./StepThreeType";
import StepFourDate from "./StepFourDate";
import StepFiveMembers from "./StepFiveMembers";
import StepSixLocation from "./StepSixLocation";
import ResultPage from "./ResultPage";
import InfoButton from "@/components/common/InfoButton";

const TOTAL_STEPS = 7;

function index() {
    const navigate = useNavigate();
    const location = useLocation();

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

    const handleNextStep = () => {
        if (step < TOTAL_STEPS) {
            const nextStep = step + 1;
            if (nextStep === 7) {
                navigate('/home/create-meeting/result');
            } else {
                navigate(`/home/create-meeting/step${nextStep}`);
            }
        }
    };

    const handlePrevStep = (prevStep: number) => {
        if (prevStep === 1) {
            navigate('/home/create-meeting/step1');
        } else {
            navigate(`/home/create-meeting/step${prevStep}`);
        }
    };

    return(
        <Layout page="create-meeting" showBackNavBar={true} backNavBarText="모임 개설하기">
            <CreateMeetingLayout>
                <ProgressBarContainer>
                    <ProgressBarWrapper>
                        <ProgressBarFill progress={(step / TOTAL_STEPS) * 100} />
                    </ProgressBarWrapper>
                </ProgressBarContainer>
                <StepLayout>
                    {step === 1 && <StepOneInfo onNextStep={() => navigate('/home/create-meeting/step2')} />}
                    {step === 2 && <StepTwoName onNextStep={() => navigate('/home/create-meeting/step3')} onPrevStep={() => handlePrevStep(1)} />}
                    {step === 3 && <StepThreeType onNextStep={() => navigate('/home/create-meeting/step4')} onPrevStep={() => handlePrevStep(2)} />}
                    {step === 4 && <StepFourDate onNextStep={() => navigate('/home/create-meeting/step5')} onPrevStep={() => handlePrevStep(3)} />}
                    {step === 5 && <StepFiveMembers onNextStep={() => navigate('/home/create-meeting/step6')} onPrevStep={() => handlePrevStep(4)} />}
                    {step === 6 && <StepSixLocation onNextStep={() => navigate('/home/create-meeting/result')} onPrevStep={() => handlePrevStep(5)} />}
                    {step === 7 && <ResultPage />}
                </StepLayout>
                {step < TOTAL_STEPS && (
                    <ButtonWrapper>
                        <InfoButton 
                            onNext={step !== 6} 
                            onComplete={step === 6} 
                            onClick={handleNextStep} 
                        />
                    </ButtonWrapper>
                )}
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
    background-color: #E2EDE7;
    overflow: hidden;
`;

const ProgressBarContainer = styled.div`
    width: 100%;
    padding: 0 16px;
    flex-shrink: 0;
    background-color: #E2EDE7;
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