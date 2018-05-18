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

  feedNameRef = React.createRef();
  feedURLRef = React.createRef();

  fetchAllFeeds = () => {
    const { feeds } = this.state;

    // Loop through all feeds to get the articles
    feeds.forEach(async feed => {
      try {
        const fetchedArticles = await this.fetchFeed(feed.url);
        this.setState({ articles: [...this.state.articles, ...fetchedArticles] });
      } catch (error) {
        // TODO: Notify the user somehow
        console.log(error);
      }
    });
  };

  fetchFeed = url =>
    new Promise(async (resolve, reject) => {
      // Build full URL
      const fullURL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`;

      // Await response and parse contents
      const rawData = await (await fetch(fullURL)).json();

      // If the response is ok, build the response object and resolve the promise
      if (rawData.status === 'ok') {
        const articles = rawData.items.map(item => ({ source: rawData.feed, article: item }));
        resolve(articles);
      }

      // Otherwise return the API message as error
      reject(new Error(rawData.message));
    });

  handleSubmit = async event => {
    // Stop the form from submitting
    event.preventDefault();

    // Create new feed object
    const newFeed = {
      id: Date.now(),
      name: this.feedNameRef.current.value,
      url: this.feedURLRef.current.value,
    };

    // Reset the form
    event.currentTarget.reset();

    // Fetch feed
    const newArticles = await this.fetchFeed(newFeed.url);

    // Update State
    const feeds = [...this.state.feeds, newFeed];
    const articles = [...this.state.articles, ...newArticles];
    this.setState({ feeds, articles });
  };

  render() {
    const { feeds, articles } = this.state;
    return (
      <MainContainer>
        <Sidebar>
          <h1>Content Generator</h1>
          <input type="text" placeholder="Filter your feeds..." />
          <ul>{feeds && feeds.map(feed => <li key={feed.id}>{feed.name}</li>)}</ul>
          <hr />
          <h2>Add a new feed</h2>
          <form action="" onSubmit={this.handleSubmit}>
            <input type="text" placeholder="Type your feed name..." ref={this.feedNameRef} />
            <input type="text" placeholder="Copy your RSS url..." ref={this.feedURLRef} />
            <button type="submit">Add feed</button>
          </form>
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
