import React, { ChangeEvent } from "react";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {
  onChangeHandler: (e: ChangeEvent<HTMLInputElement>) => void;
}

const APISearch: React.FC<Props> = ({ onChangeHandler }) => {
  return (
    <div className="api-search">
      <div className="api-search__inner">
        <input type="text" id="search" className="input" onChange={onChangeHandler} />
        <label htmlFor="search">
          <FontAwesomeIcon icon={faSearch} />
        </label>
      </div>
    </div>
  );
};

export default APISearch;
