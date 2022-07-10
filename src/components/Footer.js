import styled from 'styled-components';

const Background = styled.div`
  width: 100vw;
  height: calc(116*100vw/1920);
  background-color: #343638;
  color: #FDFDFC;
  font-size: calc(28*100vw/1920);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: calc(26*100vw/1920);
`;

function Footer() {
  return (
    <Background>
      Copyright © 2022 Cook Your Way All rights reserved.
    </Background>

  );
}

export default Footer;
