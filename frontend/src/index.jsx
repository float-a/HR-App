import * as React from 'react';
import  {Router, Route,hashHistory, IndexRoute} from 'react-router';
import * as ReactDOM from 'react-dom';
import App from './components/App';
import Department from './components/department/Department';
import ConcertsList from './components/concertslist/ConcertsList.jsx';
import './assets/less/index.less';
import Dashboard from './components/dashboard/Dashboard.jsx';

const Routes = () => {

    return (
        <Router history={hashHistory}>
            <Route path="/" component={App}>
                <IndexRoute component={Dashboard}/>
                <Route path="Department" component={Department}>
                </Route>
            </Route>
        </Router>
    )

};


ReactDOM.render(<Routes/>, document.getElementById('root'));