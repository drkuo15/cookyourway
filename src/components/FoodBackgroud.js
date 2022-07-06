import styled from 'styled-components';
import cookieImage from '../images/foodSVG/cookie_FILL0_wght400_GRAD0_opsz48.svg';
import eggImage from '../images/foodSVG/egg_alt_FILL0_wght400_GRAD0_opsz48.svg';
import icecreamImage from '../images/foodSVG/icecream_FILL0_wght400_GRAD0_opsz48.svg';
import localBarImage from '../images/foodSVG/local_bar_FILL0_wght400_GRAD0_opsz48.svg';
import localPizzaImage from '../images/foodSVG/local_pizza_FILL0_wght400_GRAD0_opsz48.svg';
import lunchDining from '../images/foodSVG/lunch_dining_FILL0_wght400_GRAD0_opsz48.svg';
import ramenDining from '../images/foodSVG/ramen_dining_FILL0_wght400_GRAD0_opsz48.svg';

const Background = styled.div`
  width: 100vw;
  height: calc(250*100vw/1920);
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: relative;
`;

const UpWrapper = styled.div`
  width: 100vw;
  ${'' /* height: calc(300*100vw/1920); */}
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  top: calc(-100*100vw/1920);
`;

const DownWrapper = styled.div`
  width: 90vw;
  ${'' /* height: calc(300*100vw/1920); */}
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: absolute;
  bottom: calc(-35*100vw/1920);
`;

const ImageUp = styled.img`
  width: calc(230*100vw/1920);
  height: calc(230*100vw/1920);
  opacity: 0.3;
  transform: rotate(20deg);
`;

const ImageDown = styled.img`
  width: calc(230*100vw/1920);
  height: calc(230*100vw/1920);
  opacity: 0.3;
  transform: rotate(-15deg);
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
