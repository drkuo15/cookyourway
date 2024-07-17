import React from 'react';
import styled from 'styled-components';
import cookieImage from '../images/foodSVG/cookie.svg';
import eggImage from '../images/foodSVG/egg.svg';
import icecreamImage from '../images/foodSVG/icecream.svg';
import localBarImage from '../images/foodSVG/local_bar.svg';
import localPizzaImage from '../images/foodSVG/local_pizza.svg';
import lunchDining from '../images/foodSVG/lunch_dining.svg';
import ramenDining from '../images/foodSVG/ramen_dining.svg';
import { devices } from '../utils/StyleUtils';

const Background = styled.div`
  width: 100%;
  height: calc(250*100vw/1920);
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: relative;
  @media ${devices.Tablet} and (orientation:portrait) {
    height: calc(500*100vw/1920);
  }
`;

const UpWrapper = styled.div`
  width: 96%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  top: calc(-100*100vw/1920);
  @media ${devices.Tablet} and (orientation:portrait) {
    justify-content: space-around;
    top: calc(50*100vw/1920);
  }
`;

const DownWrapper = styled.div`
  width: 90%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: absolute;
  bottom: calc(-35*100vw/1920);
  @media ${devices.Tablet} and (orientation:portrait) {
    bottom: calc(-250*100vw/1920);
  }
  
`;

const ImageUp = styled.img`
  width: calc(230*100vw/1920);
  height: calc(230*100vw/1920);
  opacity: 0.3;
  transform: rotate(20deg);
  @media ${devices.Tablet} and (orientation:portrait) {
    width: calc(345*100vw/1920);
    height: calc(345*100vw/1920);
  }
`;

const ImageDown = styled.img`
  width: calc(230*100vw/1920);
  height: calc(230*100vw/1920);
  opacity: 0.3;
  transform: rotate(-15deg);
  @media ${devices.Tablet} and (orientation:portrait) {
    width: calc(345*100vw/1920);
    height: calc(345*100vw/1920);
  }
`;

function FoodBackground() {
  return (
    <Background>
      <UpWrapper>
        <ImageUp src={cookieImage} alt="cookieImage" />
        <ImageUp src={icecreamImage} alt="icecreamImage" />
        <ImageUp src={localPizzaImage} alt="local_pizzaImage" />
        <ImageUp src={ramenDining} alt="ramen_dining" />
      </UpWrapper>
      <DownWrapper>
        <ImageDown src={eggImage} alt="eggImage" />
        <ImageDown src={localBarImage} alt="local_barImage" />
        <ImageDown src={lunchDining} alt="lunch_dining" />
      </DownWrapper>
    </Background>
  );
}

export default FoodBackground;
