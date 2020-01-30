import React, {Component} from 'react'
import { trls } from '../../components/translate';
import { Button, Spinner } from 'react-bootstrap';
import { Form, Row, Col} from 'react-bootstrap';
import { Container} from 'react-bootstrap';
import { connect } from 'react-redux';
import SessionManager from '../../components/session_manage';
import API from '../../components/api'
import Axios from 'axios';
import Productform from './product_priceform'
import Updateproductform from './update_product'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import * as Common from '../../components/common'
import FlashMassage from 'react-flash-message'

const mapStateToProps = state => ({ ...state.auth });

const mapDispatchToProps = dispatch => ({

});
class Productdtail extends Component {
    constructor(props) {
        super(props);
        this.state ={
            purpriceDatalist: [],
            salespriceDatalist: [],
            transportpriceDatalist: [],
            productDetail: [],
            modalShow: false,
            price_flag:"",
            exactFlag: false,
            sendingFlag: false
        }
      }
    componentWillUnmount() {
        this._isMounted = false
    }
    componentDidMount() {
        this._isMounted = true;
        this.getProductDetails();
        this.getPurchasePriceData();
        this.getSalespriceData();
        this.getTransportPriceData();
    }
    
    getProductDetails() {
        let params = {
            id: this.props.location.state.id
        }
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.post(API.GetProduct, params, headers)
        .then(result => {
            if(this._isMounted){    
                this.setState({productDetail: result.data.Items})
            }
        });
    }

    getPurchasePriceData = () => {
        let params = {
            productid: this.props.location.state.id
        }
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.post(API.GetPurchasePrices, params, headers)
        .then(result => {
            if(this._isMounted){    
                this.setState({purpriceDatalist: result.data.Items})
            }
        });
    }

    getSalespriceData = () => {
        let params = {
            productid: this.props.location.state.id
        }
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.post(API.GetSalesPrices, params, headers)
        .then(result => {
            if(this._isMounted){    
                this.setState({salespriceDatalist: result.data.Items})
            }
        });
    }

    getTransportPriceData = () =>{
        let params = {
            productid: this.props.location.state.id
        }
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.post(API.GetTransportPrices, params, headers)
        .then(result => {
            if(this._isMounted){    
                this.setState({transportpriceDatalist: result.data.Items})
            }
        });
    }

    formatDate = (startdate) =>{
        var dd = new Date(startdate).getDate();
        var mm = new Date(startdate).getMonth()+1; 
        var yyyy = new Date(startdate).getFullYear();
        var formatDate = '';
        if(dd<10) 
        {
            dd='0'+dd;
        } 

        if(mm<10) 
        {
            mm='0'+mm;
        } 
        formatDate = dd+'-'+mm+'-'+yyyy;
        return formatDate;
    }
    formatNumber = (num) => {
        return  "€" + num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    }

    priceApproveConfirm = (event) => {
        let priceid = event.currentTarget.id;
        let priceType = event.currentTarget.name
        confirmAlert({
            title: 'Confirm',
            message: 'Are you sure to approve this price?',
            buttons: [
              {
                label: 'OK',
                onClick: () => {
                   this.priceApprove(priceid, priceType)
                }
              },
              {
                label: 'Cancel',
                onClick: () => {}
              }
            ]
          });
    }

    priceApprove = (priceid, priceType) => {
        this._isMounted=true;
        let url = '';
        let params = {
            priceid:priceid
        }
        if(priceType==="purchase"){
            url = API.ApprovePurchasePrice;
        }else if(priceType==="sales"){
            url = API.ApproveSalesPrice;
        }else{
            url = API.ApproveTransportPrice;
        }
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.post(url, params, headers)
        .then(result => {
            if(this._isMounted){    
                this.getPurchasePriceData();
                this.getSalespriceData();
                this.getTransportPriceData();
            }
        });
    }

    generateProductXml = () => {
        this.setState({sendingFlag: true})
        var headers = SessionManager.shared().getAuthorizationHeader();
        var params = {
            productid: this.props.location.state.id
        }
        Axios.post(API.PostProductsExact, params, headers)
        .then(result => {
            Axios.get(API.GenerateProductXmlExact, headers)
            .then(result => {
                Axios.post(API.PostProductsExactSend, params, headers)
                .then(result => {
                    this.setState({exactFlag: true, sendingFlag: false})
                });
            });
        });
        
    }

    render () {
        let detailData = [];
        let purpriceData = [];
        let salespriceData = [];
        let transportData = [];
        if(this.state.productDetail[0]){
            detailData = this.state.productDetail[0];
        }
        if(this.state.purpriceDatalist){
            purpriceData = this.state.purpriceDatalist
        }
        if(this.state.salespriceDatalist){
            salespriceData = this.state.salespriceDatalist;
        }
        if(this.state.transportpriceDatalist){
            transportData=this.state.transportpriceDatalist;
        }
        const pricingtypelist = {'1' :'Blokvracht','2' :'Eenheidsprijs'}

      return (
        <div>
            <div className="content__header content__header--with-line">
                <h2 className="title">{trls("Product_Details")}</h2>
            </div>
            <div className="place-and-orders">
                {this.state.exactFlag&&(
                    <div>
                        <FlashMassage duration={2000}>
                            <div className="alert alert-success" style={{marginTop:10}}>
                                <strong><i className="fas fa-check-circle"></i> Success!</strong>
                            </div>
                        </FlashMassage>
                    </div>
                )
                }
                {this.state.sendingFlag&&(
                    <div style={{marginTop:10}}><Spinner animation="border" variant="info"/><span style={{marginTp:10, fontWeight: "bold", fontSize: 16}}> {trls('Sending')}...</span></div>
                )}
                <Button variant="primary" onClick={()=>this.generateProductXml()} style={{marginTop:10}}>{trls("Send_to_Exact")}</Button>
                
                <div className="place-and-orders__top">
                    <Container className="product-details">
                        <Row>
                            <Col sm={6}>
                                <Form className="container product-form">
                                    <Form.Group as={Row} controlId="formPlaintextSupplier">
                                        <Form.Label column sm="3">
                                            {trls("Productcode")}
                                        </Form.Label>
                                        <Col sm="9" className="product-text">
                                            {detailData &&(
                                                <input type="text" readOnly defaultValue={detailData.productcode} className="input input-detail"/>
                                            )}
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} controlId="formPlaintextSupplier">
                                        <Form.Label column sm="3">
                                            {trls("Supplier")}
                                        </Form.Label>
                                        <Col sm="9" className="product-text">
                                            {detailData &&(
                                                <input type="text" readOnly defaultValue={detailData.Supplier} className="input input-detail"/>
                                            )}
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} controlId="formPlaintextSupplier">
                                        <Form.Label column sm="3">
                                            {trls("Product")}
                                        </Form.Label>
                                        <Col sm="9" className="product-text">
                                            {detailData &&(
                                                <input type="text" readOnly defaultValue={detailData.product} className="input input-detail"/>
                                            )}
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} controlId="formPlaintextSupplier">
                                        <Form.Label column sm="3">
                                            {trls("Customer")}
                                        </Form.Label>
                                        <Col sm="9" className="product-text">
                                            {detailData &&(
                                                <input type="text" readOnly defaultValue={detailData.Customer} className="input input-detail"/>
                                            )}
                                        </Col>
                                    </Form.Group>
                                    
                                    {/* <Form.Group as={Row} controlId="formPlaintextSupplier">
                                        <Form.Label column sm="3">
                                            {trls("Producttype")}
                                        </Form.Label>
                                        <Col sm="9" className="product-text">
                                            {detailData &&(
                                                <input type="text" readOnly defaultValue={detailData.Producttype} className="input input-detail"/>
                                            )}
                                        </Col>
                                    </Form.Group> */}
                                    
                                    
                                    {/* <Form.Group as={Row} controlId="formPlaintextSupplier">
                                        <Form.Label column sm="3">
                                            {trls("Addition")}
                                        </Form.Label>
                                        <Col sm="9" className="product-text">
                                            {detailData &&(
                                                <input type="text" readOnly defaultValue={detailData.addition} className="input input-detail"/>
                                            )}
                                        </Col>
                                    </Form.Group> */}
                                    {/* <Form.Group as={Row} controlId="formPlaintextSupplier">
                                        <Form.Label column sm="3">
                                            {trls("Approver")}
                                        </Form.Label>
                                        <Col sm="9" className="product-text">
                                            {detailData &&(
                                                <input type="text" readOnly defaultValue={detailData.Approver} className="input input-detail"/>
                                            )}
                                        </Col>
                                    </Form.Group> */}
                                </Form>
                            </Col>
                            <Col sm={6}>
                                <Form className="container product-form">
                                    <Form.Group as={Row} controlId="formPlaintextSupplier">
                                        <Form.Label column sm="3">
                                            {trls("Productgroup")}
                                        </Form.Label>
                                        <Col sm="9" className="product-text">
                                            {detailData &&(
                                                <input type="text" readOnly defaultValue={detailData.Productgroup} className="input input-detail"/>
                                            )}
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} controlId="formPlaintextSupplier">
                                        <Form.Label column sm="3">
                                            {trls("Salesunit")}
                                        </Form.Label>
                                        <Col sm="9" className="product-text">
                                            {detailData &&(
                                                <input type="text" readOnly defaultValue={detailData.Salesunit} className="input input-detail"/>
                                            )}
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} controlId="formPlaintextSupplier">
                                        <Form.Label column sm="3">
                                            {trls("Purchase_Unit")}
                                        </Form.Label>
                                        <Col sm="9" className="product-text">
                                            {detailData &&(
                                                <input type="text" readOnly defaultValue={detailData.PurchaseUnit} className="input input-detail"/>
                                            )}
                                        </Col>
                                    </Form.Group>
                                    {/* <Form.Group as={Row} controlId="formPlaintextSupplier">
                                        <Form.Label column sm="3">
                                            {trls("Concentration")}
                                        </Form.Label>
                                        <Col sm="9" className="product-text">
                                            {detailData &&(
                                                <input type="text" readOnly defaultValue={detailData.concentration} className="input input-detail"/>
                                            )}
                                        </Col>
                                    </Form.Group> */}
                                    {/* <Form.Group as={Row} controlId="formPlaintextSupplier">
                                        <Form.Label column sm="3">
                                            {trls("Description")}
                                        </Form.Label>
                                        <Col sm="9" className="product-text">
                                            {detailData &&(
                                                <input type="text" readOnly defaultValue={detailData.description} className="input input-detail"/>
                                            )}
                                        </Col>
                                    </Form.Group> */}
                                    <Form.Group as={Row} controlId="formPlaintextSupplier">
                                        <Form.Label column sm="3">
                                            {trls("Kilogram")}
                                        </Form.Label>
                                        <Col sm="9" className="product-text">
                                            {detailData &&(
                                                <input type="text" readOnly defaultValue={detailData.kilogram} className="input input-detail"/>
                                            )}
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} controlId="formPlaintextSupplier">
                                        <Form.Label column sm="3">
                                        </Form.Label>
                                        <Col sm="9" className="product-text">
                                            <Button variant="primary" style={{float: "right", marginRight: -20}} onClick={()=>this.setState({modalEditShow:true, exactFlag: false})}>{trls('Edit')}</Button>
                                        </Col>
                                        
                                    </Form.Group>
                                </Form>
                            </Col>
                            
                        </Row>
                        
                    </Container>
                </div>
                <div className={"product-detail-table"}>
                    <div className="product-price-table">
                        <p className="purprice-title">{trls("Purchase_Price")}</p>
                        <table className="place-and-orders__table table prurprice-dataTable">
                            <thead>
                            <tr>
                                <th>{trls("Price")}</th>
                                <th>{trls("Start_date")}</th>
                                <th>{trls("End_date")}</th>
                                <th style={{width:"10%"}}>{trls("Approve")}</th>
                            </tr>
                            </thead>
                                {purpriceData &&(<tbody>
                                    {
                                        purpriceData.map((data,i) =>(
                                        <tr id={i} key={i} style={{verticalAlign:"middle"}}>
                                            <td>{Common.formatMoney(data.Price)}</td>
                                            <td>{Common.formatDate(data.StartDate)}</td>
                                            <td>{Common.formatDate(data.EndDate)}</td>
                                            {!data.isApproved?(
                                                <td style={{textAlign:"center", paddingBottom:"0px", paddingTop:"0px"}}><Button id={data.Id} name="purchase" type="submit" style={{height:"31px",fontSize:"12px"}} onClick={this.priceApproveConfirm}>{trls('Approve')}</Button></td>
                                            ):<td style={{textAlign:"center"}}></td>}
                                            
                                        </tr>
                                    ))
                                    }
                                </tbody>)}
                        </table>
                        <Button variant="primary" style={{height: 40, borderRadius: 20}} onClick={()=>this.setState({modalShow:true, price_flag:1})}>{trls('Add_Purchase_Price')}</Button>
                        <Productform
                            show={this.state.modalShow}
                            onHide={() => this.setState({modalShow: false})}
                            productid={this.props.location.state.id}
                            price_flag={this.state.price_flag}
                            onGetPurchasePrice={this.getPurchasePriceData}
                            onGetSalesPrice={this.getSalespriceData}
                            onGetTransportPrice={this.getTransportPriceData}
                        />
                        <Updateproductform
                            show={this.state.modalEditShow}
                            onHide={() => this.setState({modalEditShow: false})}
                            getproductetails={()=>this.getProductDetails()}
                            productid={this.props.location.state.id}
                            copyflag={0}
                            copyproduct = {detailData}
                        />
                    </div>
                    <div className="product-price-table">
                        <p className="purprice-title">{trls("Sales_Price")}</p>
                            <table className="place-and-orders__table table prurprice-dataTable">
                                <thead>
                                <tr>
                                    <th>{trls("Price")}</th>
                                    <th>{trls("Start_date")}</th>
                                    <th>{trls("End_date")}</th>
                                    <th style={{width:"10%"}}>{trls("Approve")}</th>
                                </tr>
                                </thead>
                                    {salespriceData &&(<tbody>
                                        {
                                            salespriceData.map((data,i) =>(
                                            <tr id={i} key={i}>
                                                <td>{Common.formatMoney(data.Price)}</td>
                                                <td>{Common.formatDate(data.StartDate)}</td>
                                                <td>{Common.formatDate(data.EndDate)}</td>
                                                {!data.isApproved?(
                                                    <td style={{textAlign:"center", paddingBottom:"0px", paddingTop:"0px"}}><Button id={data.Id} name="sales" type="submit" style={{height:"31px",fontSize:"12px"}} onClick={this.priceApproveConfirm}>{trls('Approve')}</Button></td>
                                                ):<td style={{textAlign:"center"}}></td>}
                                            </tr>
                                        ))
                                        }
                                    </tbody>)}
                            </table>
                    <Button variant="primary" style={{height: 40, borderRadius: 20}} onClick={()=>this.setState({modalShow:true, price_flag:2})}>{trls('Add_Salese_Price')}</Button>
                    </div>
                    <div className="product-price-table transport">
                        <p className="purprice-title">{trls("Transport_Price")}</p>
                        <table className="place-and-orders__table table prurprice-dataTable">
                            <thead>
                            <tr>
                                <th>{trls('Transporter')}</th>
                                <th>{trls('Pricingtype')}</th>
                                <th>{trls('Price')}</th>
                                <th>{trls('Start_date')}</th>
                                <th>{trls('End_date')}</th>
                                <th style={{width:"10%"}}>{trls("Approve")}</th>
                            </tr>
                            </thead>
                                {transportData &&(<tbody>
                                    {
                                        transportData.map((data,i) =>(
                                        <tr id={i} key={i}>
                                            <td>{data.Transporter}</td>
                                            <td>{pricingtypelist[data.pricingtype]}</td>
                                            <td>{Common.formatMoney(data.price)}</td>
                                            <td>{Common.formatDate(data.startdate)}</td> 
                                            <td>{Common.formatDate(data.enddate)}</td> 
                                            {!data.isApproved?(
                                                <td style={{textAlign:"center", paddingBottom:"0px", paddingTop:"0px"}}><Button id={data.Id} name="transport" type="submit" style={{height:"31px",fontSize:"12px"}} onClick={this.priceApproveConfirm}>{trls('Approve')}</Button></td>
                                            ):<td style={{textAlign:"center"}}></td>}
                                        </tr>
                                    ))
                                    }
                                </tbody>)}
                        </table>
                        <Button variant="primary" style={{height: 40, borderRadius: 20}} onClick={()=>this.setState({modalShow:true, price_flag:3})}>{trls('Add_Transport_Price')}</Button>
                    </div>
                </div>
            </div>
        </div>
      )
    };
  }
  export default connect(mapStateToProps, mapDispatchToProps)(Productdtail);
