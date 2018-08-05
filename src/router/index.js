import { BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom';
import React from 'react';
import asyncComponent from "../utils/asyncComponent";
import requireAuthentication from '../utils/requireAuthentication';
import setWechat from '../utils/setWechat';
// import Home from '../views/Home';
import Help from "../views/help/Help";
import HelpDetail from '../views/help/HelpDetail';

const Home = asyncComponent(() => import("../views/home/Home"));
const Cart = asyncComponent(() => import("../views/cart/Cart"));
const Order = asyncComponent(() => import("../views/order/Order"));
const User = asyncComponent(() => import("../views/user/User"));
const Category = asyncComponent(() => import("../views/category/Category"));
const OrderDetail = asyncComponent(() => import('../views/orderDetail/OrderDetail'));
const Register = asyncComponent(() => import("../views/register/Register"));
const AddAddress = asyncComponent(() => import("../views/addAddress/AddAddress"));
const AddrManage = asyncComponent(() => import('../views/addrManage/AddrManage'));
const Recharge = asyncComponent(() => import('../views/recharge/Recharge'));
const ModifyPass = asyncComponent(() => import('../views/modifyPass/ModifyPass'));
const Checkout = asyncComponent(() => import('../views/checkout/Checkout'));
const SelectAddr = asyncComponent(() => import('../views/selectAddr/SelectAddr'));
const CancelBind = asyncComponent(() => import('../views/cancelBind/CancelBind'));

class RouterIndex extends React.Component{
    render(){
        return(
            <Router>
                <Switch>
                    <Route path="/home" exact component={setWechat(Home)}></Route>
                    <Route path="/register" component={Register}></Route>
                    <Route path="/cart" component={Cart}></Route>
                    <Route path="/checkout/:total" exact component={requireAuthentication(Checkout,'p')}></Route>
                    <Route path="/order" exact component={requireAuthentication(Order)}></Route>
                    <Route path="/user" exact component={requireAuthentication(User)}></Route>
                    <Route path="/order/detail/:orderId" exact component={requireAuthentication(OrderDetail,'p')}></Route>
                    <Route path="/home/:categoryId" exact component={requireAuthentication(Category)}></Route>
                    {/* <Route path="/home/:categoryId" exact component={Category}></Route> */}
                    <Route path="/user/addrManage/add/:type" exact component={requireAuthentication(AddAddress,'p')}></Route>
                    <Route path="/user/addrManage" exact component={requireAuthentication(AddrManage)}></Route>
                    <Route path="/user/recharge" exact component={requireAuthentication(Recharge)}></Route>
                    <Route path="/user/modifyPass" exact component={requireAuthentication(ModifyPass)}></Route>
                    <Route path="/user/cancelBind" component={requireAuthentication(CancelBind)}></Route>
                    <Route path="/selectAddr" component={requireAuthentication(SelectAddr)}></Route>
                    <Route path="/help" exact component={Help}></Route>
                    <Route path="/help/helpDetail/:helpId" exact component={HelpDetail}></Route>
                    <Redirect from="/*" to="/home" />
                </Switch>
            </Router>
        );
    }
}

export default RouterIndex;