// Declare action type variables
export const CHANGE_CURRENCY='CHANGE_CURRENCY';

/**
 * Action creator.
 * @param {object} currency
 * @return {object} action with type CHANGE_CURRENCY and payload (currency)
 */
export const changeCurrency=(currency)=>{
  return {
    type: CHANGE_CURRENCY,
    currency,
  };
};
