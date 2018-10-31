import React from 'react';
import { Route, Switch } from 'react-router-dom';

import App from './components/app';
import SignIn from './components/SignIn';

export const Routes = () => (
  <Switch>
    <Route path="/signin" exact component={SignIn} />
  </Switch>
);
export default Routes;