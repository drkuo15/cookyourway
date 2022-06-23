import React from 'react';
import PropTypes from 'prop-types';

class StarRating extends React.Component {
  constructor(props) {
    super(props);
    const rating = props.rating || 0;

    this.state = {
      stars: [],
      rating,
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
    this.setState({
      rating: newRating,
    });

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
      stars, rating, hovered, deselectedIcon, selectedIcon,
    } = this.state;

    return (
      <div>
        <div className="rating" style={{ fontSize: '1rem', color: '#EDC805' }}>

          {stars.map((star) => (
            <span
              key={star}
              style={{ cursor: 'pointer' }}
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
