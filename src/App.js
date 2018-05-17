import React, { Component } from 'react';
import styled from 'styled-components';
import Article from './components/Article';

const ArticleContainer = styled.ul`
  columns: 3;
  column-gap: 10px;
`;

class App extends Component {
  state = { articles: [] };

  async componentDidMount() {
    const baseURI = 'https://api.rss2json.com/v1/api.json';
    const url = 'https://techcrunch.com/feed/';
    // const url = 'https://news.ycombinator.com/rss';
    const newArticles = await this.fetchFeed(`${baseURI}?rss_url=${encodeURIComponent(url)}`);
    const articles = [...this.state.articles, ...newArticles];
    this.setState({ articles });
  }

  fetchFeed = async uri => {
    const rawData = await (await fetch(uri)).json();
    const articles = rawData.items.map(item => ({ source: rawData.feed, article: item }));
    return articles;
  };

  render() {
    const { articles } = this.state;
    console.log(this.state);
    return (
      <section>
        <ArticleContainer>
          {articles.length > 0 &&
            articles.map(el => (
              <Article
                key={el.article.guid}
                source={el.source.title}
                link={el.article.link}
                date={el.article.pubDate}
                thumbnail={el.article.thumbnail}
                title={el.article.title}
                description={el.article.description}
              />
            ))}
        </ArticleContainer>
      </section>
    );
  }
}

export default App;
