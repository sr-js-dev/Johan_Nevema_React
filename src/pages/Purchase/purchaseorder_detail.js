import React, {Component} from 'react'
import { Container, Row, Col, Form, Button, Spinner} from 'react-bootstrap';
import { connect } from 'react-redux';
import SessionManager from '../../components/session_manage';
import Axios from 'axios';
import API from '../../components/api'
import { trls } from '../../components/translate';
import Purchaseform  from './purchaseform'
import Addpurchaseform  from './addpruchase_form'
import * as Common from '../../components/common'
import FlashMassage from 'react-flash-message';
import Addmanuallytranspor from './transportmanualform'
import Sweetalert from 'sweetalert';

const mapStateToProps = state => ({ 
    ...state,
});

const mapDispatchToProps = dispatch => ({

});

class Purchaseorderdtail extends Component {
    constructor(props) {
        super(props);
        this.state ={
            orderdate: '', 
            salesorderid:'',
            purchaseOrder:[],
            exactFlag: false,
            sendingFlag: false,
            purchaseOrderLine: [],
            totalAmount: 0,
            supplierCode: '',
            purchaseTransportManualLine: [],
            totalManualAmount: 0,
            updateManualData: [],
            defaultVatCode: '',
            vatCodeList: []
        }
      }
    componentDidMount() {
        this.getPurchaseOrder();
        this.getPurchaseOrderLines();
        this.getPurchaseTransportManual();
    }
    getPurchaseOrder() {
        var params= {
            "purchaseorderid":this.props.location.state.newId
        }
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.post(API.GetPurchaseOrder, params, headers)
        .then(result => {
            this.setState({purchaseOrder: result.data.Items[0]});
            if(!result.data.Items[0].istransport){
                Axios.get(API.GetSuppliersDropdown, headers)
                .then(result => {
                    let supplierData = result.data.Items;
                    let supplierCode = '';

                    supplierData.map((supplier, index)=>{
                        if(supplier.value===this.state.purchaseOrder.Customer){
                            supplierCode = supplier.key;
                        }
                        return supplierData;
                    });
                    var suparams = {
                        supplier: supplierCode
                    }
                    Axios.post(API.GetDefaultVatCode, suparams, headers)
                    .then(result => {
                        if(result.data.Success){
                            let defaultVatCode = result.data.Items[0].VatCode
                            Axios.get(API.GetVATCode, headers)
                            .then(result => {
                                    let vatCode = result.data.Items.map( s => ({value:s.key,label:s.value}));
                                    var item = vatCode.filter(item => item.value===defaultVatCode);
                                    this.setState({vatCodeList: vatCode, defaultVatCode: item})
                            });
                        }
                    });
                    this.setState({supplierCode: supplierCode})
                });
            }else{
                Axios.get(API.GetTransportersDropdown, headers)
                .then(result => {
                    
                    let supplierData = result.data.Items;
                    let supplierCode = '';
                    supplierData.map((supplier, index)=>{
                        if(supplier.Value===this.state.purchaseOrder.Customer){
                            supplierCode = supplier.Key;
                        }
                        return supplierData;
                    });
                    this.setState({supplierCode: supplierCode})
                });
            }
            this.setState({purchaseOrder: result.data.Items[0]});
        });
    }

    getPurchaseOrderLines () {
        this.setState({
            updateManualData: [],
            defaultVatCode: '',
            vatCodeList: []
        })
        var params = {
            purchaseorderid:this.props.location.state.newId
        }
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.post(API.GetPurchaseOrderLines, params, headers)
        .then(result => {
            let totalAmount = 0;
            result.data.Items.map((data, index)=>{
                if(!this.state.purchaseOrder.istransport){
                    totalAmount += data.amount
                }else{
                    totalAmount += data.price
                }
                
                return data;
            });
            this.setState({purchaseOrderLine: result.data.Items, totalAmount: totalAmount})
        });
    }

    getPurchaseTransportManual () {
        this.setState({updateManualData: []})
        var params = {
            orderid:this.props.location.state.newId
        }
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.post(API.GetPurchaseTransportManual, params, headers)
        .then(result => {
            let totalManualAmount = 0;
            if(result.data.Items.length){
                result.data.Items.map((data, index)=>{
                        totalManualAmount += data.Amount
                    return data;
                });
                this.setState({purchaseTransportManualLine: result.data.Items, totalManualAmount: totalManualAmount})
            }
        });
    }
    
    componentWillUnmount() {
        this._isMounted = false
    }
    
    generatePurchaseInvoiceXmlExact = () => {
        this.setState({sendingFlag: true})
        var headers = SessionManager.shared().getAuthorizationHeader();
        var params = {
            purchaseid: this.props.location.state.newId
        }
        Axios.post(API.PostPurchaseOrderExact, params, headers)
        .then(result => {
            Axios.get(API.GeneratePurchaseInvoiceXmlExact, headers)
            .then(result => {
                Axios.post(API.PostPurchaseOrderExactSend, params, headers)
                .then(result => {
                    this.setState({exactFlag: true, sendingFlag: false})
                });
            });
        });
    }

    transportManualLineEdit = (data) => {
        console.log('66666', data);
        this.setState({updateManualData: data, showModalManully: true})
    }

    deletePurchaseTransportManual  = (Id) => {
        let params = {
            id: Id
        }
        var headers = SessionManager.shared().getAuthorizationHeader();
        Sweetalert({
            title: "Are you sure?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                Axios.post(API.DeletePurchaseTransportManual, params, headers)
                .then(result => {
                    if(result.data.Success){
                        this.getPurchaseTransportManual();
                    }
                });
            } else {
            }
          });
        
    }

    render () {
        let detailData = [];
        if(this.state.purchaseOrder){
            detailData = this.state.purchaseOrder;
        }
        let alltotal_Amounnt = this.state.totalAmount+this.state.totalManualAmount;
        return (
            
            <div>
                <div className="content__header content__header--with-line">
                    <h2 className="title">{trls('Purchase_Order_Details')}</h2>
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
                    <Button variant="primary" onClick={()=>this.generatePurchaseInvoiceXmlExact()} style={{marginTop: 20}}>{trls("Send_to_Exact")}</Button>
                        <div className="place-and-orders__top">
                            <Container className="sales-details">
                                <Row>
                                    <Col sm={6}>
                                        <Form className="container product-form">
                                            <Form.Group as={Row} controlId="formPlaintextSupplier">
                                                <Form.Label column sm="3">
                                                    {trls("Supplier")}
                                                </Form.Label>
                                                <Col sm="9" className="product-text">
                                                    {detailData &&(
                                                        <input type="text" readOnly defaultValue={detailData.Customer} className="input input-detail"/>
                                                    )}
                                                </Col>
                                            </Form.Group>
                                            <Form.Group as={Row} controlId="formPlaintextSupplier">
                                                <Form.Label column sm="3">
                                                    {trls("Invoice")}
                                                </Form.Label>
                                                <Col sm="9" className="product-text">
                                                    {detailData &&(
                                                        <input type="text" readOnly defaultValue={detailData.invoicenr} className="input input-detail"/>
                                                    )}
                                                </Col>
                                            </Form.Group>
                                                <Form.Group as={Row} controlId="formPlaintextSupplier">
                                                <Form.Label column sm="3">
                                                    {trls("Invoice_date")}
                                                </Form.Label>
                                                <Col sm="9" className="product-text">
                                                    {detailData.invoicedate ?(
                                                        <input type="text" readOnly defaultValue={Common.formatDate(detailData.invoicedate)} className="input input-detail"/>
                                                    ): <input type="text" readOnly className="input input-detail"/>}
                                                </Col>
                                            </Form.Group>
                                        </Form>
                                    </Col>
                                    <Col sm={6}>
                                        <Form className="container product-form">
                                            <Form.Group as={Row} controlId="formPlaintextSupplier">
                                                <Form.Label column sm="3">
                                                    {trls("Description")}
                                                </Form.Label>
                                                <Col sm="9" className="product-text">
                                                    {detailData &&(
                                                        <input type="text" readOnly defaultValue={ detailData.description} className="input input-detail"/>
                                                    )}
                                                </Col>
                                            </Form.Group>
                                            <Form.Group as={Row} controlId="formPlaintextSupplier">
                                                <Form.Label column sm="3">
                                                    {trls("IsTransport")}
                                                </Form.Label>
                                                <Col sm="9" className="product-text">
                                                    {/* <i className="fas fa-circle inactive-icon"></i><div>Inactive</div> */}
                                                    {detailData &&(
                                                        <Form.Check type="checkbox" disabled style={{padding: 10, marginLeft: 33}} defaultChecked={detailData.istransport} name="transport" />
                                                    )}
                                                </Col>
                                            </Form.Group>
                                            <Form.Group as={Row} controlId="formPlaintextSupplier">
                                                <Form.Label column sm="3">
                                                </Form.Label>
                                                <Col sm="9" className="product-text">
                                                    <Button variant="primary" style={{float: "right", marginRight: -20}} onClick={()=>this.setState({modalShow:true, exactFlag: false})}>{trls('Edit')}</Button>
                                                </Col>
                                            </Form.Group>
                                            
                                        </Form>
                                    </Col>
                                </Row>
                            </Container>
                        </div>
                        <div className="table-responsive">
                            {!this.state.purchaseOrder.istransport ? (
                                <table id="example" className="place-and-orders__table table table--striped prurprice-dataTable" width="100%">
                                    <thead>
                                        <tr>
                                            <th>{trls('Product')}</th>
                                            <th>{trls('Quantity')}</th>
                                            <th>{trls('Purchase_Unit')}</th>
                                            <th>{trls('Price')}</th>
                                            <th>{trls('Amount')}</th>
                                            <th>{trls('VATCode')}</th>
                                            <th>{trls('Reporting_Date')}</th>
                                            </tr>
                                    </thead>
                                    {this.state.purchaseOrderLine && (<tbody>
                                        {
                                            this.state.purchaseOrderLine.map((data,i) =>(
                                            <tr id={data.id} key={i}>
                                                <td>{data.productcode}</td>
                                                <td>{data.quantity}</td>
                                                <td>{data.unit}</td>
                                                <td>{Common.formatMoney(data.price)}</td>
                                                <td>{Common.formatMoney(data.amount)}</td>
                                                <td>{data.VAT}</td>
                                                <td>{Common.formatDate(data.reportingdate)}</td>
                                            </tr>
                                        ))
                                        }
                                        <tr style={{backgroundColor: 'rgb(157, 202, 159)', fontWeight: 'bold'}}>
                                            <td>{trls('Total')}</td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td style={{textAlign: 'right'}}>{Common.formatMoney(this.state.totalAmount)}</td>
                                        </tr>
                                    </tbody>)}
                                </table>
                            ):
                                <table id="example" className="place-and-orders__table table table--striped prurprice-dataTable" width="100%">
                                    <thead>
                                        <tr>
                                            <th>{trls('Pricingtype')}</th>
                                            <th>{trls('Price')}</th>
                                        </tr>
                                    </thead>
                                    {this.state.purchaseOrderLine && (<tbody>
                                        {
                                            this.state.purchaseOrderLine.map((data,i) =>(
                                            <tr id={data.id} key={i}>
                                                <td>{data.pricingtype}</td>
                                                <td>{Common.formatMoney(data.price)}</td>
                                            </tr>
                                        ))
                                        }
                                        <tr style={{backgroundColor: 'rgb(157, 202, 159)', fontWeight: 'bold'}}>
                                            <td>{trls('Total')}</td>
                                            <td style={{textAlign: 'right'}}>{Common.formatMoney(this.state.totalAmount)}</td>
                                        </tr>
                                    </tbody>)}
                                </table>
                            }
                            
                        <Button variant="primary" style={{height: 40, borderRadius: 20, float: 'right'}} onClick={()=>this.setState({showModalPurchaase: true})}>{trls('Add')}</Button>
                    </div>
                    {this.state.purchaseOrder.istransport&&(
                        <div className="table-responsive">
                            <table id="example" className="place-and-orders__table table table--striped prurprice-dataTable" width="100%">
                                <thead>
                                    <tr>
                                        <th>{trls('Product')}</th>
                                        <th>{trls('Quantity')}</th>
                                        <th>{trls('Price')}</th>
                                        <th>{trls('Amount')}</th>
                                        <th>{trls('Reporting_Date')}</th>
                                        <th>{trls('Action')}</th>
                                    </tr>
                                </thead>
                                {this.state.purchaseTransportManualLine && (<tbody>
                                    {
                                        this.state.purchaseTransportManualLine.map((data,i) =>(
                                        <tr id={data.Id} key={i}>
                                            <td>{data.Product}</td>
                                            <td>{data.Quantity}</td>
                                            <td>{Common.formatMoney(data.Price)}</td>
                                            <td>{Common.formatMoney(data.Amount)}</td>
                                            <td>{Common.formatDate(data.ReportingDate)}</td>
                                            <td >
                                            <Row style={{justifyContent:"space-around"}}>
                                                <i id={data.Id} className="far fa-trash-alt statu-item" onClick={()=>this.deletePurchaseTransportManual(data.Id)}></i>
                                                <i id={data.Id} className="fas fa-pen statu-item" onClick={()=>this.transportManualLineEdit(data)} ></i>
                                            </Row>
                                        </td>
                                        </tr>
                                    ))
                                    }
                                    <tr style={{backgroundColor: 'rgb(157, 202, 159)', fontWeight: 'bold'}}>
                                        <td>{trls('Total')}</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td style={{textAlign: 'right'}}>{Common.formatMoney(this.state.totalManualAmount)}</td>
                                    </tr>
                                </tbody>)}
                            </table>
                            <Button variant="primary" style={{height: 40, borderRadius: 20, float: 'right'}} onClick={()=>this.setState({showModalManully: true})}>{trls('Add')}</Button>
                        </div>
                    )}
                    <div style={{textAlign: 'right', fontWeight: 'bold', padding: 10, marginBottom: 20, marginTop: 10, backgroundColor: '#E6DAB7'}}>
                        {trls('Total')}:  <span style={{fontWeight: 'bold', fontSize: 18}}>{Common.formatMoney(alltotal_Amounnt)}</span>
                    </div>
                    <Purchaseform
                        show={this.state.modalShow}
                        onHide={() => this.setState({modalShow: false})}
                        purchaseData={this.state.purchaseOrder}
                        getPurchaseOrder={()=>this.getPurchaseOrder()}
                    />
                    <Addpurchaseform
                        show={this.state.showModalPurchaase}
                        onHide={() => this.setState({showModalPurchaase: false})}
                        suppliercode={this.state.supplierCode}
                        purchaseid={this.props.location.state.newId}
                        defaultVatCode={this.state.defaultVatCode}
                        vatCodeList={this.state.vatCodeList}
                        getPurchaseOrderLines={()=>this.getPurchaseOrderLines()}
                        transport={this.state.purchaseOrder.istransport}
                    />
                    <Addmanuallytranspor
                        show={this.state.showModalManully}
                        onHide={() => this.setState({showModalManully: false})}
                        reportingDate={detailData.invoicedate}
                        orderid={this.props.location.state.newId}
                        getPurchaseTransportManual={()=>this.getPurchaseTransportManual()}
                        updateData={this.state.updateManualData}
                    />
                    
                </div>
            </div>
        )
        };
  }
  export default connect(mapStateToProps, mapDispatchToProps)(Purchaseorderdtail);