import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, mount } from 'enzyme';
import axiosHelper from '../client/helperFunctions/serverRequest.js';
import axios from 'axios';
import dummyData from './dummyData.js';
import { act } from 'react-dom/test-utils';
import mockResponse from './__mocks__/RelatedAndOutfitsRequest.js';

import RelatedAndOutfits from '../client/src/components/RelatedOutfit/RelatedAndOutfits.jsx';
import RelatedItemsList from '../client/src/components/RelatedOutfit/RelatedItemsList.jsx';
import RelatedItemCard from '../client/src/components/RelatedOutfit/RelatedItemCard.jsx';
import OutfitList from '../client/src/components/RelatedOutfit/OutfitList.jsx';
import OutfitListCard from '../client/src/components/RelatedOutfit/OutfitListCard.jsx';
import StarRating from '../client/src/components/RelatedOutfit/StarRating.jsx';
import RelatedActionButton from '../client/src/components/RelatedOutfit/RelatedActionButton.jsx';
import OutfitActionButton from '../client/src/components/RelatedOutfit/OutfitActionButton.jsx';
import ComparisonTable from '../client/src/components/RelatedOutfit/ComparisonTable.jsx';


const port = 1337;

describe('Rendering Components', () => {

  it('should render without throwing an error', () => {
    shallow(<RelatedAndOutfits />);
    shallow(<RelatedItemsList relatedItemsList={[]} />);
    shallow(<OutfitList outfitList={[]} />);
    shallow(<RelatedItemCard cardData={dummyData.products[0]} />);
    shallow(<OutfitListCard cardData={dummyData.products[0]} />)
    shallow(<StarRating rating={0} />);
    shallow(<RelatedActionButton />);
  });

});

describe('Rendering RelatedAndOutfits Component', () => {

  it('should render RelatedAndOutfits when server request is complete', async () => {
    axios.get = jest.fn().mockResolvedValue(mockResponse);

    let wrapper;
    await act(async () => wrapper = await mount(<RelatedAndOutfits productID={13024} />));
    wrapper.update();
    expect(wrapper.containsMatchingElement(<RelatedItemCard />)).toEqual(true);

  });
});

describe('Rendering RelatedItems List Components', () => {

  it('should render relatedItems list with dummy data passed', () => {
    const wrapper = shallow(<RelatedAndOutfits />);;
    expect(wrapper.find('.relatedItemsAndOutfits')).toHaveLength(1);
  });

  it('should render relatedItems list with dummy data passed', async () => {
    const wrapper = await mount(<RelatedItemsList relatedItemsList={dummyData.products} />);
    expect(wrapper.find('RelatedItemCard')).toHaveLength(6);
  });
});

describe('Rendering RelatedItems Card Components', () => {
  it('should render relatedItemsCard div', async () => {
    const wrapper = await mount(<RelatedItemCard cardData={dummyData.products[0]} />);
    expect(wrapper.containsAllMatchingElements([
      <div className="photoBorder">
        <img className="itemCardImg related" src="https://www.brdtex.com/wp-content/uploads/2019/09/no-image.png" alt="No Image" />
      </div>,
      <h2 className="cardCategory">Accessories</h2>,
      <h3 className="cardItemName">Bright Future Sunglasses</h3>,
      <h4 className="cardItemPrice">$69.00</h4>
    ])).toBe(true);
  });

  it('should render the sales price if it exists in relatedItemsCard', async () => {
    //component isn't on sale
    const wrapper = await mount(<RelatedItemCard cardData={dummyData.products[0]} />);
    expect(wrapper.contains(<h4 className="cardItemPrice">$69.00</h4>)).toBe(true);

    //component is on sale
    const wrapper2 = await mount(<RelatedItemCard cardData={dummyData.products[1]} />);
    expect(wrapper2.contains(<h4 className="cardItemSalePrice">$30.00</h4>)).toBe(true);
  });

  it('should render the image if it exists in the relatedItemsCard', async () => {
    //component contains no images
    const wrapper = await mount(<RelatedItemCard cardData={dummyData.products[0]} />);
    expect(wrapper.contains(<img className='itemCardImg related' src="https://www.brdtex.com/wp-content/uploads/2019/09/no-image.png" alt="No Image"></img>)).toBe(true);

    //component containes images
    const wrapper2 = await mount(<RelatedItemCard cardData={dummyData.products[1]} />);
    expect(wrapper2.contains(<img className='itemCardImg related' src="https://images.unsplash.com/photo-1552902865-b72c031ac5ea?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=300&q=80" alt="No Image" ></img>)).toBe(true);

  });

});

describe('Rendering StarRating Component', () => {

  it('should render correct ratings for the specific item', () => {
    //renders no rating if rating isn't provided
    const wrapper = shallow(<StarRating cardData={dummyData.products[1]} />);
    expect(wrapper.contains(<div style={{ width: '0%' }} className="star-top" ></div>));

    //renders rating if rating is provided
    const wrapper2 = shallow(<StarRating cardData={dummyData.products[0]} />);
    expect(wrapper2.contains(<div style={{ width: '72%' }} className="star-top" ></div>));
  });

})

describe('Rendering RelatedActionButton Component', () => {

  it('should render update state click event', () => {
    var testState = true;
    var clickListener = () => {
      testState = !testState;
    }

    const wrapper = shallow(<RelatedActionButton actionButtonListener={clickListener} />)
    expect(wrapper.find('span')).toHaveLength(1);

    //simulate button click
    wrapper.find('span').simulate('click');
    expect(testState).toEqual(false);
  });

  it('should render comparison table when action button is click', async () => {
    var state = { productId: 13023, productInfo: {}, listUpdate: false, darkMode: false };

    const actionButtonListener = (event, comparedItem) => {

      if (!actionButtonToggle) {
        event.stopPropagation();
      }
      setComparisonData(comparedItem);
      setActionButtonToggle(!actionButtonToggle);
    }

    const productSelect = (id) => {
      state = ({ productInfo: dummyData.products[1], productId: id, listUpdate: !state.listUpdate });
    }

    const wrapper = await mount(<RelatedItemsList productSelect={productSelect} productInfo={dummyData.products[0]} relatedItemsList={dummyData.products} />);
    wrapper.find('.action-button').at(0).find('span').simulate('click');
    expect(wrapper.find('.outerModal')).toHaveLength(1);
    expect(wrapper.find('.innerModal')).toHaveLength(1);
  })

});



describe('Rendering OutfitList List Component', () => {

  it('should render outfitList list with dummy data passed', async () => {
    const wrapper = await mount(<OutfitList />);
    expect(wrapper.find('.itemsList')).toHaveLength(1);
  });
});

describe('Rendering OutfitList List Card Component', () => {

  it('should render outfitListCard div', async () => {
    const wrapper = await mount(<OutfitListCard cardData={dummyData.products[0]} />);
    expect(wrapper.containsAllMatchingElements([
      <img className="itemCardImg" src='https://www.brdtex.com/wp-content/uploads/2019/09/no-image.png' alt="No Image"/>,
      <h2 className="cardCategory">Accessories</h2>,
      <h3 className="cardItemName">Bright Future Sunglasses</h3>,
      <h4 className="cardItemPrice">$69.00</h4>
    ])).toBe(true);
  });

  it('should render the sales price if it exists in relatedItemsCard', async () => {
    //component isn't on sale
    const wrapper = await mount(<OutfitListCard cardData={dummyData.products[0]} />);
    expect(wrapper.contains(<h4 className="cardItemPrice">$69.00</h4>)).toBe(true);

    //component is on sale
    const wrapper2 = await mount(<OutfitListCard cardData={dummyData.products[1]} />);
    expect(wrapper2.contains(<h4 className="cardItemSalePrice">$30.00</h4>)).toBe(true);
  });

  it('should render the image if it exists in the relatedItemsCard', async () => {
    //component contains no images
    const wrapper = await mount(<OutfitListCard cardData={dummyData.products[0]} />);
    expect(wrapper.contains(<img className='itemCardImg' src="https://www.brdtex.com/wp-content/uploads/2019/09/no-image.png" alt="No Image"></img>)).toBe(true);

    //component containes images
    const wrapper2 = await mount(<OutfitListCard cardData={dummyData.products[1]} />);
    expect(wrapper2.contains(<img className='itemCardImg' src="https://images.unsplash.com/photo-1552902865-b72c031ac5ea?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=300&q=80" alt="No Image"></img>)).toBe(true);

  });

});

describe('Rendering Outfit List Behavior', () => {

  it('should render outfit card component when it is added to outfit list', async () => {
    const wrapper = await mount(<OutfitList productInfo={dummyData.products[0]} />);
    wrapper.find('.outfitAddItemCardBackground').simulate('click');
    expect(wrapper.find('OutfitListCard')).toHaveLength(1);
  });

  it('should not render the same outfit card', async () => {
    const wrapper = await mount(<OutfitList productInfo={dummyData.products[0]} />);
    wrapper.find('.outfitAddItemCardBackground').simulate('click');
    wrapper.find('.outfitAddItemCardBackground').simulate('click');
    expect(wrapper.find('OutfitListCard')).toHaveLength(1);
  });

});

describe('rendering action button', () => {

  it('should render the action button', async () => {
    const wrapper = await mount(<OutfitActionButton />);
    expect(wrapper.find('.action-button')).toHaveLength(1);
  });

  it('should excecute event listener function that is passed it', async () => {

    var tempState = false;
    var changeState = () => {
      tempState = !tempState;
    }

    const wrapper = await mount(<OutfitActionButton removeOutfitItem={changeState} />);
    wrapper.find('.action-button').simulate('click');
    expect(tempState).toBe(true);
  });

  it('should remove card when action button is click', async () => {
    const wrapper = await mount(<OutfitList productInfo={dummyData.products[0]} />);
    wrapper.find('.outfitAddItemCardBackground').simulate('click');
    expect(wrapper.find('.itemCard')).toHaveLength(1);
    wrapper.find('.action-button').simulate('click');
    expect(wrapper.find('.itemCard')).toHaveLength(0);
  });

});

describe('render comparison table', () => {
  it('should render the comparison modal when a list is passed in', () => {
    const wrapper = shallow(<ComparisonTable comparisionList={dummyData.comparisonTable} currentProductName={'Morning Joggers'} relatedProductName={'Bright Future Sunglasses'} />)
    expect(wrapper.find('table')).toHaveLength(1);
    expect(wrapper.find('tr')).toHaveLength(5);
    expect(wrapper.find('td')).toHaveLength(12);
  });
});

describe('render related carousel list thumbnail images', () => {

  it('should render the thumbnail carousel images', async () => {
    const wrapper = await mount(<RelatedItemCard cardData={dummyData.products[0]} />);
    wrapper.find('.photoBorder').simulate('mouseenter');
    expect(wrapper.find('.relatedCarouselImage')).toHaveLength(1);
    wrapper.find('.photoBorder').simulate('mouseleave');
    expect(wrapper.find('.relatedCarouselImage')).toHaveLength(0);
  });

  it('should change the display image to the carousel image that is clicked', async () => {
    const wrapper = await mount(<RelatedItemCard cardData={dummyData.products[1]} />);
    wrapper.find('.photoBorder').simulate('mouseenter');
    wrapper.find('.relatedImageCarousel').at(1).simulate('click');
    expect(wrapper.contains(<img className='itemCardImg related' src="test" alt="No Image"></img>)).toBe(true);
  });

})

describe('render outfit carousel list thumbnail images', () => {

  it('should render the thumbnail carousel images', async () => {
    const wrapper = await mount(<OutfitListCard cardData={dummyData.products[0]} />);
    wrapper.find('.photoBorder').simulate('mouseenter');
    expect(wrapper.find('.relatedCarouselImage')).toHaveLength(1);
    wrapper.find('.photoBorder').simulate('mouseleave');
    expect(wrapper.find('.relatedCarouselImage')).toHaveLength(0);
  });

  it('should change the display image to the carousel image that is clicked', async () => {
    const wrapper = await mount(<OutfitListCard cardData={dummyData.products[1]} />);
    wrapper.find('.photoBorder').simulate('mouseenter');
    wrapper.find('.relatedImageCarousel').at(1).simulate('click');
    expect(wrapper.contains(<img className='itemCardImg' src="test" alt="No Image"></img>)).toBe(true);
  });

})



























// describe('Server Request', () => {
//   it('should make successful request to server', async () => {
//     await axios.get(`http://localhost:${port}/RelatedItems`, {
//       params: {itemId: 13023}
//     })
//       .then((result) => {
//         expect(result.status).toBe(200);
//       });
//   });
// });


  // it ('should render all Related Components', async () => {

  //   const wrapper = mount(<RelatedAndOutfits  productID ={13023}/>);
  //   await act(async () => {
  //     await Promise.resolve(wrapper)
  //     // await new Promise(resolve => setImmediate(resolve));
  //     // wrapper.update()
  //     .then(() => {
  //       console.log(wrapper.find('div').length);
  //     })

  //   });
  //   // expect(wrapper.contains('.relatedItem')).toHaveLength(5);

  //   //expect(wrapper.contains(<div className='relatedItemsList'><div></div></div>)).toBe(true);
  // });