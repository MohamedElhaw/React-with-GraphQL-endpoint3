import React, {Component} from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {connect} from 'react-redux';
import Loading from './Loading';
import Navbar from './Navbar';
import Product from './Product';
import Cart from './Cart';
import NotFound from './NotFound';
import {loadNavbarAndProduct} from '../actions/combineQueries';
import Category from './Category';
import {storeApolloClient} from '../actions/apolloClient';
import {loadNavbarData} from '../actions/navbar';
import PropTypes from 'prop-types';

class App extends Component {
  state={
    categories: [],
    currencies: [],
  };

  async componentDidMount() {
    const {dispatch, client}=this.props;
    // add apollo client to the store to use it in any component
    dispatch(storeApolloClient(client));
    // load Data as route
    this.loadDataAsRoute();
  }
  // load navbar data (categories and currencies) from server
  getNavbarData=async ()=>{
    const {dispatch, client}=this.props;
    const data=await dispatch(loadNavbarData(client));
    return data;
  };
  // set the navabr data to the app state
  setStateNavbarData =(data)=>{
    const {categories, currencies}=data;
    this.setState({categories, currencies});
  };
  // if user need to route directly to product page load navbar and product data from server one time, else load navbar data
  loadDataAsRoute=async ()=>{
    const {dispatch, client}=this.props;
    // get the URL the user used it when load the app
    const path = window.location.pathname;
    if (path.includes('/product')) {
      // get the product id from the path to load it
      const id=path.slice(9);
      // load the navbar and product depend on the URL the user used
      const data=await dispatch(loadNavbarAndProduct(client, id));
      data&&this.setStateNavbarData(data);
    } else {
      const data=await this.getNavbarData();
      this.setStateNavbarData(data);
    }
  };
  // dynamically add routes as categories received from sever
  routeCategoryBranches=()=>{
    const {categories}=this.state;
    const categoryBranches=categories.map((category)=> category.name).filter((category)=> category!=='all');
    return (
      categoryBranches.map((category, index)=>{
        return (
          <Route key={index} path={`/${category}`} component={(props)=><Category {...props} name={category}/>}/>
        );
      })
    );
  };

  render() {
    const {error}=this.props;
    const {categories, currencies}=this.state;
    if ((categories.length===0||currencies.length===0)&&!error) {
      return <Loading/>;
    } else if (error) {
      return <NotFound/>;
    }
    return (
      <div className="App">
        <BrowserRouter>
          <Navbar categories={categories} currencies={currencies}/>
          <Switch>
            <Route exact path="/" component={(props)=><Category {...props} name={'all'}/>}/>
            {this.routeCategoryBranches()}
            <Route path="/product/:id">
              <Product/>
            </Route>
            <Route path="/cart">
              <Cart/>
            </Route>
            <Route path="/:dynPath">
              <NotFound/>
            </Route>
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default connect(({error})=>({error}))(App);

App.propTypes={
  dispatch: PropTypes.func.isRequired,
  client: PropTypes.object.isRequired,
  error: PropTypes.bool.isRequired,
};
