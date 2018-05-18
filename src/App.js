import React, { Component } from 'react';
import styled from 'styled-components';
import Article from './components/Article';

const ArticleContainer = styled.ul`
  columns: 3;
  column-gap: 10px;
`;

const MainContainer = styled.main`
  display: grid;
  grid-template-columns: 25% 75%;
`;

class App extends Component {
  state = {
    feeds: [
      { name: 'TechCrunch', url: 'https://techcrunch.com/feed/' },
      { name: 'The Guardian Tech', url: 'https://www.theguardian.com/uk/technology/rss' },
      { name: 'Reddit/r/News', url: 'https://www.reddit.com/r/news/.rss' },
      { name: 'this will error', url: 'no' },
    ],
    articles: [],
  };

  componentDidMount() {
    this.fetchAllFeeds();
  }

  fetchAllFeeds = () => {
    const { feeds } = this.state;
    const baseURI = 'https://api.rss2json.com/v1/api.json';

    feeds.forEach(async feed => {
      try {
        const fetchedArticles = await this.fetchFeed(
          `${baseURI}?rss_url=${encodeURIComponent(feed.url)}`
        );
        this.setState({ articles: [...this.state.articles, ...fetchedArticles] });
      } catch (error) {
        console.log(error);
      }
    });
  };

  fetchFeed = uri =>
    new Promise(async (resolve, reject) => {
      const rawData = await (await fetch(uri)).json();
      if (rawData.status === 'ok') {
        const articles = rawData.items.map(item => ({ source: rawData.feed, article: item }));
        resolve(articles);
      }
      reject(new Error(rawData.message));
    });

  render() {
    const { articles } = this.state;
    console.log(this.state);
    return (
      <MainContainer>
        <aside>
          <h1>Content Generator</h1>
          <input type="text" placeholder="Filter your feeds..." />
          <ul>
            {
              // feeds list
            }
          </ul>
          <hr />
          <h2>Add a new feed</h2>
          <input type="text" placeholder="Type your feed name..." />
          <input type="text" placeholder="Copy your RSS url..." />
          <button>Add feed</button>
        </aside>
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
      </MainContainer>
    );
  }
}

export default App;
