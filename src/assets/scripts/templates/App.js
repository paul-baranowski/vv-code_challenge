import React, { useState, useEffect } from 'react';
import { gql, useLazyQuery } from '@apollo/client';
import Select from 'react-select'
import Product from './product';
import { COREFIELDS } from '../fragments/fragments';

const STORE_COLLECTION_PRICE = gql`
    ${COREFIELDS}
    query CollectionQuery($queryorder: Boolean) {
        collectionByHandle(handle: "test-collection") {
            image {
              originalSrc
            }
            title
            products(first: 250 sortKey: PRICE reverse: $queryorder) {
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
    query CollectionQuery($queryorder: Boolean) {
        collectionByHandle(handle: "test-collection") {
            image {
              originalSrc
            }
            title
            products(first: 250 sortKey: CREATED reverse: $queryorder) {
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
    query CollectionQuery($queryorder: Boolean) {
        collectionByHandle(handle: "test-collection") {
            image {
              originalSrc
            }
            title
            products(first: 250 sortKey: TITLE reverse: $queryorder) {
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
    const [queryorder, setQueryOrder] = useState(true);
    const [sortValue, setSortValue] = useState(0);

    const [loadStoreData, { loading, data:shopData }] = useLazyQuery(
        query,
        { fetchPolicy: "no-cache", variables: { queryorder } }
    );

    useEffect(() => {        
        loadStoreData();
    },[]);

    useEffect(() => {        
        loadStoreData();
    },[queryorder]);

    useEffect(() => {        
        loadStoreData();
    },[query]);

    const options = [
        { value: 'datecreated', label: 'Newest Arrival' },
        { value: 'alphaup', label: 'A - Z' },
        { value: 'alphadown', label: 'Z - A' },
        { value: 'priceup', label: 'Price Low to High' },
        { value: 'pricedown', label: 'Price High to Low' }
    ]

    const onChange = selectedOption => {
        const indexSelected = options.findIndex(x => x.value === selectedOption.value);
        setSortValue(indexSelected)
        if(selectedOption.value === "datecreated"){
            setQuery(STORE_COLLECTION_CREATED);
            setQueryOrder(false);
        }
        if(selectedOption.value === "alphaup"){
            setQuery(STORE_COLLECTION__ALPHA);
            setQueryOrder(false);
        }
        if(selectedOption.value === "alphadown"){
            setQuery(STORE_COLLECTION__ALPHA);
            setQueryOrder(true);
        }
        if(selectedOption.value === "priceup"){
            setQuery(STORE_COLLECTION_PRICE);
            setQueryOrder(false);
        }
        if(selectedOption.value === "pricedown"){
            setQuery(STORE_COLLECTION_PRICE);
            setQueryOrder(true);
        }
    };

    if (loading) return (
        <div className="collection-banner">
            <h1 className="collection-title">Loading...</h1>
        </div>
    );

    return (
        <>
        {shopData &&
            <>
            <div style={{backgroundImage: `url(${shopData.collectionByHandle.image.originalSrc})`}} className="collection-banner">
                <h1 className="collection-title">{shopData.collectionByHandle.title}</h1>
            </div>
            <div className="collection-info">
                <span className="collection-total">{shopData.collectionByHandle.products.edges.length} results</span>
                <Select
                    defaultValue={options[sortValue]}
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
        }
     </>
    );
}

export default App;