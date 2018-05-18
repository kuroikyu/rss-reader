import React, { Component } from 'react';
import styled from 'styled-components';
import Article from './components/Article';

const ArticleContainer = styled.ul`
  columns: 3;
  column-gap: 40px;
  margin-left: 25%;
`;

const MainContainer = styled.main``;

const Sidebar = styled.aside`
  width: 25%;
  position: fixed;
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
    const { feeds, articles } = this.state;
    return (
      <MainContainer>
        <Sidebar>
          <h1>Content Generator</h1>
          <input type="text" placeholder="Filter your feeds..." />
          <ul>{feeds && feeds.map(feed => <li>{feed.name}</li>)}</ul>
          <hr />
          <h2>Add a new feed</h2>
          <input type="text" placeholder="Type your feed name..." />
          <input type="text" placeholder="Copy your RSS url..." />
          <button>Add feed</button>
        </Sidebar>
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
