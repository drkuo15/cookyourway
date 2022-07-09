import React from 'react';
import PropTypes from 'prop-types';

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
            <span
              key={star}
              style={{ cursor: 'pointer', fontSize: 'calc(48*100vw/1920)', color: '#BE0028' }}
              onClick={() => { this.changeRating(star); }}
              role="presentation"
              onKeyPress={this.handleKeyPress}
              onMouseEnter={() => { this.hoverRating(star); }}
              onMouseLeave={() => { this.hoverRating(0); }}
            >
              {rating < star
                && hovered < star ? deselectedIcon : selectedIcon}
            </span>
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
