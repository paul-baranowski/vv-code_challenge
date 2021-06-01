import React, { useState } from 'react';
import { useQuery, gql, useLazyQuery } from '@apollo/client';
import Select from 'react-select'
import Product from './product';
import { COREFIELDS } from '../fragments/fragments';

const STORE_COLLECTION_PRICE = gql`
    ${COREFIELDS}
    query CollectionQuery {
        collectionByHandle(handle: "test-collection") {
            image {
              originalSrc
            }
            title
            products(first: 250 sortKey: PRICE) {
                edges {
                    node {
                        ...CoreFields
                    }
                }
            }
        }
    }
`;

const STORE_COLLECTION_CREATED = gql`
    ${COREFIELDS}
    query CollectionQuery {
        collectionByHandle(handle: "test-collection") {
            image {
              originalSrc
            }
            title
            products(first: 250 sortKey: CREATED) {
                edges {
                    node {
                        ...CoreFields
                    }
                }
            }
        }
    }
`;

const STORE_COLLECTION__ALPHA = gql`
    ${COREFIELDS}
    query CollectionQuery {
        collectionByHandle(handle: "test-collection") {
            image {
              originalSrc
            }
            title
            products(first: 250 sortKey: TITLE) {
                edges {
                    node {
                        ...CoreFields
                    }
                }
            }
        }
    }
`;

function App() {

    const [query, setQuery] = useState(STORE_COLLECTION_CREATED);

    const { loading, error, data:shopData, refetch } = useQuery(query, {
        fetchPolicy: "no-cache"
      });

    const onChange = selectedOption => {
        console.log({selectedOption});
        if(selectedOption.value === "datecreated"){
            setQuery(STORE_COLLECTION_CREATED);
        }
        if(selectedOption.value === "alphaup"){
            setQuery(STORE_COLLECTION__ALPHA);
        }
        if(selectedOption.value === "priceup"){
            setQuery(STORE_COLLECTION_PRICE);
        }
        refetch();
    };

    const options = [
        { value: 'datecreated', label: 'Newest Arrival' },
        { value: 'alphaup', label: 'A - Z' },
        { value: 'alphadown', label: 'Z - A' },
        { value: 'priceup', label: 'Price Low to High' },
        { value: 'pricedown', label: 'Price High to Low' }
    ]

    if (loading) return <p>Loading...</p>;
    if (error) return `Error! ${error.message}`;

    return (
        <>
            <div style={{backgroundImage: `url(${shopData.collectionByHandle.image.originalSrc})`}} className="collection-banner">
                <h1 className="collection-title">{shopData.collectionByHandle.title}</h1>
            </div>
            <div className="collection-info">
                <span className="collection-total">{shopData.collectionByHandle.products.edges.length} results</span>
                <Select
                    defaultValue={options[1]}
                    onChange={onChange}
                    label="Single select"
                    options={options}
                    className="dropdown"
                />
            </div>
            <div className="collection-grid">
                {shopData.collectionByHandle.products.edges.map((product,index) => (
                    <Product key={index} price={product.node.availableForSale ? product.node.priceRange : 'Out of stock'} variants={product.node.variants.edges} title={product.node.title} options={product.node.options.filter(e => e.name === 'Color')}></Product>
                ))}
            </div>
        </>
    );
}

export default App;