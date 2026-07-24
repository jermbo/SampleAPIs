import React, { ChangeEvent } from "react";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {
  onChangeHandler: (e: ChangeEvent<HTMLInputElement>) => void;
}

const APISearch: React.FC<Props> = ({ onChangeHandler }) => {
  return (
    <search className="api-search">
      <div className="api-search__inner">
        <input
          type="search"
          id="search"
          className="input"
          placeholder="Search APIs"
          aria-label="Search APIs"
          onChange={onChangeHandler}
        />
        <label htmlFor="search" aria-hidden="true">
          <FontAwesomeIcon icon={faSearch} />
        </label>
      </div>
    </search>
  );
};

export default APISearch;
