import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { devices } from '../utils/StyleUtils';
import logoImage from '../images/CookYourWay_logo_v1.png';

const CenterHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: calc(50*100vw/1920);
  margin: calc(56*100vw/1920) 0 calc(48*100vw/1920) 0;
  @media ${devices.Tablet} and (orientation:portrait) {
    gap: calc(100*100vw/1920);
    margin: calc(112*100vw/1920) 0 calc(96*100vw/1920) 0;

  }
`;

const ImgLink = styled(Link)`
  width: calc(124*100vw/1920);
  height: calc(124*100vw/1920);
  @media ${devices.Tablet} and (orientation:portrait) {
    width: calc(180*100vw/1920);
    height: calc(180*100vw/1920);
  }
`;

const TitleLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

const Img = styled.img`
  width: calc(124*100vw/1920);
  height: calc(124*100vw/1920);
  @media ${devices.Tablet} and (orientation:portrait) {
    width: calc(180*100vw/1920);
    height: calc(180*100vw/1920);
  }
`;

const Title = styled.div`
  color: #EB811F;
  font-size: calc(76*100vw/1920);
  @media ${devices.Tablet} and (orientation:portrait) {
    height: calc(180*100vw/1920);
    font-size: calc(120*100vw/1920);
    padding-top: calc(20*100vw/1920);
  }
`;

function CenterTopHeader() {
  return (
    <CenterHeader>
      <ImgLink to="/">
        <Img src={logoImage} alt="logoImage" />
      </ImgLink>
      <TitleLink to="/"><Title>Cook Your Way</Title></TitleLink>
    </CenterHeader>
  );
}

export default CenterTopHeader;
