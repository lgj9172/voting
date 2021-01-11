import React from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import VoteList from '../pages/VoteList';
import VoteDetail from '../pages/VoteDetail';
import VoteUpdate from '../pages/VoteUpdate';

const Root: React.FC = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={VoteList} />
                <Route path="/detail" component={VoteDetail} />
                <Route path="/update" component={VoteUpdate} />
                <Redirect path="*" to="/" />
            </Switch>
        </BrowserRouter>
    )
}

export default Root