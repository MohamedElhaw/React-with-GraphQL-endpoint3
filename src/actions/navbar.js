import {gql} from '@apollo/client';
import {resetError, setError} from './error';

// query to load navbar data (categories and currencies) from server
export const navbarDataQuery=`
  categories{
    name
  },
  currencies{
      label,
      symbol,
  }`;

/**
 * load navbar data.
 * @param {object} client client object
 * @return {object} navbar data (categories and currencies)
 */
export const loadNavbarData=(client)=>{
  return async (dispatch)=>{
    let result;
    try {
      result= await client.query({
        query: gql`
            query{
              ${navbarDataQuery}
            }`,
      });
      // reset error
      dispatch(resetError());
      return result.data;
    } catch (error) {
      console.log('Load navbar data: ', error);
      // show 404 page
      dispatch(setError());
    }
  };
};
