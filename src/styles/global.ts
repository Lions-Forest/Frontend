import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';
import dongleBold from '../assets/fonts/Dongle-Bold.ttf';
import dongleRegular from '../assets/fonts/Dongle-Regular.ttf';
import dongleLight from '../assets/fonts/Dongle-Light.ttf';

// 전역 스타일 정의
export const GlobalStyle = createGlobalStyle`
  ${reset}
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #root {
    width: 100%;
    min-height: 100vh;
  }
  
  /* font */
  @font-face {
    font-family: "dongleBold";
    src: url(${dongleBold}) format('truetype');
  }

  @font-face {
    font-family: "dongleRegular";
    src: url(${dongleRegular}) format('truetype');
  }

  @font-face {
    font-family: "dongleLight";
    src: url(${dongleLight}) format('truetype');
  }
`;

