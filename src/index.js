import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter } from 'react-router-dom'
import { Switch, Route } from 'react-router-dom'


const Main = () => (
    <main>
        <Switch>
            <Route exact path='/' component={App} />
            <Route path='/:number' component={App} />
        </Switch>
    </main>
)


ReactDOM.render(<BrowserRouter><Main /></BrowserRouter>, document.getElementById('root'));
//registerServiceWorker();
