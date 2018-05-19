import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faCircle from '@fortawesome/fontawesome-free-regular/faCircle';
import faDotCircle from '@fortawesome/fontawesome-free-regular/faDotCircle';

const FeedLi = styled.li`
  list-style: none;
  display: flex;
  align-items: center;
  font-weight: bold;
  margin-bottom: 1.3em;
  label {
    flex-grow: 1;
    display: flex;
    align-items: center;
  }
  svg.svg-inline--fa {
    width: 22px;
    height: 22px;
  }
`;

const Checkbox = styled.span`
  margin-right: 1em;
`;

const DeleteButton = styled.button`
  padding: 0;
  margin: 0;
  border: none;
  background: var(--red);
  color: var(--light-text);
  font-size: 0.9em;
  width: 22px;
  height: 22px;
  border-radius: 100%;
  place-content: center;
`;

const FeedsList = ({ feeds, filter, handleDelete, handleCheckbox }) => (
  <ul style={{ padding: 0, margin: 0, marginTop: '2em' }}>
    {feeds.filter(feed => feed.name.toLowerCase().indexOf(filter.toLowerCase()) >= 0).map(feed => (
      <FeedLi key={feed.id}>
        <label>
          <input
            type="checkbox"
            name="feedSolo"
            id={`check-${feed.id}`}
            defaultChecked={feed.solo}
            onChange={() => handleCheckbox(feed.id)}
            style={{ display: 'none' }}
          />
          <Checkbox>
            {feed.solo ? (
              <FontAwesomeIcon icon={faDotCircle} />
            ) : (
              <FontAwesomeIcon icon={faCircle} />
            )}
          </Checkbox>
          {feed.name}
        </label>
        <DeleteButton onClick={() => handleDelete(feed.id)}>
          <span> &#x2715;</span>
        </DeleteButton>
      </FeedLi>
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
