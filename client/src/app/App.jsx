import React, { useState, useEffect } from 'react';
import { Switch, Route, Redirect, BrowserRouter } from 'react-router-dom'

import Header from './header/Header';
import Footer from './footer/Footer';

import Shop from '../pages/shop/Shop';
import Login from '../pages/login/Login';
import Register from '../pages/register/Register';
import Logout from '../pages/logout/Logout';
import NotFound from '../pages/notFound/NotFound';

import user from '../services/user';
import AuthContext from '../contexts/auth';
import './App.css';

function App() {
  const [authState, setAuthState] = useState({
    isLogin: false,
    user: null,
    loginUser,
    logoutUser,
    jwt: ''
  });

  function loginUser(response) {
    console.log(`data: ${response.data}`);
    console.log(`jwt: ${response.headers["x-auth-token"]}`);

    user.loginWithJwt(response.headers["x-auth-token"]);
    setAuthState({
      ...authState,
      isLogin: true,
      user: response.data,
      jwt: response.headers["x-auth-token"]
    })
  }

  function logoutUser() {
    user.logout();
    setAuthState({
      ...authState,
      isLogin: false,
      user: null,
      jwt: ''
    })
  }

  useEffect(() => {
    async function verifyUserJwt(jwt) {
      console.log('try verify');
      try {
        // const response = await user.verifyJwt(jwt);
        const response = user.verifyJwt(jwt);
        loginUser(response);
      }
      catch (ex) {
        if (ex.response) {
          return console.log(ex.response);
        }
        throw (ex);
      }
    }
    const curJwt = user.getJwt();
    if (curJwt) verifyUserJwt(curJwt);
  }, [])

  return (
    <div className="App">
      <AuthContext.Provider value={authState}>
        <Header />
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
      </AuthContext.Provider>
    </div>
  );
}

export default App;
