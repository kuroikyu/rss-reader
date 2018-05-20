import React, { Component } from 'react';
import styled from 'styled-components';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faSearch from '@fortawesome/fontawesome-free-solid/faSearch';

import Article from './components/Article';
import FeedsList from './components/FeedsList';

const ArticleContainer = styled.ul`
  columns: 3;
  column-gap: 20px;
  margin: 0;
  padding: 40px;
  margin-left: 25%;
  background-color: var(--light);
`;

const MainContainer = styled.main``;

const Sidebar = styled.aside`
  position: fixed;
  top: 0;
  width: 25%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 15px 30px 0 35px;
  background-color: var(--background);
  color: var(--light);
  h1 {
    font-weight: 300;
    font-size: 1.8em;
    text-align: center;
    margin: 2em 0;
  }
  h2 {
    font-size: 1.1em;
    text-align: center;
  }
  hr {
    margin: 3.5em 0;
    border: 1px solid var(--input-border);
  }
  form {
    padding: 0 1.25em;
    display: grid;
    grid-row-gap: 1em;
  }
`;

const SearchFeeds = styled.div`
  display: flex;
  margin-top: 1em;
  input {
    flex-grow: 1;
    margin-right: 20px;
  }
  svg.svg-inline--fa {
    width: 30px;
    height: 30px;
  }
`;

const SidebarInput = styled.input`
  background-color: var(--input-background);
  border: 2px solid var(--input-border);
  border-radius: 200px;
  padding: 5px 15px;
  color: var(--light);
  width: 100%;
  &::placeholder {
    color: var(--placeholder-text);
    font-style: italic;
    font-weight: bold;
  }
  &:focus {
    outline: none;
    border: 2px solid var(--accent);
  }
`;

const SidebarButton = styled.button`
  background: var(--accent);
  width: 100%;
  color: var(--light-text);
  border: none;
  border-radius: 200px;
  padding: 5px 15px;
  font-size: 1.1em;
`;

class App extends Component {
  state = {
    feeds: [
      { id: 1, name: 'TechCrunch', url: 'https://techcrunch.com/feed/', solo: false },
      {
        id: 2,
        name: 'The Guardian Tech',
        url: 'https://www.theguardian.com/uk/technology/rss',
        solo: false,
      },
      { id: 3, name: 'Reddit/r/News', url: 'https://www.reddit.com/r/news/.rss', solo: false },
      {
        id: 4,
        name: 'Reddit/r/Android',
        url: 'https://www.reddit.com/r/android/.rss',
        solo: false,
      },
      { id: 5, name: 'Reddit/r/macOS', url: 'https://www.reddit.com/r/macos/.rss', solo: false },
      { id: 6, name: 'Reddit/r/apple', url: 'https://www.reddit.com/r/apple/.rss', solo: false },
      {
        id: 7,
        name: 'Reddit/r/javascript',
        url: 'https://www.reddit.com/r/javascript/.rss',
        solo: false,
      },
      {
        id: 8,
        name: 'Reddit/r/factorio',
        url: 'https://www.reddit.com/r/factorio/.rss',
        solo: false,
      },

      // { id: 4, name: 'this will error', url: 'no', solo: false },
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
      solo: false,
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

  handleCheckbox = checkedId => {
    const newState = { ...this.state };
    const feedToUpdate = newState.feeds.filter(feed => feed.id === checkedId)[0];
    feedToUpdate.solo = !feedToUpdate.solo;
    this.setState({ feeds: [...newState.feeds] });
  };

  render() {
    const { feeds, articles, feedNameFilter } = this.state;
    const soloFeeds = feeds.filter(feed => feed.solo).map(feed => feed.id);

    return (
      <MainContainer>
        <Sidebar>
          <h1>Content Generator</h1>
          <SearchFeeds>
            <SidebarInput
              type="text"
              placeholder="Filter your feeds..."
              value={feedNameFilter}
              onChange={this.handleChange}
            />
            <FontAwesomeIcon icon={faSearch} />
          </SearchFeeds>
          <FeedsList
            feeds={feeds}
            filter={feedNameFilter}
            handleDelete={this.handleDelete}
            handleCheckbox={this.handleCheckbox}
          />
          <hr />
          <form action="" onSubmit={this.handleSubmit}>
            <h2>Add a new feed</h2>
            <SidebarInput type="text" placeholder="Type your feed name..." ref={this.feedNameRef} />
            <SidebarInput
              type="text"
              placeholder="Copy your RSS url..."
              ref={this.feedURLRef}
              required
            />
            <SidebarButton type="submit">Add feed</SidebarButton>
          </form>
        </Sidebar>
        <section>
          <ArticleContainer>
            {articles.length > 0 &&
              articles
                .filter(article => {
                  if (soloFeeds.length > 0) {
                    return soloFeeds.some(solofeed => solofeed === article.source.feedId);
                  }
                  return true;
                })
                .map(el => (
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
