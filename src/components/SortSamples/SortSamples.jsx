import React from 'react';
import Dropdown from 'react-dropdown';
import PropTypes from 'prop-types';

import './SortSamples.scss';

const SortSamples = ({ options, onSortChange, value }) => (
  <div className="sort-samples-container">
    <div className="sort-container">
      <h2>Your samples:</h2>

      <div className="sort-wrapper">
        <div className="sort-wrapper-label">Sort by:</div>
        <Dropdown
          onChange={onSortChange}
          value={value}
          options={options}
        />
      </div>
    </div>

    <div className="separator" />
  </div>
);

SortSamples.propTypes = {
  onSortChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  value: PropTypes.object.isRequired,
};

export default SortSamples;
