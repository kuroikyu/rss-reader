import React, { Component } from 'react';
import styled from 'styled-components';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faSearch from '@fortawesome/fontawesome-free-solid/faSearch';
import faBars from '@fortawesome/fontawesome-free-solid/faBars';
import faTimes from '@fortawesome/fontawesome-free-solid/faTimes';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import ArticleList from './components/ArticleList';
import FeedsList from './components/FeedsList';

// TODO: Move into a helpers file
const mobileBreak = 756;
const bigDesktopBreak = 1500;
const hideSidebarBreak = 1100;

const Sidebar = styled.aside`
  position: fixed;
  top: 0;
  width: 100%;
  max-width: 25%;
  height: 100%;
  z-index: 2;
  overflow: scroll;
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
  ul {
    flex-grow: 1;
  }
  hr {
    margin: 0;
    margin-bottom: 4em;
    border: none;
    border-bottom: 3px solid var(--input-border);
  }
  form {
    padding: 0 1.25em;
    margin-bottom: 4em;
    display: grid;
    grid-row-gap: 1em;
  }
  @media screen and (max-width: 1100px) {
    ${props =>
      props.displaySidebar
        ? `
    max-width: unset;
    width: auto;
    `
        : `
    max-width: 4em;
    padding: 1em 0;
    `};
  }
`;

const MenuButton = styled.button`
  border: none;
  background: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  place-items: center;
`;

const SidebarInput = styled.div`
  input {
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
  }
`;

const SearchFeeds = styled.div`
  display: flex;
  margin-top: 1em;
  ${SidebarInput} {
    flex-grow: 1;
    margin-right: 20px;
  }
  svg.svg-inline--fa {
    width: 30px;
    height: 30px;
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
  border: 2px solid var(--accent);
  &:focus {
    outline: none;
    border: 2px solid var(--light);
  }
`;

class App extends Component {
  state = {
    feeds: [
      // { id: 1, name: 'TechCrunch', url: 'https://techcrunch.com/feed/', solo: false },
      // {
      //   id: 2,
      //   name: 'The Guardian Tech',
      //   url: 'https://www.theguardian.com/uk/technology/rss',
      //   solo: false,
      // },
      // { id: 3, name: 'Reddit/r/News', url: 'https://www.reddit.com/r/news/.rss', solo: false },
      // {
      //   id: 4,
      //   name: 'Reddit/r/Android',
      //   url: 'https://www.reddit.com/r/android/.rss',
      //   solo: false,
      // },
      // { id: 5, name: 'Reddit/r/macOS', url: 'https://www.reddit.com/r/macos/.rss', solo: false },
      // { id: 6, name: 'Reddit/r/apple', url: 'https://www.reddit.com/r/apple/.rss', solo: false },
      // {
      //   id: 7,
      //   name: 'Reddit/r/javascript',
      //   url: 'https://www.reddit.com/r/javascript/.rss',
      //   solo: false,
      // },
      // {
      //   id: 8,
      //   name: 'Reddit/r/factorio',
      //   url: 'https://www.reddit.com/r/factorio/.rss',
      //   solo: false,
      // },
    ],
    articles: [],
    feedNameFilter: '',
    columns: 3,
    windowWidth: 1600,
    displaySidebar: false,
  };

  componentDidMount() {
    this.fetchAllFeeds();
    this.handleWindowResize();

    // Reinstate our local storage
    const localStorageRef = localStorage.getItem('rss-reader-kuroikyu');
    if (localStorageRef) {
      this.setState(JSON.parse(localStorageRef));
    }

    // Listen for window resize
    window.addEventListener('resize', this.handleWindowResize);
  }

  componentDidUpdate() {
    // Store data in local storage
    const currentState = JSON.stringify(this.state);
    localStorage.setItem('rss-reader-kuroikyu', currentState);
  }

  feedNameRef = React.createRef();
  feedURLRef = React.createRef();

  handleWindowResize = () => {
    // Get devide width
    const windowWidth = window.innerWidth;

    // initial column state
    let { columns } = this.state;

    // Apply logic for the different breakpoints
    if (windowWidth >= bigDesktopBreak) {
      columns = 3;
    } else if (windowWidth < bigDesktopBreak && windowWidth > mobileBreak) {
      columns = 2;
    } else if (windowWidth < mobileBreak) {
      columns = 1;
    }

    // Update state
    this.setState({ columns, windowWidth });
  };

  fetchAllFeeds = () => {
    const { feeds } = this.state;

    // Loop through all feeds to get the articles
    feeds.forEach(async feed => {
      try {
        const fetchedArticles = await this.fetchFeed(feed.url, feed.name, feed.id);
        this.setState({ articles: [...this.state.articles, ...fetchedArticles] });
      } catch (error) {
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

  displayError = error =>
    toast.error(error.toString(), {
      position: toast.POSITION.BOTTOM_LEFT,
    });

  handleSubmit = async event => {
    const errors = [];

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
    const newArticles = await this.fetchFeed(newFeed.url, newFeed.name, newFeed.id).catch(error =>
      errors.push(error)
    );

    // If the feed fetch fails, abort handleSubmit
    if (errors.length > 0) {
      errors.forEach(error => this.displayError(error));
      return 0;
    }

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

  handleSidebar = () => {
    this.setState({ displaySidebar: !this.state.displaySidebar });
  };

  render() {
    const {
      feeds,
      articles: rawArticles,
      feedNameFilter,
      columns,
      windowWidth,
      displaySidebar,
    } = this.state;

    // Apply solo filtering if there's any.
    const soloFeeds = feeds.filter(feed => feed.solo).map(feed => feed.id);
    const unsortedArticles = rawArticles.filter(article => {
      if (soloFeeds.length > 0) {
        return soloFeeds.some(solofeed => solofeed === article.source.feedId);
      }
      return true;
    });

    // Sort articles by date
    const articles = unsortedArticles.sort(
      (a, b) => new Date(b.article.pubDate) - new Date(a.article.pubDate)
    );

    return (
      <main>
        <Sidebar displaySidebar={displaySidebar}>
          {// Show the menu button once it reaches the breakpoint
          windowWidth <= hideSidebarBreak && (
            <MenuButton onClick={this.handleSidebar}>
              <FontAwesomeIcon icon={displaySidebar ? faTimes : faBars} size="2x" />
              Menu
            </MenuButton>
          )}
          {// Show the menu if the menu button is clicked or if the device is wide enough
          (displaySidebar || windowWidth > hideSidebarBreak) && (
            <React.Fragment>
              <h1>Content Generator</h1>
              <SearchFeeds>
                <SidebarInput>
                  <input
                    type="text"
                    placeholder="Filter your feeds..."
                    value={feedNameFilter}
                    onChange={this.handleChange}
                  />
                </SidebarInput>
                <FontAwesomeIcon icon={faSearch} />
              </SearchFeeds>
              <FeedsList
                feeds={feeds}
                filter={feedNameFilter}
                handleDelete={this.handleDelete}
                handleCheckbox={this.handleCheckbox}
              />
              <hr />
              <form onSubmit={this.handleSubmit}>
                <h2>Add a new feed</h2>
                <SidebarInput>
                  <input type="text" placeholder="Type your feed name..." ref={this.feedNameRef} />
                </SidebarInput>
                <SidebarInput>
                  <input
                    type="text"
                    placeholder="Copy your RSS url..."
                    ref={this.feedURLRef}
                    required
                  />
                </SidebarInput>
                <SidebarButton type="submit">Add feed</SidebarButton>
              </form>
              <ToastContainer />
            </React.Fragment>
          )}
        </Sidebar>
        <section>
          {articles.length > 0 && (
            <ArticleList
              mobileView={windowWidth < hideSidebarBreak}
              columns={columns}
              articles={articles}
            />
          )}
        </section>
      </main>
    );
  }
}

export default App;
