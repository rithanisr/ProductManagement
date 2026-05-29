const FilterBar = ({
  search,
  onSearch,
  categories,
  category,
  onCategory,
  status,
  onStatus
}) => {
  return (
    <div className="row g-2 align-items-center">
      <div className="col-12 col-lg-5">
        <label className="form-label visually-hidden" htmlFor="searchInput">
          Search products
        </label>
        <input
          id="searchInput"
          type="search"
          className="form-control"
          placeholder="Search products"
          value={search}
          onChange={(event) => onSearch(event.target.value)}
        />
      </div>

      <div className="col-6 col-lg-3">
        <label className="form-label visually-hidden" htmlFor="categoryFilter">
          Category filter
        </label>
        <select
          id="categoryFilter"
          className="form-select"
          value={category}
          onChange={(event) => onCategory(event.target.value)}
        >
          <option value="">All categories</option>
          {categories.map((item) => (
            <option key={item.id} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

    </div>
  );
};

export default FilterBar;
