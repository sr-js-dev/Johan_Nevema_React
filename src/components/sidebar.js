import React, {Component} from 'react'
import { trls } from './translate';
import  { Link } from 'react-router-dom';
import { connect } from 'react-redux';
const mapStateToProps = state => ({ 
    ...state.auth,
});
const mapDispatchToProps = (dispatch) => ({

});
class Sidebar extends Component {
    constructor(props){
        super(props);
        this.state = {
        }
    }
    changeItem = () => {
        this.setState({flag:1})
    }
    render () {
      return (
        <div>
            <aside className="sidebar">
                <a href="/" className="sidebar__logo"><img src={require('../assets/images/appmakerz.svg')} alt="appzmakerz"></img></a>
                <nav className="menu">
                    <ul className="menu__list">
                        <li id="0" className="menu__item" onClick={this.changeItem}>
                            <Link to="./dashboard" className={window.location.pathname === "/dashboard" ? 'menu__link menu__link--active' : 'menu__link menu__link'}>
                                <span className="menu__link-img-wrap">
                                    <img src={require("../assets/images/icon-dashboard.svg")} alt="Dashboard"/>
                                </span>
                                <span>{trls("Dashboard")}</span>
                            </Link>
                        </li>
                        <li className="menu__separator"></li>
                        <li id="0" className="menu__item" onClick={this.changeItem}>
                            <Link to={'/user'} className={window.location.pathname === "/user" || window.location.pathname === "/user-detail" ? 'menu__link menu__link--active' : 'menu__link menu__link'}>
                                <span className="menu__link-img-wrap">
                                    <img src={require("../assets/images/icon-orders.svg")} alt="Orders"/>
                                </span>
                                <span>{trls("User")}</span>
                            </Link>
                        </li>
                        <li id="1" className="menu__item" onClick={this.changeItem}>
                            <Link to={'/product'} className={window.location.pathname === "/product" || window.location.pathname === "/product-detail" ? 'menu__link menu__link--active' : 'menu__link menu__link'}>
                                <span className="menu__link-img-wrap">
                                    <img src={require("../assets/images/icon-orders.svg")} alt="Orders"/>
                                </span>
                                <span>{trls("Products")}</span>
                            </Link>
                        </li>
                        <li id="2" className="menu__item" onClick={this.changeItem}>
                            <Link to={'/sales-order'} className={window.location.pathname === "/sales-order" || window.location.pathname === "/sales-order-detail" ? 'menu__link menu__link--active' : 'menu__link menu__link'} >
                                <span className="menu__link-img-wrap">
                                    <img src={require("../assets/images/icon-orders.svg")} alt="Orders"/>
                                </span>
                                <span>{trls("Sales_Order")}</span>
                            </Link>
                        </li>
                        <li id="3" className="menu__item" onClick={this.changeItem}>
                            <Link to={'/purchase-order'} className={window.location.pathname === "/purchase-order" || window.location.pathname === "/purchase-order-detail" ? 'menu__link menu__link--active' : 'menu__link menu__link'} >
                                <span className="menu__link-img-wrap">
                                    <img src={require("../assets/images/icon-orders.svg")} alt="Orders"/>
                                </span>
                                <span>{trls("Purchase_Order")}</span>
                            </Link>
                        </li>
                        <li id="4" className="menu__item" onClick={this.changeItem}>
                            <Link to={'/task-overview'} className={window.location.pathname === "/task-overview" ? 'menu__link menu__link--active' : 'menu__link menu__link'} >
                                <span className="menu__link-img-wrap">
                                    <img src={require("../assets/images/icon-orders.svg")} alt="Orders"/>
                                </span>
                                <span>{trls("Task")}</span>
                            </Link>
                        </li>
                        <li id="4" className="menu__item" onClick={this.changeItem}>
                            <Link to={'/quality-overview'} className={window.location.pathname === "/quality-overview" ? 'menu__link menu__link--active' : 'menu__link menu__link'} >
                                <span className="menu__link-img-wrap">
                                    <img src={require("../assets/images/icon-orders.svg")} alt="Orders"/>
                                </span>
                                <span>{trls("Invoicing")}</span>
                            </Link>
                        </li>
                        <li id="4" className="menu__item" onClick={this.changeItem}>
                            <Link to={'/demurrage'} className={window.location.pathname === "/demurrage" ? 'menu__link menu__link--active' : 'menu__link menu__link'} >
                                <span className="menu__link-img-wrap">
                                    <img src={require("../assets/images/icon-orders.svg")} alt="Orders"/>
                                </span>
                                <span>{trls("Demurrage")}</span>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </aside>
        </div>
      )
    };
  }
  export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
