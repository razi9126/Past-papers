import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PublicRoute = ({ component: Component, user, ...rest }) => (
  <Route
    {...rest}
    render={(props) => (
      user === null 
      ? <Component {...props} />
      : <Redirect to={{
        pathname: props.location.state !== undefined ? props.location.state.from.pathname : '/'
      }}/>
    )}
  />
);

export default PublicRoute;