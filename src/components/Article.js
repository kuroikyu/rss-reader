import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faExternalLinkAlt from '@fortawesome/fontawesome-free-solid/faExternalLinkAlt';
import dayjs from 'dayjs';

const StyledLi = styled.li`
  list-style: none;
  display: inline-block;
  background-color: white;
  margin-bottom: 20px;
  box-shadow: 0 3px 26px -5px rgba(0, 0, 0, 0.3);
  width: 100%;
`;

const ArticleHeader = styled.header`
  background: var(--background);
  color: var(--light-text);
  padding: 25px 20px;
  display: flex;
`;

const TitleLink = styled.a`
  color: inherit;
  text-decoration: none;
  flex-grow: 1;
  svg {
    margin-right: 1em;
  }
  span {
    font-weight: bold;
    color: var(--accent);
  }
`;

const ArticleDate = styled.span`
  font-size: 0.75em;
  opacity: 0.8;
`;

const Thumbnail = styled.img`
  width: 100%;
  height: 12em;
  object-fit: cover;
`;

const ArticleBody = styled.main`
  padding: 0 20px;
  color: var(--dark-text);
  h1 {
    line-height: 1.4;
    font-weight: 200;
    font-size: 1.4rem;
    opacity: 0.75;
  }
  p {
    line-height: 1.6;
    font-weight: bold;
  }
`;

const shortenDescription = text => {
  // Remove any HTML tags from the text
  const sanitisedText = text.replace(/(<([^>]+)>)/gi, '');
  // Make it into an array of words
  const textArray = sanitisedText.split(' ');
  // Get only the first bunch and put it together as a string again
  const shortText = textArray.slice(0, 18).join(' ');
  return `${shortText}...`;
};

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
    const formatedDate = dayjs(date).format('MMM DD YYYY | HH:mm');
    return (
      <StyledLi>
        <article>
          <ArticleHeader>
            <TitleLink href={link} target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faExternalLinkAlt} />
              <span>{source}</span>
            </TitleLink>
            <ArticleDate>{formatedDate}</ArticleDate>
          </ArticleHeader>
          {thumbnail && <Thumbnail src={thumbnail} alt={title} />}
          <ArticleBody>
            <h1>{title}</h1>
            <p>{shortenDescription(description)}</p>
          </ArticleBody>
        </article>
      </StyledLi>
    );
  }
}
