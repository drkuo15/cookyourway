import React, { CSSProperties } from 'react';
// import PropTypes from 'prop-types';
import styled from 'styled-components';
import { devices } from '../utils/StyleUtils';

const StarDiv = styled.div`
  --percent: calc(var(--stars) / 5 * 100%);
  display: inline-block;
  &:before{
  content: "★★★★★";
  font-size: calc(var(--size)*100vw/1920);
  letter-spacing: var(--spacing);
  background: linear-gradient(
    90deg,
    var(--fill) var(--percent),
    #e6e9ed var(--percent)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  }
  @media ${devices.Tablet} and (orientation:portrait) {
    &:before{font-size: calc(var(--size)*1.8*100vw/1920)};
  }
`;

interface StarsProps {
  stars: number;
  size: number;
  spacing: number;
  fill: string;
}

interface CSSPropertiesWithVars extends CSSProperties {
  '--stars': StarsProps['stars'];
  '--size': StarsProps['size'];
  '--spacing': string;
  '--fill': StarsProps['fill'];
}

function Stars({
  stars, size, spacing, fill,
}: StarsProps) {
  return (
    <StarDiv style={{
      '--stars': stars,
      '--size': size,
      '--spacing': `${spacing}px`,
      '--fill': fill,
    } as CSSPropertiesWithVars}
    />
  );
}

// Stars.propTypes = {
//   stars: PropTypes.number.isRequired,
//   size: PropTypes.number.isRequired,
//   spacing: PropTypes.number.isRequired,
//   fill: PropTypes.string.isRequired,
// };

export default Stars;
