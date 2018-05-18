import React from 'react';
import PropTypes from 'prop-types';

const FeedsList = ({ feeds, filter, handleDelete, handleCheckbox }) => (
  <ul>
    {feeds.filter(feed => feed.name.toLowerCase().indexOf(filter.toLowerCase()) >= 0).map(feed => (
      <li key={feed.id}>
        <input
          type="checkbox"
          name="feedSolo"
          id={`check-${feed.id}`}
          defaultChecked={feed.solo}
          onChange={() => handleCheckbox(feed.id)}
        />
        {feed.name} <button onClick={() => handleDelete(feed.id)}>Delete</button>
      </li>
    ))}
  </ul>
);

FeedsList.propTypes = {
  feeds: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      solo: PropTypes.bool.isRequired,
    })
  ).isRequired,
  filter: PropTypes.string.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleCheckbox: PropTypes.func.isRequired,
};

export default FeedsList;
