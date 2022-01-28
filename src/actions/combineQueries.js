import {loadProductQuery} from './product';
import {gql} from '@apollo/client';
import {resetError, setError} from './error';
import {navbarDataQuery} from './navbar';
import {addProduct} from './product';

/**
 * load navbar and product at one query.
 * @param {object} client client object
 * @param {string} id product id
 * @return {Function} dispatch to dispatch data to the store
 */
export const loadNavbarAndProduct =(client, id)=>{
  return async (dispatch)=>{
    let result;
    try {
      result= await client.query({
        query: gql`
          query{
            ${navbarDataQuery}${loadProductQuery(id)}
          }`,
      });
      dispatch(addProduct(id, result.data.product));
      // reset error
      dispatch(resetError());
      return result.data;
    } catch (error) {
      console.log('Load currencies and product error: ', error);
      // show 404 page
      dispatch(setError());
    }
  };
};
