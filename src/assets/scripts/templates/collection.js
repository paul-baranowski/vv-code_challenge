import '../theme';
import '../../styles/templates/collection.scss';

// Your Code Here
import ReactDOM from "react-dom";
import React from "react";
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import App from './App';

const httpLink = createHttpLink({ uri: 'https://paul-baranowski-code-challenge.myshopify.com/api/2021-04/graphql.json' })

const middlewareLink = setContext(() => ({
    headers: {
        'X-Shopify-Storefront-Access-Token': '203c2bbb1bfbb64ae8702ccf8810b54a'
    }
}))

const client = new ApolloClient({
    link: middlewareLink.concat(httpLink),
    cache: new InMemoryCache(),
})

ReactDOM.render((
  <ApolloProvider client={client}>
      <App />
  </ApolloProvider>
  ),
  document.getElementById('react-collection')
  );