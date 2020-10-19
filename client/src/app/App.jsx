import React, { useState, useEffect, useCallback } from 'react';
import { Switch, Route, Redirect, BrowserRouter } from 'react-router-dom'

import Header from './header/Header';
import Footer from './footer/Footer';

import Shop from '../pages/shop/Shop';
import Login from '../pages/login/Login';
import Register from '../pages/register/Register';
import Logout from '../pages/logout/Logout';
import NotFound from '../pages/notFound/NotFound';
import Merch from '../pages/merch/Merch';
import Cart from '../pages/cart/Cart';

import user from '../services/user';
import AuthContext from '../contexts/auth';
import ProtectedRoute from '../components/protectedRoute/ProtectedRoute';
import './App.css';

function App() {
  const [authState, setAuthState] = useState({
    isLoading: true,
    isLogin: false,
    user: null,
    jwt: ''
  });

  const loginUser = useCallback((response) => {
    setAuthState({
      isLoading: false,
      isLogin: true,
      user: response.data,
      jwt: response.headers["x-auth-token"]
    })
  }, [])

  const logoutUser = useCallback(() => {
    setAuthState({
      isLoading: false,
      isLogin: false,
      user: null,
      jwt: ''
    })
  }, [])

  const noUser = useCallback(() => {
    setAuthState({
      isLoading: false,
      isLogin: false,
      user: null,
      jwt: ''
    })
  }, [])

  useEffect(() => {
    async function verifyUserJwt(jwt) {
      try {
        const response = await user.verifyJwt(jwt);
        loginUser(response);
      }
      catch (ex) {
        logoutUser();
        user.logout();
        if (ex.response) return alert(ex.response.data.error);
        throw (ex);
      }
    }
    const curJwt = user.getJwt();
    if (curJwt) verifyUserJwt(curJwt);
    else noUser();
  }, [loginUser, logoutUser, noUser])

  return (
    <div className="App">
      <AuthContext.Provider value={authState}>
        <BrowserRouter>
          <Header />
          <Switch>
            <Route path='/login' component={Login} />
            <Route path='/register' component={Register} />
            <Route path='/logout' component={Logout} />
            <Route path='/merch/:merchid' component={Merch} />
            <ProtectedRoute
              path='/cart/:cartid'
              component={Cart}
              redirectPath='/login'
              authLevel={2}
            />
            <Route path='/not-found' component={NotFound} />
            <Route exact path='/' component={Shop} />
            <Redirect to='/not-found' />
          </Switch>
          <Footer />
        </BrowserRouter>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
