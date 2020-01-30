import React, {Component} from 'react'
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import SessionManager from '../../components/session_manage';
import API from '../../components/api'
import Axios from 'axios';
import { trls } from '../../components/translate';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import * as Common from '../../components/common';
import DraggableModalDialog from '../../components/draggablemodal';

const mapStateToProps = state => ({ 
    ...state.auth,
});

const mapDispatchToProps = (dispatch) => ({

});

class Updateorderline extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {  
            reportingDate: new Date(),
            reportingFlag: false
        };
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    
    componentDidMount() {
        // this.getProductList();
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const clientFormData = new FormData(event.target);
        const data = {};
        let params = [];
        for (let key of clientFormData.keys()) {
            data[key] = clientFormData.get(key);
        }
        var headers = SessionManager.shared().getAuthorizationHeader();
        params = {
            orderlineid: this.props.updatedata.id,
            purchasePrice: data.purchaseprice,
            salesPrice: data.salesprice,
            purchaseAmount: data.purhcaseamount,
            salesAmount: data.salesamount,
            packingslip: data.packingslip,
            container: data.container,
            shipping: data.shippingdocumentnumber,
            reporting: Common.formatDateSecond(data.reporingdate)
        }
        Axios.post(API.PutSalesOrderLine, params, headers)
        .then(result => {
            this.onHide();
        });
    }

    onHide = () => {
        this.props.onHide();
        this.props.getSalesOrderLine();
    }

    render(){
        let updateData = [];
        if(this.props.updatedata){
            updateData = this.props.updatedata;
        }
        return (
            <Modal
                show={this.props.show}
                dialogAs={DraggableModalDialog}
                onHide={()=>this.onHide()}
                size="xl"
                aria-labelledby="contained-modal-title-vcenter"
                backdrop= "static"
                centered
            >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {trls('Edit')}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form className="container product-form" onSubmit = { this.handleSubmit }>
                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Form.Label column sm="3">
                            {trls("Product")}  
                        </Form.Label>
                        <Col sm="9" className="product-text"> 
                            <Form.Control type="text" name="product" defaultValue={updateData.productcode} readOnly placeholder={trls("Purchase_Price")} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Form.Label column sm="3">
                            {trls("Quantity")}  
                        </Form.Label>
                        <Col sm="9" className="product-text"> 
                            <Form.Control type="text" name="quantity" defaultValue={updateData.quantity} readOnly placeholder={trls("Purchase_Price")} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Form.Label column sm="3">
                            {trls("Purchase_Price")}  
                        </Form.Label>
                        <Col sm="9" className="product-text"> 
                            <Form.Control type="text" name="purchaseprice" defaultValue={updateData.purchaseprice} readOnly placeholder={trls("Purchase_Price")} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Form.Label column sm="3">
                            {trls("Sales_Price")}  
                        </Form.Label>
                        <Col sm="9" className="product-text">
                            <Form.Control type="text" name="salesprice" defaultValue={updateData.SalesPrice} readOnly placeholder={trls("Sales_Price")} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Form.Label column sm="3">
                            {trls("Purchase_Unit")}  
                        </Form.Label>
                        <Col sm="9" className="product-text"> 
                            <Form.Control type="text" name="purchaseprice" defaultValue={updateData.PurchaseUnit} readOnly placeholder={trls("Purchase_Price")} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Form.Label column sm="3">
                            {trls("Sales_Unit")}  
                        </Form.Label>
                        <Col sm="9" className="product-text">
                            <Form.Control type="text" name="salesprice" defaultValue={updateData.SalesUnit} readOnly placeholder={trls("Sales_Price")} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Form.Label column sm="3">
                            {trls("Purchase_Amount")}  
                        </Form.Label>
                        <Col sm="9" className="product-text">
                            <Form.Control type="text" name="purhcaseamount" defaultValue={updateData.purchaseamount} readOnly placeholder={trls("Purchase_Amount")} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Form.Label column sm="3">
                            {trls("Sales_Amount")}  
                        </Form.Label>
                        <Col sm="9" className="product-text">
                            <Form.Control type="text" name="salesamount" defaultValue={updateData.SalesAmount} readOnly placeholder={trls("Sales_Amount")} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Form.Label column sm="3">
                            {trls("Packing_slip_number")}  
                        </Form.Label>
                        <Col sm="9" className="product-text">
                            <Form.Control type="text" name="packingslip" defaultValue={updateData.PackingSlip}  placeholder={trls("Packing_slip_number")} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Form.Label column sm="3">
                            {trls("Container_number")}  
                        </Form.Label>
                        <Col sm="9" className="product-text">
                            <Form.Control type="text" name="container" defaultValue={updateData.Container} placeholder={trls("Container_number")} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Form.Label column sm="3">
                            {trls("ShippingDocumentnumber")}  
                        </Form.Label>
                        <Col sm="9" className="product-text">
                            <Form.Control type="text" name="shippingdocumentnumber" defaultValue={updateData.Shipping} placeholder={trls("ShippingDocumentnumber")} />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Form.Label column sm="3">
                            {trls('ReportingDate')}   
                        </Form.Label>
                        <Col sm="9" className="product-text">
                            {this.state.reportingFlag || !this.props.updatedata ?( 
                                <DatePicker name="reporingdate" className="myDatePicker" dateFormat="dd-MM-yyyy" selected={this.state.reportingDate} onChange={date =>this.setState({reportingDate:date, reportingFlag: true})} />
                                ) : <DatePicker name="reporingdate" className="myDatePicker" dateFormat="dd-MM-yyyy" selected={new Date( this.props.updatedata.ReportingDate)} onChange={date =>this.setState({invoicedate:date, reportingFlag: true})} />
                            } 
                        </Col>
                    </Form.Group>
                    <Form.Group style={{textAlign:"center"}}>
                        <Button type="submit" style={{width:"100px"}}>{trls('Save')}</Button>
                    </Form.Group>
                </Form>
            </Modal.Body>
            </Modal>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Updateorderline);