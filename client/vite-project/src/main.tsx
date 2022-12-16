import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import GlobalProvider from "./context/GlobalContext";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <GlobalProvider>
        <App />
      </GlobalProvider>
    </BrowserRouter>
  </React.StrictMode>,
);

// ReactDOM.render(
//   <React.StrictMode>
//     <Router>
//       <GlobalProvider>
//         <App />
//       </GlobalProvider>
//     </Router>
//   </React.StrictMode>,
//   document.getElementById("root"),
// );
