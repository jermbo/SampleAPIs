import React from "react";

interface Props {}

const StyleGuide: React.FC<Props> = () => {
  return (
    <div className="page -style-guide">
      <div className="typography">
        <h1>Home Page</h1>
        <h2>Home Page</h2>
        <h3>Home Page</h3>
        <h4>Home Page</h4>
        <h5>Home Page</h5>
        <h6>Home Page</h6>
        <hr />
        <p className="text-1">This is a story all about how</p>
        <p className="text-2">This is a story all about how</p>
        <p className="text-3">This is a story all about how</p>
        <p className="text-4">This is a story all about how</p>
        <p className="text-5">This is a story all about how</p>
        <hr />
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda minus debitis unde
          soluta eligendi quasi accusantium facere ratione vel, provident ut fugit?
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda minus debitis unde
          soluta eligendi quasi accusantium facere ratione vel, provident ut fugit?
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda minus debitis unde
          soluta eligendi quasi accusantium facere ratione vel, provident ut fugit?
        </p>
        <hr />
        <p className="display-1">Sample APIs</p>
        <p className="display-2">Sample APIs</p>
        <p className="display-3">Sample APIs</p>
        <p className="display-4">Sample APIs</p>
        <p className="display-5">Sample APIs</p>
        <p className="display-6">Sample APIs</p>
      </div>
    </div>
  );
};

export default StyleGuide;
