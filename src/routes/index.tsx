import React from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import VoteList from '../pages/VoteList';
import VoteResult from '../pages/VoteResult';
import VoteSelect from '../pages/VoteSelect';
import VoteUpdate from '../pages/VoteUpdate';
import VoteWrite from '../pages/VoteWrite';

const Root: React.FC = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={VoteList} />
                <Route path="/write" component={VoteWrite} />
                <Route path="/select" component={VoteSelect} />
                <Route path="/result" component={VoteResult} />
                <Route path="/update" component={VoteUpdate} />
                <Redirect path="*" to="/" />
            </Switch>
        </BrowserRouter>
    )
}

export default Root