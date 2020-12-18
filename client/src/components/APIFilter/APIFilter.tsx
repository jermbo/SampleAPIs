import React, { ChangeEvent } from "react";
import { upperCase } from "../../utils/Helpers";

interface Props {
  onChangeHandler: (e: ChangeEvent<HTMLSelectElement>) => void;
  categories: string[];
}

const APIFilter: React.FC<Props> = ({ onChangeHandler, categories }) => {
  return (
    <div className="api-filter">
      <select onChange={onChangeHandler}>
        <option value="all">All Categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {upperCase(cat)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default APIFilter;
