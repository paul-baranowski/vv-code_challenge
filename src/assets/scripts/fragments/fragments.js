import { gql } from '@apollo/client';

export const COREFIELDS = gql`
    fragment CoreFields on Product {
      
         
                title
                handle
                options {
                    name
                    values
                }
                availableForSale
                priceRange{
                    maxVariantPrice{
                        amount
                    }
                    minVariantPrice{
                        amount
                    }
                }
                variants(first:250){
                    edges{
                        node{
                            title
                            selectedOptions{
                                name
                                value
                            }
                            image{
                                originalSrc
                            }
                            availableForSale
                            priceV2{
                                amount
                            }
                        }
                    }
                }
            
        
    }
`;