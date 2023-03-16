import { Fragment } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import ChatPage from './pages/ChatPage';
import HomePage from './pages/HomePage';

function App() {
  return (
    <Fragment>
      <div className="App">
        <Routes>
        <Route path='/' Component={HomePage}></Route>
        <Route path='/chats' Component={ChatPage}></Route>
        </Routes>
      </div>
    </Fragment>

  );
}

export default App;
