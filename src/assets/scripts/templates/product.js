import '../../styles/vendor/_swiper.scss';
import '../theme';

import React, { useState, useEffect } from 'react';

function Product(props) {
    const [productImg, setProductImg] = useState();
    const [activeId, setActiveId] = useState(0);
    
    useEffect(() => {        
        setProductImg(props.variants[0].node.image.originalSrc);
    },[props.variants]);

    const changeColor = (color,index) => {
        const found = props.variants.find(element => element.node.title.includes(color));
        setProductImg(found.node.image.originalSrc);
        setActiveId(index)
    }

    return (
        <div className="product-card">
            <img className="product-image" src={productImg} alt=""></img>
            <span className="product-title">{props.title}</span>
            <span className="product-price">
                {props.price.maxVariantPrice.amount !== props.price.minVariantPrice.amount &&
                    <span className="price-sale_org">
                        ${props.price.maxVariantPrice.amount}
                    </span>
                }
                <span className={`${props.price.maxVariantPrice.amount !== props.price.minVariantPrice.amount ? "price-sale_new" : ""}`}>
                    ${props.price.minVariantPrice.amount}
                </span>
            </span>
            {props.options[0] &&
                <div className="product-swatches">
                    {props.options[0].values.map((option, index) => {
                        return <span key={index} className={`color-swatch collection-${option.toLowerCase().replace(/\s/g, '')} ${activeId === index ? 'active' : null}`} onClick={() => changeColor(option,index)}></span>
                    })}
                </div>
            }
        </div>
    );
}

export default Product;