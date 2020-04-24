import React from 'react'
import 'antd/dist/antd.css'
import { ApolloProvider } from "react-apollo"
import { ApolloClient } from "apollo-boost"
import { InMemoryCache } from "apollo-cache-inmemory"
import { split } from "apollo-link"
import { HttpLink } from "apollo-link-http"
import { WebSocketLink } from "apollo-link-ws"
import { getMainDefinition } from "apollo-utilities"
import { createUploadLink } from 'apollo-upload-client'


import './App.css'
import AppContainer from './containers/AppContainer'

const user = JSON.parse(localStorage.getItem('user'))
const httpLink = new HttpLink({
  uri: process.env.REACT_APP_URI_BACKEND,
  headers:{
    "token": user? user.token : null
  }
});

const wsLink = new WebSocketLink({
  uri: process.env.REACT_APP_URI_WS_BACKEND,
  options: {
    reconnect: true
  }
});
const uploadLink = createUploadLink({ uri: process.env.REACT_APP_URI_BACKEND,headers:{
    "token": user? user.token : null
  } });

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLink,
  uploadLink
);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
});


function App() {
  return (
    <div className="App">
    	<ApolloProvider client={client}>
    		<AppContainer />
    	</ApolloProvider>
    </div>
  );
}

export default App;
