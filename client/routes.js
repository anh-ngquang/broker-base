import React from 'react';
import { Route, Switch } from 'react-router-dom';
import AppliedRoute from './components/AppliedRoute';

import Import from './components/Import';
import SignIn from './components/SignIn';
import Filter from './components/Filter';

export const Routes = ({ childProps }) => (
  <Switch>
    <AppliedRoute exact path="/signin" component={SignIn} props={childProps} />
    <AppliedRoute exact path="/import" component={Import} props={childProps} />
    <AppliedRoute exact path="/"  component={Filter} props={childProps} />
  </Switch>
);
export default Routes;