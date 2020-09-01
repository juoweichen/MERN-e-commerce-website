import React from 'react';
import { Switch, Route, Redirect, BrowserRouter } from 'react-router-dom'

import Header from './header/Header';
import Footer from './footer/Footer';

import Shop from 'pages/shop/Shop';
import Login from 'pages/login/Login';
import Register from 'pages/register/Register';
import Logout from 'pages/logout/Logout';
import NotFound from 'pages/notFound/NotFound';

import './App.css';

function App() {
  return (
    <div className="App">
      <Header user={null} />
      <BrowserRouter>
        <Switch>
          <Route path='/login' component={Login} />
          <Route path='/register' component={Register} />
          <Route path='/logout' component={Logout} />
          <Route path='/not-found' component={NotFound} />
          <Route exact path='/' component={Shop} />
          <Redirect to='/not-found' />
        </Switch>
      </BrowserRouter>
      <Footer />
    </div>
  );
}

export default App;
