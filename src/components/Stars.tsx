import React from 'react';
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

interface StarRatingState {
  stars: number[];
  hovered: number;
  selectedIcon: string;
  deselectedIcon: string;
}

interface StarRatingProps {
  onChange: (rating: number) => void;
  rating: number;
}

class StarRating extends React.Component<StarRatingProps, StarRatingState> {
  constructor(props: StarRatingProps) {
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

  changeRating(newRating: number) {
    const { onChange } = this.props;
    if (onChange) { onChange(newRating); }
  }

  hoverRating(rating: number) {
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
              // onKeyDown={this.handleKeyDown}
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

export default StarRating;
