import React, { Component } from 'react';
import styled from 'styled-components';
import Article from './components/Article';
import FeedsList from './components/FeedsList';

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
    feedNameFilter: '',
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
        const fetchedArticles = await this.fetchFeed(feed.url, feed.name, feed.id);
        this.setState({ articles: [...this.state.articles, ...fetchedArticles] });
      } catch (error) {
        // TODO: Notify the user somehow
        console.log(error);
      }
    });
  };

  fetchFeed = (url, userTitle, feedId) =>
    new Promise(async (resolve, reject) => {
      // Build full URL
      const fullURL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`;

      // Await response and parse contents
      const rawData = await (await fetch(fullURL)).json();

      // If the response is ok, build the response object and resolve the promise
      if (rawData.status === 'ok') {
        const articles = rawData.items.map(item => ({
          source: { ...rawData.feed, userTitle, feedId },
          article: item,
        }));
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
    const newArticles = await this.fetchFeed(newFeed.url, newFeed.name, newFeed.id);

    // If the user didn't give a name to the feed, infer it from the rss feed
    if (!newFeed.name) {
      newFeed.name = newArticles[0].source.title;
    }

    // Update State
    const feeds = [...this.state.feeds, newFeed];
    const articles = [...this.state.articles, ...newArticles];
    this.setState({ feeds, articles });
  };

  handleDelete = deleteId => {
    // Get current state
    const { feeds, articles } = this.state;

    // Filter out from feeds and articles
    const newFeeds = feeds.filter(feed => feed.id !== deleteId);
    const newArticles = articles.filter(article => article.source.feedId !== deleteId);

    // Update state
    this.setState({ feeds: newFeeds, articles: newArticles });
  };

  handleChange = event => {
    this.setState({ feedNameFilter: event.currentTarget.value });
  };

  render() {
    const { feeds, articles, feedNameFilter } = this.state;
    return (
      <MainContainer>
        <Sidebar>
          <h1>Content Generator</h1>
          <input
            type="text"
            placeholder="Filter your feeds..."
            value={feedNameFilter}
            onChange={this.handleChange}
          />
          <FeedsList feeds={feeds} filter={feedNameFilter} />
          <hr />
          <h2>Add a new feed</h2>
          <form action="" onSubmit={this.handleSubmit}>
            <input type="text" placeholder="Type your feed name..." ref={this.feedNameRef} />
            <input type="text" placeholder="Copy your RSS url..." ref={this.feedURLRef} required />
            <button type="submit">Add feed</button>
          </form>
        </Sidebar>
        <section>
          <ArticleContainer>
            {articles.length > 0 &&
              articles.map(el => (
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
        </section>
      </MainContainer>
    );
  }
}

export default App;
