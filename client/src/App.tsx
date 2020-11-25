import React, { useContext } from 'react';
import Header from './components/Header';
import OuterNav from './components/OuterNav';
import { GlobalContext } from './GlobalContext';
import './styles/styles.scss';

const App: React.FC = () => {

  const { navVisible } = useContext(GlobalContext)

  return (
    <main className={`${navVisible ? 'nav-open' : ''}`}>
      <div className="container">
        <Header />
      </div>
      <OuterNav />
    </main>
  );
}

export default App;
