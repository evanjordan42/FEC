import React from 'react';
import { shallow, mount, render } from 'enzyme';
import Overview from '../client/src/components/Overview/Overview.jsx';
import DefaultView from '../client/src/components/Overview/DefaultView.jsx';
import ExpandedView from '../client/src/components/Overview/ExpandedView.jsx';
import DefaultViewThumbnail from '../client/src/components/Overview/DefaultViewThumbnail.jsx';
import ProductInfo from '../client/src/components/Overview/ProductInfo.jsx';
import StyleSelector from '../client/src/components/Overview/StyleSelector.jsx';
import AddToCart from '../client/src/components/Overview/AddToCart.jsx';
import ProductSummary from '../client/src/components/Overview/ProductSummary.jsx';
import data from './dummyData.js';

const initialProps = {
  productObj: data.products[0],
  stylesArr: data.styles,
  ratingsObj: data.reviewMeta.ratings,
  productId: data.products[0].id,
  productInfo: data.products[0]
};

describe('Overview', () => {
  const wrapper = mount(<Overview {...initialProps} />);

  it('should render Overview component', () => {
    expect(wrapper.find('.overview').length).toBe(1);
  });

  it('should render a Default View component', () => {
    expect(wrapper.containsMatchingElement(<DefaultView />)).toEqual(true);
  })

  it('should render a Product Info component', () => {
    expect(wrapper.containsMatchingElement(<ProductInfo />)).toEqual(true);
  })

  it('should render a Style Selector component', () => {
    expect(wrapper.containsMatchingElement(<StyleSelector />)).toEqual(true);
  })

  it('should render an Add To Cart component', () => {
    expect(wrapper.containsMatchingElement(<AddToCart />)).toEqual(true);
  })

  it('should render a Product Summary component', () => {
    expect(wrapper.containsMatchingElement(<ProductSummary />)).toEqual(true);
  })
});

describe('Default View', () => {
  it('should render Default View component', async () => {
    const wrapper = await mount(<DefaultView />);
    expect(wrapper.find('.defaultView').length).toBe(1);
  })

  it('should display an image', async () => {
    const wrapper = await mount(<DefaultView
      photos={data.styles[0].photos}
      imageIndex={0}
      changeView = { () => {} }
      setImageIndex = { () => {} }
      handleImageIndexChange = { () => {} }
    />);
    expect(wrapper.find('#defaultViewImage').length).toBe(1);
  })

  it('should display the first style image as the main image by default', async () => {
    const wrapper = await mount(<DefaultView
      photos={data.styles[0].photos}
      imageIndex={0}
      changeView = { () => {} }
      setImageIndex = { () => {} }
      handleImageIndexChange = { () => {} }
    />);
    expect(wrapper.contains(<img
      rel="preload"
      src="https://images.unsplash.com/photo-1501088430049-71c79fa3283e?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=668&amp;q=80" id="defaultViewImage" alt="Image of selected style"
    />)).toBe(true);
  })

  it('should have a thumbnail container', async () => {
    const wrapper = await mount(<DefaultView
      photos={data.styles[0].photos}
      imageIndex={0}
      changeView = { () => {} }
      setImageIndex = { () => {} }
      handleImageIndexChange = { () => {} }
    />);
    expect(wrapper.find('#defaultViewThumbnails').length).toBe(1)
  })

});

describe('Product Information', () => {
  it('should render ProductInfo component with data', async () => {
    const wrapper = await mount(<ProductInfo
      product={data.products[0]}
      currentStyle={data.styles[0]}
      ratings={data.reviewMeta.ratings}
    />);
    expect(wrapper.find('.productInfo').length).toBe(1);
  })

  it('should display the average rating and # of ratings', async () => {
    const wrapper = await mount(<ProductInfo
      product={data.products[0]}
      currentStyle={data.styles[0]}
      ratings={data.reviewMeta.ratings}
    />);
    expect(wrapper.find('#productInfoRating').length).toBe(1);
  })

  it('should display the product category', async () => {
    const wrapper = await mount(<ProductInfo
      product={data.products[0]}
      currentStyle={data.styles[0]}
      ratings={data.reviewMeta.ratings}
    />);
    expect(wrapper.find('#productInfoCategory').length).toBe(1);
  })

  it('should display the product name', async () => {
    const wrapper = await mount(<ProductInfo
      product={data.products[0]}
      currentStyle={data.styles[0]}
      ratings={data.reviewMeta.ratings}
    />);
    expect(wrapper.find('#productInfoName').length).toBe(1);
  })

  it('should display the product price', async () => {
    const wrapper = await mount(<ProductInfo
      product={data.products[0]}
      currentStyle={data.styles[0]}
      ratings={data.reviewMeta.ratings}
    />);
    expect(wrapper.find('#productInfoPrice').length).toBe(1);
  })
})

describe('Style Selector', () => {
  it('should render Style Selector component', async () => {
    const wrapper = await mount(<StyleSelector
      styles={data.styles}
      currentStyle={data.styles[0]}
      handleStyleChange={() => {}}
    />);
    expect(wrapper.find('.styleSelector').length).toBe(1);
  })

  it('should display the current style', async () => {
    const wrapper = await mount(<StyleSelector
      styles={data.styles}
      currentStyle={data.styles[0]}
      handleStyleChange={() => {}}
    />);
    expect(wrapper.contains(<div id="styleSelectorName">
      <span id="styleLabel">STYLE &gt; </span>
      <span id="styleName">Forest Green &amp; Black</span>
    </div>)).toBe(true);
  })

  it('should render thumbnails of styles dynamically', async () => {
    const wrapper = await mount(<StyleSelector
      styles={data.styles}
      currentStyle={data.styles[0]}
      handleStyleChange={() => {}}
    />);
    expect(wrapper.find('.styleThumbnail').length).toBe(2)
  })
})

describe('Add to Cart', () => {
  it('should render Add To Cart component', async () => {
    const wrapper = await mount(<AddToCart skus={data.styles[0].skus} />);
    expect(wrapper.find('.addToCart').length).toBe(1);
  })

  it('should include a Select Size select element', async () => {
    const wrapper = await mount(<AddToCart skus={data.styles[0].skus} />);
    expect(wrapper.find('#sizeSelect').length).toBe(1);
  })

  it('should include a Quantity select element', async () => {
    const wrapper = await mount(<AddToCart skus={data.styles[0].skus} />);
    expect(wrapper.find('#quantitySelect').length).toBe(1);
  })

  it('should include a Add to Cart button element', async () => {
    const wrapper = await mount(<AddToCart skus={data.styles[0].skus} />);
    expect(wrapper.find('#addToCartButton').length).toBe(1);
  })
});

describe('Product Summary', () => {
  it('should render Product Summary component', () => {
    const wrapper = shallow(<ProductSummary product={data.products[0]} />);
    expect(wrapper.find('.productSummary').length).toBe(1);
  })

  it('should render slogan and description', () => {
    const wrapper = shallow(<ProductSummary product={data.products[0]} />);
    expect(wrapper.contains(<h3 id="productOverviewSlogan">You&apos;ve got to wear shades</h3>)).toBe(true);
    expect(wrapper.contains(<p id="productOverviewDescription">Where you&apos;re going you might not need roads, but you definitely need some shades. Give those baby blues a rest and let the future shine bright on these timeless lenses.</p>)).toBe(true);
  })

  it('should display logos of Twitter, Facebook and Pinterest', () => {
    const wrapper = shallow(<ProductSummary product={data.products[0]} />);
    expect(wrapper.find('.shareIcon').length).toBe(3);
  })
})
