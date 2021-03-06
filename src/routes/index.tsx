import React from 'react';
import {Switch, Route} from 'react-router-dom';

import Dashboard from '../pages/Dashboard';
import Repository from '../pages/Repository';

const Routes: React.FC = () => {
  return (
    <Switch>
      <Route path='/' component={Dashboard} exact />
      {/** + serve para demonstrar que todo caminho na rota faz parte dela mesma  */}
      <Route path='/repositories/:repository+' component={Repository} />
    </Switch>
  )
}

export default Routes;