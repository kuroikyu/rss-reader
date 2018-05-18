import React from 'react';
import PropTypes from 'prop-types';

const FeedsList = ({ feeds, filter }) => (
  <ul>
    <h1>{filter}</h1>
    {feeds.filter(feed => feed.name.toLowerCase().indexOf(filter.toLowerCase()) >= 0).map(feed => (
      <li key={feed.id}>
        {feed.name} <button onClick={() => this.handleDelete(feed.id)}>Delete</button>
      </li>
    ))}
  </ul>
);

FeedsList.propTypes = {
  feeds: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  filter: PropTypes.string.isRequired,
};

export default FeedsList;
