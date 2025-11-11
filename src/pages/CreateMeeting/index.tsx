import Layout from "@/components/layout/Layout";
import React, { useState } from "react";
import styled from "styled-components";
import StepOneInfo from "./StepOneInfo";
import StepTwoName from "./StepTwoName";
import StepThreeType from "./StepThreeType";
import StepFourDate from "./StepFourDate";
import StepFiveMembers from "./StepFiveMembers";
import ResultPage from "./ResultPage";
import InfoButton from "@/components/common/InfoButton";

function index() {
    const [step, setStep] = useState(1);
    return(
        <Layout page="create-meeting">
            <StepLayout>
                {step === 1 && <StepOneInfo onNextStep={() => setStep(2)} />}
                {step === 2 && <StepTwoName onNextStep={() => setStep(3)} onPrevStep={() => setStep(1)} />}
                {step === 3 && <StepThreeType onNextStep={() => setStep(4)} onPrevStep={() => setStep(2)} />}
                {step === 4 && <StepFourDate onNextStep={() => setStep(5)} onPrevStep={() => setStep(3)} />}
                {step === 5 && <StepFiveMembers onNextStep={() => setStep(6)} onPrevStep={() => setStep(4)} />}
                {step === 6 && <ResultPage />}
            </StepLayout>
            <ButtonWrapper>
                <InfoButton onNext={true} />
            </ButtonWrapper>
        </Layout>
    )
}

export default index;

const StepLayout = styled.div`
    display: flex;
    flex-direcion: column;
    padding: 32px 16px;
    align-items: space-between;
    justify-content: center;

    background: #E2EDE7;
    width: 100%;
`;

const ButtonWrapper = styled.div`
    width: 100%;
    margin-bottom: 52px;
    display: flex;
    align-items: center;
    justify-content: center;
`;