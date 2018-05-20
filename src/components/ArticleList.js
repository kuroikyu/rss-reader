import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Article from './Article';

const ArticleContainer = styled.ul`
  column-count: 3;
  column-gap: 20px;
  margin: 0;
  padding: 40px;
  margin-left: 25%;
  background-color: var(--light);
`;

export default class ArticleList extends Component {
  static propTypes = {
    articles: PropTypes.array.isRequired,
    columns: PropTypes.number.isRequired,
  };

  applyMasonryGrid = (items, columns) => {
    const result = [];
    for (let colIndex = 0; colIndex < columns; colIndex += 1) {
      for (let itemsIndex = 0; itemsIndex < items.length; itemsIndex += columns) {
        const item = items[colIndex + itemsIndex];
        if (item !== undefined) {
          result.push(item);
        }
      }
    }
    return result;
  };

  render() {
    const { articles: unMasonrisedArticles, columns } = this.props;
    const articles = this.applyMasonryGrid(unMasonrisedArticles, columns);
    return (
      <ArticleContainer>
        {articles.map(el => (
          <Article
            key={el.article.guid}
            source={el.source.userTitle || el.source.title}
            link={el.article.link}
            date={el.article.pubDate}
            thumbnail={el.article.thumbnail}
            title={el.article.title}
            description={el.article.description}
          />
        ))}
      </ArticleContainer>
    );
  }
}
