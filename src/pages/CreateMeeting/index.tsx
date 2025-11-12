import Layout from "@/components/layout/Layout";
import { useState } from "react";
import styled from "styled-components";
import StepOneInfo from "./StepOneInfo";
import StepTwoName from "./StepTwoName";
import StepThreeType from "./StepThreeType";
import StepFourDate from "./StepFourDate";
import StepFiveMembers from "./StepFiveMembers";
import ResultPage from "./ResultPage";
import InfoButton from "@/components/common/InfoButton";

const TOTAL_STEPS = 6;

function index() {
    const [step, setStep] = useState(1);

    const handleNextStep = () => {
        if (step < TOTAL_STEPS) {
            setStep(step + 1);
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
                    {step === 1 && <StepOneInfo onNextStep={() => setStep(2)} />}
                    {step === 2 && <StepTwoName onNextStep={() => setStep(3)} onPrevStep={() => setStep(1)} />}
                    {step === 3 && <StepThreeType onNextStep={() => setStep(4)} onPrevStep={() => setStep(2)} />}
                    {step === 4 && <StepFourDate onNextStep={() => setStep(5)} onPrevStep={() => setStep(3)} />}
                    {step === 5 && <StepFiveMembers onNextStep={() => setStep(6)} onPrevStep={() => setStep(4)} />}
                    {step === 6 && <ResultPage />}
                </StepLayout>
                {step < TOTAL_STEPS && (
                    <ButtonWrapper>
                        <InfoButton onNext={true} onClick={handleNextStep} />
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