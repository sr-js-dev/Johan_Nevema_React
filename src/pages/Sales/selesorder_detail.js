import React, {Component} from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import * as salesAction  from '../../actions/salesAction';
import SessionManager from '../../components/session_manage';
import Axios from 'axios';
import API from '../../components/api'
import { trls } from '../../components/translate';
import  Salesupdateform  from './salesupdateform'
import  Addproductform  from './addproduct_form';
import  Updateorderline  from './updateorderLine_fomr';
import  Updatetransport  from './update_transport';
import  Addtransporter  from './addtransporter';
import * as Common from '../../components/common';


const mapStateToProps = state => ({ 
    ...state,
});

const mapDispatchToProps = dispatch => ({
    getSalesOrder: (value) =>
        dispatch(salesAction.getSalesOrder(value)),
    getSalesItem: (value) =>
        dispatch(salesAction.getSalesItem(value)),
});

class Salesorderdtail extends Component {
    constructor(props) {
        super(props);
        this.state ={
            orderdate: '', 
            salesorderid:'',
            salesorder:[],
            salesItems:[],
            exactFlag: false,
            sendingFlag: false,
            salesTransport: [],
            transportData: [],
            transportResult: []
        }
      }
    componentDidMount() {
        this.getSalesOrder();
        this.getSalesItem();
        this.getSalesOrderTransports();
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    getSalesOrder() {
        var params={
            "salesorderid":this.props.newid
        }
        var headers = SessionManager.shared().getAuthorizationHeader();
            Axios.post(API.GetSalesDetail, params, headers)
            .then(result => {
                this.setState({salesorder: result.data.Items[0]});
            });
    }

    getSalesItem () {
        var params={
            "orderid":this.props.newid
        }
        var headers = SessionManager.shared().getAuthorizationHeader();
            Axios.post(API.GetSalesOrderLines, params, headers)
            .then(result => {
                this.setState({salesItems: result.data.Items})
            });
    }

    getSalesOrderTransports() {
        var params={
            "orderid":this.props.newid
        }
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.post(API.GetSalesOrderTransports, params, headers)
        .then(result => {
            this.setState({salesTransport: result.data.Items})
        });
    }

    generateSalesInvoiceXmlExact = () => {
        this.setState({sendingFlag: true})
        var headers = SessionManager.shared().getAuthorizationHeader();
        var params = {
            salesid: this.props.newid
        }
        Axios.post(API.PostSalesOrderExact, params, headers)
        .then(result => {
            Axios.get(API.GenerateProductXmlExact, headers)
            .then(result => {
                Axios.post(API.PostSalesOrderExactSend, params, headers)
                .then(result => {
                    this.setState({exactFlag: true, sendingFlag: false})
                });
            });
        });
    }

    orderLineEdit = (data) => {
        this.setState({upadateDate: data, showModalUpdate: true})
    }

    orderLineDelete = (id) => {
        var headers = SessionManager.shared().getAuthorizationHeader();
        var params = {
            id: id
        }
        Axios.post(API.DeleteSalesOrderLine, params, headers)
        .then(result => {
            this.getSalesItem();
        });
    }

    transporterEdit = (data) => {
        this.setState({transportUpadateDate: data, transportShowModal: true})
    }

    transporterDelete = (id) => {
        var headers = SessionManager.shared().getAuthorizationHeader();
        var params = {
            id: id
        }
        Axios.post(API.DeleteTransports, params, headers)
        .then(result => {
            this.getSalesOrderTransports();
        });
    }

    addTransport = (transportData) => {
        var headers = SessionManager.shared().getAuthorizationHeader();
        let params = {
            productid: transportData.productid,
            loadingdate: this.state.salesorder.loadingdate,
            quantity: transportData.quantity
        }
        Axios.post(API.GetTransports, params, headers)
        .then(result => {
            this.setState({transportData: transportData, transportResult: result.data.Items, addTransporterModal: true})
        });
    }

    onHide = () => {
        this.props.onHide();
        Common.hideSlideForm();
    }

    updownInfo = (id) =>{
        console.log('333', id)
        let salesArray = this.state.salesItems;
        salesArray.map((data, i)=>{
            if(data.id===id){
                if(!data.checked){

                    data.checked = true;
                }else{
                    data.checked = false;
                }
            }
            return data;
        })
        this.setState({salesItems: salesArray});
    }

    render () {
        let detailData = this.props.salesdetaildata;
        console.log('11111', detailData);
        let salesItems = this.state.salesItems;
        let transporter = this.state.salesTransport;
        return (
            <div className="slide-form__controls open slide-product__detail">
                <div style={{marginBottom:30, padding:"0 20px"}}>
                    <i className="fas fa-times slide-close" style={{ fontSize: 20, cursor: 'pointer'}} onClick={()=>this.onHide()}></i>
                </div>
                <div className="content__header content__header--with-line product-detail__data--detail">
                    <h2 className="title">{trls("Order")} #{this.props.newid}</h2>
                </div>
                <div className="place-and-orders__top">
                    <Row className="product-detail__data-div">
                        <Col sm={4}>
                            <div>
                                <Form.Label>
                                    {trls("Customer")}
                                </Form.Label>
                                <p className="product-detail__data">{detailData.Customer}</p>
                            </div>
                            <div style={{paddingTop: 30}}>
                                <Form.Label>
                                    {trls("Reference_customer")}
                                </Form.Label>
                                <p className="product-detail__data">{detailData.referencecustomer}</p>
                            </div>
                            <div>
                                <Button variant="light" style={{marginRight: 10}} onClick={()=>this.setState({modalShow:true, exactFlag: false})}><img src={require('../../assets/images/edit.svg')} alt="edit" style={{marginRight: 10}}></img>{trls('Edit_project_detail')}</Button>
                            </div>
                        </Col>
                        <Col sm={4}>
                            <div>
                                <Form.Label>
                                    {trls("Supplier")}
                                </Form.Label>
                                <p className="product-detail__data">{detailData.Supplier}</p>
                            </div>
                            {detailData.arrivaldate!=="1900-01-01T00:00:00" && (
                                <div style={{paddingTop: 30}}>
                                    <Form.Label>
                                        {trls("Arrival_date")}
                                    </Form.Label>
                                    {detailData.arrivaldate &&(
                                        <p className="product-detail__data">{Common.formatDate(detailData.arrivaldate)}</p>
                                    )}
                                </div>
                            )}
                        </Col>
                        <Col sm={4}>
                            <div>
                                <Form.Label>
                                    {trls("Loading_date")}
                                </Form.Label>
                                {detailData.loadingdate &&(
                                    <p>{detailData.arrivaldate!=="1900-01-01T00:00:00" ? Common.formatDate(detailData.arrivaldate) : Common.formatDate(detailData.loadingdate)}</p>
                                )}
                            </div>
                        </Col>
                    </Row>
                </div>
                <div className="product-detail-table">
                    <div className="product-price-table">
                        <div className="purchase-price__div">
                            <p className="purprice-title"><i className="fas fa-caret-right add-icon" style={{color: "#4697D1"}}></i>{trls("Products")}</p>
                            <Button variant="outline-secondary" style={{marginLeft: "auto"}} onClick={()=>this.setState({showModalProduct: true})}><i className="fas fa-plus add-icon"></i>{trls('Add_product')}</Button>
                        </div>
                        <div className="table-responsive prurprice-table__div">
                            <table id="example" className="place-and-orders__table table" width="100%">
                                <thead>
                                    <tr>
                                        <th>{trls("Product")}</th>
                                        <th>{trls("Sales_Quantity")}</th>
                                        <th>{trls("Sales_Price")}</th>
                                        <th>{trls("Sales_Amount")}</th>
                                        <th>{trls("Purchase_Quantity")}</th>
                                        <th>{trls("Purchase_Price")}</th>
                                        <th>{trls("Purchase_Amount")}</th>
                                        <th style={{width: "109px"}}>{trls("ReportingDate")}</th>
                                        <th style={{width: 250}}>{trls("Action")}</th>
                                    </tr>
                                </thead>
                                {salesItems && (<tbody>
                                    {
                                    salesItems.map((data,i)=>(
                                        <React.Fragment key={i}>
                                            <tr>
                                                <td className={data.checked ? "order-product__td order-product__first-td" : ''}>{data.productcode}</td>
                                                <td className={data.checked ? "order-product__td" : ''}>
                                                    {data.salesquantity}
                                                </td>
                                                <td className={data.checked ? "order-product__td" : ''}>{Common.formatMoney(data.SalesPrice)}</td>
                                                <td className={data.checked ? "order-product__td" : ''}>{Common.formatMoney(data.SalesAmount)}</td>
                                                <td className={data.checked ? "order-product__td" : ''}>{data.purchasequantity}</td>
                                                <td className={data.checked ? "order-product__td" : ''}>{Common.formatMoney(data.purchaseprice)}</td>
                                                <td className={data.checked ? "order-product__td" : ''}>{Common.formatMoney(data.purchaseamount)}</td>
                                                <td className={data.checked ? "order-product__td" : ''}>{Common.formatDate(data.ReportingDate)==="01-01-1970" ? '' : Common.formatDate(data.ReportingDate)}</td>
                                                <td className={data.checked ? "order-product__td order-product__last-td" : ''}>
                                                    <Row style={{justifyContent:"space-around", width: 200}}>
                                                        <Button className="price-action__button" variant="light" onClick={()=>this.orderLineDelete(data.id)}><i className="far fa-trash-alt add-icon" ></i>{trls('Delete')}</Button>
                                                        <Button className="price-action__button" variant="light" onClick={()=>this.orderLineEdit(data)}><i className="fas fa-pen add-icon" ></i>{trls('Edit')}</Button>
                                                        <Button className="price-action__button" variant="light" onClick={()=>this.updownInfo(data.id)}><i className={data.checked ? "fas fa-caret-up" : "fas fa-caret-down"}></i></Button>
                                                    </Row>
                                                </td>
                                            </tr>
                                            {data.checked && (
                                                <tr>
                                                    <td className={data.checked ? "order-product__first-td" : ''}></td>
                                                    <td>
                                                        <div>{trls("Packing_slip_number")}</div>
                                                        <div style={{paddingTop: 20}}>{data.PackingSlip}</div>
                                                    </td>
                                                    <td>
                                                        <div>{trls("Container_number")}</div>
                                                        <div style={{paddingTop: 20}}>{data.Container}</div>
                                                    </td>
                                                    <td>
                                                        <div>{trls("ShippingDocumentnumber")}</div>
                                                        <div style={{paddingTop: 20}}>{data.Shipping}</div>
                                                    </td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td className={data.checked ? "order-product__last-td" : ''}></td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))
                                }
                            </tbody>)}
                        </table>
                    </div>
                </div>
                <div className="product-price-table">
                    <div className="purchase-price__div">
                        <p className="purprice-title"><i className="fas fa-caret-right add-icon" style={{color: "#4697D1"}}></i>{trls("Transporter")}</p>
                    </div>
                    <div className="table-responsive prurprice-table__div">
                        <table id="example" className="place-and-orders__table table" width="100%">
                            <thead>
                                <tr>
                                    <th>{trls("Transporter")}</th>
                                    <th>{trls("Pricingtype")}</th>
                                    <th>{trls("Price")}</th>
                                    <th>{trls("Packing_slip_number")}</th>
                                    <th>{trls("Container_number")}</th>
                                    <th>{trls("ShippingDocumentnumber")}</th>
                                    <th>{trls("Action")}</th>
                                    
                                </tr>
                            </thead>
                            {transporter && (<tbody>
                                {
                                    transporter.map((data,i) =>(
                                    <tr id={data.id} key={i}>
                                        <td>{data.Transporter}</td>
                                        <td>{data.pricingtype}</td>
                                        <td>{Common.formatMoney(data.price)}</td>
                                        <td>{data.packingslip}</td>
                                        <td>{data.container}</td>
                                        <td>{data.shipping}</td>
                                        <td >
                                            <Row style={{justifyContent:"space-around", width: 200}}>
                                                <Button className="price-action__button" variant="light" onClick={()=>this.transporterDelete(data.id)}><i className="far fa-trash-alt add-icon" ></i>{trls('Delete')}</Button>
                                                <Button className="price-action__button" variant="light" onClick={()=>this.transporterEdit(data)}><i className="fas fa-pen add-icon" ></i>{trls('Edit')}</Button>
                                            </Row>
                                        </td>
                                    </tr>
                                ))
                                }
                            </tbody>)}
                        </table>
                    </div>
                </div>
            </div>
                <Salesupdateform
                    show={this.state.modalShow}
                    onHide={() => this.setState({modalShow: false})}
                    salesOrder={this.props.salesdetaildata}
                    arrivaldate={this.props.salesdetaildata.arrivaldate!=="1900-01-01T00:00:00" ? true : false}
                    getSalesOrderData={()=>this.getSalesOrder()}
                />
                {detailData.loadingdate&&(
                    <Addproductform
                        show={this.state.showModalProduct}
                        onHide={() => this.setState({showModalProduct: false})}
                        customercode={this.props.customercode}
                        suppliercode={this.props.suppliercode}
                        loadingdate={detailData.loadingdate}
                        orderid={this.props.newid}
                        getSalesOrderLine={()=>this.getSalesItem()}
                        getTransport={()=>this.getSalesOrderTransports()}
                        showTransportModal={(transportData) => this.addTransport(transportData)}
                    />
                )}
                <Updateorderline
                    show={this.state.showModalUpdate}
                    onHide={() => this.setState({showModalUpdate: false})}
                    updatedata={this.state.upadateDate}
                    getSalesOrderLine={()=>this.getSalesItem()}
                />
                <Updatetransport
                    show={this.state.transportShowModal}
                    onHide={() => this.setState({transportShowModal: false})}
                    updatedata={this.state.transportUpadateDate}
                    getSalesOrderLine={()=>this.getSalesOrderTransports()}
                />
                <Addtransporter
                    show={this.state.addTransporterModal}
                    onHide={() => this.setState({addTransporterModal: false})}
                    loadingdate={this.state.salesorder.loadingdate}
                    transportResult={this.state.transportResult}
                    transportdata={this.state.transportData}
                    orderid={this.props.newid}
                    getSalesOrderLine={()=>this.getSalesOrderTransports()}
                />
        </div>
        )
    };
  }
  export default connect(mapStateToProps, mapDispatchToProps)(Salesorderdtail);