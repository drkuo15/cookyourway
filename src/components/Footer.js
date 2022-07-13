import styled from 'styled-components';
import { devices } from '../utils/StyleUtils';

const Background = styled.div`
  width: 100vw;
  height: 7.5vh;
  background-color: #343638;
  color: #FDFDFC;
  font-size: calc(20*100vw/1920);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: calc(26*100vw/1920);
  @media ${devices.Tablet} {
    font-size: calc(50*100vw/1920);
  }
`;

function Footer() {
  return (
    <Background>
      Copyright © 2022 Cook Your Way All rights reserved.
    </Background>

  );
}

export default Footer;
