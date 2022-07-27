import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { devices } from '../utils/StyleUtils';

const StarSpan = styled.span`
  cursor: pointer;
  font-size: calc(48*100vw/1920);
  color: #BE0028;
  @media ${devices.Tablet} and (orientation: portrait){
    font-size: calc(48*1.8*100vw/1920);
  }
`;

class StarRating extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stars: [],
      hovered: 0,
      selectedIcon: '★',
      deselectedIcon: '☆',
    };

    const { stars } = this.state;
    for (let i = 0; i < 5; i += 1) {
      stars.push(i + 1);
    }
  }

  changeRating(newRating) {
    const { onChange } = this.props;
    if (onChange) { onChange(newRating); }
  }

  hoverRating(rating) {
    this.setState({
      hovered: rating,
    });
  }

  render() {
    const {
      stars, hovered, deselectedIcon, selectedIcon,
    } = this.state;
    const { rating } = this.props;

    return (
      <div>
        <div className="rating">
          {stars.map((star) => (
            <StarSpan
              key={star}
              onClick={() => { this.changeRating(star); }}
              role="presentation"
              onKeyPress={this.handleKeyPress}
              onMouseEnter={() => { this.hoverRating(star); }}
              onMouseLeave={() => { this.hoverRating(0); }}
            >
              {rating < star
                && hovered < star ? deselectedIcon : selectedIcon}
            </StarSpan>
          ))}
        </div>
      </div>
    );
  }
}

StarRating.propTypes = {
  onChange: PropTypes.func.isRequired,
  rating: PropTypes.number.isRequired,
};

export default StarRating;
