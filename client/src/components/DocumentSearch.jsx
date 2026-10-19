import { TYPES } from '../constants.js';

function DocumentSearch({ filterType, onFilterChange }) {
  return (
    <div className="pills" role="group" aria-label="Фильтр по типу">
      <button
        type="button"
        className={filterType === 'all' ? 'pill active' : 'pill'}
        onClick={() => onFilterChange('all')}
      >
        Все
      </button>
      {TYPES.map((type) => (
        <button
          key={type}
          type="button"
          className={filterType === type ? 'pill active' : 'pill'}
          onClick={() => onFilterChange(type)}
        >
          {type}
        </button>
      ))}
    </div>
  );
}

export default DocumentSearch;
