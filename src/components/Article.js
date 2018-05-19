import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledLi = styled.li`
  list-style: none;
  display: inline-block;
`;

const Thumbnail = styled.img`
  width: 100%;
`;

export default class Article extends Component {
  static propTypes = {
    source: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    thumbnail: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  };

  render() {
    const { source, title, link, date, thumbnail, description } = this.props;
    return (
      <StyledLi>
        <article>
          <header>
            <span>{source}</span>
            <span>{date}</span>
          </header>
          {thumbnail && <Thumbnail src={thumbnail} alt={title} />}
          <h1>
            <a href={link}>{title}</a>
          </h1>
          <p>{description}</p>
        </article>
      </StyledLi>
    );
  }
}
