import React from "react";

interface Props {
  categories: string[];
}

const APICategories: React.FC<Props> = ({ categories }) => {
  return (
    <ul className="api-categories">
      {categories.map((cat) => (
        <li key={cat} className="api-category">
          {cat}
        </li>
      ))}
    </ul>
  );
};

export default APICategories;
