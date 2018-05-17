import React, { Component } from 'react';
import './App.css';

class App extends Component {
  state = { articles: [] };

  async componentDidMount() {
    const newArticles = await this.fetchFeed(
      'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Ftechcrunch.com%2Ffeed%2F'
    );

    const articles = [...this.state.articles, ...newArticles];

    this.setState({ articles });
  }

  fetchFeed = async uri => {
    const rawData = await (await fetch(uri)).json();
    const articles = rawData.items.map(item => ({ origin: rawData.feed, article: item }));

    return articles;
  };

  render() {
    console.log(this.state);
    return (
      <section>
        {this.state.articles.length > 0
          ? this.state.articles.map(el => <li key={el.article.guid}>{el.article.title}</li>)
          : ''}
      </section>
    );
  }
}

export default App;
