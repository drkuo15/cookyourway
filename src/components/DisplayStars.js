import PropTypes from 'prop-types';
import styled from 'styled-components';

const StarDiv = styled.div`
  --percent: calc(var(--stars) / 5 * 100%);
  display: inline-block;
  &:before{
  content: "★★★★★";
  font-size: var(--size);
  letter-spacing: var(--spacing);
  background: linear-gradient(
    90deg,
    var(--fill) var(--percent),
    #e6e9ed var(--percent)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  }
`;

function Stars({
  stars, size, spacing, fill,
}) {
  return (
    <StarDiv style={{
      '--stars': stars,
      '--size': `calc(${size}*100vw/1920)`,
      '--spacing': `${spacing}px`,
      '--fill': fill,
    }}
    />
  );
}

Stars.propTypes = {
  stars: PropTypes.number.isRequired,
  size: PropTypes.number.isRequired,
  spacing: PropTypes.number.isRequired,
  fill: PropTypes.string.isRequired,
};

export default Stars;
