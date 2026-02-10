import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { theme } from '@/styles/theme';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 80px 0;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid ${theme.colors.surfaceAlt};
  border-top: 3px solid ${theme.colors.accent};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

export default function LoadingSpinner() {
    return (
        <SpinnerContainer>
            <Spinner />
        </SpinnerContainer>
    );
}
