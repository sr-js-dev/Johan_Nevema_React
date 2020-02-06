import React, {Component} from 'react'
import $ from 'jquery';
import { Form, Row, Col} from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';
import { trls } from '../../components/translate';
import Select from 'react-select';
import { connect } from 'react-redux';
import { BallBeat } from 'react-pure-loaders';
import 'datatables.net';
import SessionManager from '../../components/session_manage';
import API from '../../components/api'
import Axios from 'axios';
import history from '../../history';
// import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Customernote from '../../components/customer_note';
import * as authAction  from '../../actions/authAction';
import DraggableModalDialog from '../../components/draggablemodal';

const mapStateToProps = state => ({ ...state.auth });

const mapDispatchToProps = dispatch => ({
  blankDispatch: () =>
        dispatch(authAction.blankdispatch()),
});
class Productform extends Component {
  _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {  
            token: "",
            customerData: [],
            Supplier: [],
            Producttype: [],
            Customer: [],
            Salesunit: [],
            Productgroup: [],
            Purchase_unit: [],
            modalShow: false,
            val1:"",
            val2:"",
            val3:"",
            val4:"",
            val5:"",
            val6:"",
            redirect:false,
            product_id:"",
            loading:true,
            description: ''
        };
      }
    componentWillUnmount() {
      this._isMounted = false;
    }
    handleSubmit = (event) => {
     
        event.preventDefault();
        const clientFormData = new FormData(event.target);
        const data = {};
        for (let key of clientFormData.keys()) {
        data[key] = clientFormData.get(key);
        }
        let params = {
          "supplier":data.Supplier,
          "producttype":data.Producttype,
          "Concentration":data.Concentration,
          "addition": data.Addition,
          "customer": data.Customer,
          "description": data.Description,
          "salesunit": data.Salesunit,
          "productgroup": data.Productgroup,
          "kilogram":data.kilogram,
          "purchaseunit":data.purchase_unit,
          "approver": data.approver,
          "product": data.product
        }
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.post(API.PostProductData, params, headers)
        .then(response => {
          if(response.data.Success===true){
              window.localStorage.setItem('save', true);
              this.props.onHide();
              this.setState({product_id:response.data.NewId})
              history.push({
                pathname: '/product-detail',
                state: { id: this.state.product_id, newSubmit:false}
              })
          }
        });
      }

    selectCustomer = (val) =>{
      this.setState({val3: val.value});
      let tempArray = [];
      tempArray = this.props.customer;
      tempArray.map((data, index) => {
          if(data.key===val.value){
            if(data.note){
              this.setState({noteModalShow: true})
            }
              this.setState({customerNote:data.note})
          }
          return tempArray;
      })
    }

    setSupplier = () => {
      let supplierSelect = [];
      let supplierData = this.props.supplier;
      if(this.props.supplier){
          supplierData.map((supplier, index)=>{
              if(supplier.value===this.props.copyproduct.Supplier){
                  supplierSelect = { "label": supplier.value, "value": supplier.key }
              }
              return supplierData;
          });
      }
      return supplierSelect
    }

    // setSupplier = () => {
    //   let supplierSelect = [];
    //   let supplierData = this.props.supplier;
    //   if(this.props.supplier){
    //       supplierData.map((supplier, index)=>{
    //           if(supplier.value===this.props.copyproduct.Supplier){
    //               supplierSelect = { "label": supplier.value, "value": supplier.key }
    //           }
    //           return supplierData;
    //       });
    //   }
    //   return supplierSelect
    // }

    setCustomer = () => {
      let customerSelect = [];
      let customerData = this.props.customer;
      if(this.props.customer){
        customerData.map((customer, index)=>{
              if(customer.value===this.props.copyproduct.Customer){
                customerSelect = { "label": customer.value, "value": customer.key }
              }
              return customerData;
          });
      }
      return customerSelect
    }

    setSalesUnit = () => {
      let salesSelect = [];
      let salesData = this.props.salesunit;
      if(this.props.salesunit){
        salesData.map((sales, index)=>{
              if(sales.value===this.props.copyproduct.Salesunit){
                salesSelect = { "label": sales.value, "value": sales.key }
              }
              return salesData;
          });
      }
      return salesSelect
    }

    setProductGroup = () => {
      let productGroupSelect = [];
      let productGroupData = this.props.productgroup;
      if(this.props.productgroup){
        productGroupData.map((productGroup, index)=>{
              if(productGroup.value===this.props.copyproduct.Productgroup){
                productGroupSelect = { "label": productGroup.value, "value": productGroup.key }
              }
              return productGroupData;
          });
      }
      return productGroupSelect
    }

    setPurchaseUnit = () => {
      let purchaseUnitSelect = [];
      let purchaseUnitData = this.props.purchase_unit;
      if(this.props.purchase_unit){
        purchaseUnitData.map((purchaseUnit, index)=>{
              if(purchaseUnit.value===this.props.copyproduct.PurchaseUnit){
                purchaseUnitSelect = { "label": purchaseUnit.value, "value": purchaseUnit.key }
              }
              return purchaseUnitData;
          });
      }
      return purchaseUnitSelect
    }
    
    setApprover = () => {
      let approverSelect = [];
      let approverData = this.props.approver;
      if(this.props.approver){
        approverData.map((approver, index)=>{
              if(approver.value===this.props.copyproduct.Approver){
                approverSelect = { "label": approver.value, "value": approver.key }
              }
              return approverData;
          });
      }
      return approverSelect
    }

    changeSupplier = (value) => {
      var headers = SessionManager.shared().getAuthorizationHeader();
      let params = {
        supplier: value
      }
      Axios.post(API.GetPurchaseDescription, params, headers)
      .then(result => {
        this.setState({description: result.data.Items[0], val1: value})
      });
    }

    render(){
      let purchase_unit=[];
      let approver = [];
      const supplier = this.props.supplier.map( s => ({value:s.key,label:s.value}) );
      const customer  = this.props.customer.map( s => ({value:s.key,label:s.value}) );
      const salesunit  = this.props.salesunit.map( s => ({value:s.key,label:s.value}) );
      const productgroup = this.props.productgroup.map( s => ({value:s.key,label:s.value}) );
      if(this.props.purchase_unit){
        purchase_unit = this.props.purchase_unit.map( s => ({value:s.key,label:s.value}) );
      }
      if(this.props.approver){
        approver = this.props.approver.map( s => ({value:s.key,label:s.value}) );
      }
        return (
            <Modal
              {...this.props}
              dialogAs={DraggableModalDialog}
              size="xl"
              aria-labelledby="contained-modal-title-vcenter"
              backdrop= "static"
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                  Product
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                  <Form className="container product-form" onSubmit = { this.handleSubmit }>
                      <Form.Group as={Row} controlId="formPlaintextSupplier">
                          <Form.Label column sm="3">
                              {trls("Supplier")}
                          </Form.Label>
                          <Col sm="9" className="product-text">
                              <Select
                                  name="Supplier"
                                  placeholder={trls('Supplier')}
                                  options={supplier}
                                  onChange={val => this.changeSupplier(val.value)}
                                  defaultValue={this.setSupplier()}
                              />
                              {!this.props.disabled && this.props.copyflag!==0 && (
                                <input
                                    onChange={val=>console.log()}
                                    tabIndex={-1}
                                    autoComplete="off"
                                    style={{ opacity: 0, height: 0 }}
                                    value={this.state.val1}
                                    required
                                    />
                                )}
                          </Col>
                      </Form.Group>
                      <Form.Group as={Row} controlId="formPlaintextPassword">
                          <Form.Label column sm="3">
                            {trls("Customer")}
                          </Form.Label>
                          <Col sm="9" className="product-text">
                              <Select
                                  name="Customer"
                                  placeholder={trls('Customer')}
                                  options={customer}
                                  onChange={val => this.selectCustomer(val)}
                                  defaultValue={this.setCustomer()}
                              />
                              {!this.props.disabled && this.props.copyflag!==0 && (
                                <input
                                    onChange={val=>console.log()}
                                    tabIndex={-1}
                                    autoComplete="off"
                                    style={{ opacity: 0, height: 0 }}
                                    value={this.state.val3}
                                    required
                                    />
                                )}
                          </Col>
                      </Form.Group>
                      <Form.Group as={Row} controlId="formPlaintextPassword">
                          <Form.Label column sm="3">
                            {trls("Product")}
                          </Form.Label>
                          <Col sm="9" className="product-text">
                              <Form.Control type="text" name="product" defaultValue={this.props.copyproduct.product} placeholder="Product" />
                              {!this.props.disabled && (
                                <input
                                    onChange={val=>console.log()}
                                    tabIndex={-1}
                                    autoComplete="off"
                                    style={{ opacity: 0, height: 0 }}
                                    />
                                )}
                          </Col>
                      </Form.Group>
                      <Form.Group as={Row} controlId="formPlaintextPassword">
                          <Form.Label column sm="3">
                            {trls("Description")}
                          </Form.Label>
                          <Col sm="9" className="product-text">
                              <Form.Control type="text" defaultValue={this.props.copyproduct ? this.props.copyproduct.description : this.state.description} name="Description" placeholder="Description" />
                              {!this.props.disabled && (
                                <input
                                    onChange={val=>console.log()}
                                    tabIndex={-1}
                                    autoComplete="off"
                                    style={{ opacity: 0, height: 0 }}
                                    />
                                )}
                          </Col>
                      </Form.Group>
                      <Form.Group as={Row} controlId="formPlaintextPassword">
                          <Form.Label column sm="3">
                            {trls("Salesunit")}
                          </Form.Label>
                          <Col sm="9" className="product-text">
                              <Select
                                  name="Salesunit"
                                  placeholder={trls('Salesunit')}
                                  options={salesunit}
                                  onChange={val =>this.setState({val4:val})}
                                  defaultValue={this.setSalesUnit()}
                              />
                              {!this.props.disabled && this.props.copyflag!==0 && (
                                <input
                                    onChange={val=>console.log()}
                                    tabIndex={-1}
                                    autoComplete="off"
                                    style={{ opacity: 0, height: 0 }}
                                    value={this.state.val4}
                                    required
                                    />
                                )}
                          </Col>
                      </Form.Group>
                      <Form.Group as={Row} controlId="formPlaintextPassword">
                          <Form.Label column sm="3">
                            {trls("Product_Group")}
                          </Form.Label>
                          <Col sm="9" className="product-text">
                              <Select
                                  name="Productgroup"
                                  placeholder={trls('Product_Group')}
                                  options={productgroup}
                                  onChange={val => this.setState({val5:val})}
                                  defaultValue={this.setProductGroup()}
                              />
                              {!this.props.disabled && this.props.copyflag!==0 &&(
                                <input
                                    onChange={val=>console.log()}
                                    tabIndex={-1}
                                    autoComplete="off"
                                    style={{ opacity: 0, height: 0 }}
                                    value={this.state.val5}
                                    required
                                    />
                                )}
                          </Col>
                      </Form.Group>
                      <Form.Group as={Row} controlId="formPlaintextPassword">
                          <Form.Label column sm="3">
                            {trls("Purchase_Unit")}
                          </Form.Label>
                          <Col sm="9" className="product-text">
                              <Select
                                  name="purchase_unit"
                                  placeholder={trls('Purchase_Unit')}
                                  options={purchase_unit}
                                  onChange={val => this.setState({val5:val})}
                                  defaultValue={this.setPurchaseUnit()}
                              />
                              {!this.props.disabled && this.props.copyflag!==0 && (
                                <input
                                    onChange={val=>console.log()}
                                    tabIndex={-1}
                                    autoComplete="off"
                                    style={{ opacity: 0, height: 0 }}
                                    value={this.state.val5}
                                    required
                                    />
                                )}
                          </Col>
                      </Form.Group>
                      <Form.Group as={Row} controlId="formPlaintextPassword">
                          <Form.Label column sm="3">
                            {trls("Approver")}
                          </Form.Label>
                          <Col sm="9" className="product-text">
                              <Select
                                  name="approver"
                                  placeholder={trls('Approver')}
                                  options={approver}
                                  onChange={val => this.setState({val5:val})}
                                  defaultValue={this.setApprover()}
                              />
                              {!this.props.disabled && this.props.copyflag!==0 && (
                                <input
                                    onChange={val=>console.log()}
                                    tabIndex={-1}
                                    autoComplete="off"
                                    style={{ opacity: 0, height: 0 }}
                                    value={this.state.val5}
                                    required
                                    />
                                )}
                          </Col>
                      </Form.Group>
                      <Form.Group as={Row} controlId="formPlaintextPassword">
                          <Form.Label column sm="3">
                            {trls("Kilogram")}
                          </Form.Label>
                          <Col sm="9" className="product-text">
                              <Form.Control type="number" name="kilogram" placeholder="Kilogram" defaultValue={this.props.copyproduct.kilogram} onChange={val=>this.setState({val6:val})}/>
                              {!this.props.disabled && this.props.copyflag!==0&& (
                                <input
                                    onChange={val=>console.log()}
                                    tabIndex={-1}
                                    autoComplete="off"
                                    style={{ opacity: 0, height: 0 }}
                                    value={this.state.val6}
                                    required
                                    />
                                )}
                          </Col>
                      </Form.Group>
                      <Form.Group style={{textAlign:"center"}}>
                          <Button type="submit" style={{width:"100px"}}>Save</Button>
                      </Form.Group>
                      <Form.Control type="text" hidden name="token" defaultValue={this.props.token} />
                      <Customernote
                          show={this.state.noteModalShow}
                          onHide={() => this.setState({noteModalShow: false})}
                          customerNote={this.state.customerNote}
                          // customerData
                      />
                  </Form>
              </Modal.Body>
            </Modal>
          );
    }
  }
class Product extends Component {
    _isMounted = false
    constructor(props) {
        super(props);
        this.state = {  
            token: "",
            productData: [],
            Supplier: [],
            Producttype: [],
            Customer: [],
            Salesunit: [],
            Productgroup: [],
            modalShow: false,
            copyProduct: [],
            copyFlag: 1
        };
      }

    componentDidMount() {
      this._isMounted = true;
      this.getProductData();
      this.getSupplierList();
      this.getProducttype();
      this.getCustomer();
      // this.getSalesunit();
      this.getProductGroup();
      this.getUnitData();
      this.getUserData();
    }
    getUserData = () => {
      var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.get(API.GetUserData, headers)
        .then(result => {
          let userData=result.data;
          let optionarray = [];
          if(userData){
              userData.map((data, index) => {
                  if(data.IsActive){
                      data.key = data.Id;
                      data.value = data.Email
                      optionarray.push(data);
                  }
                return userData;
              })
          }
          this.setState({approve_user:optionarray})
        });
    }
    getProductData = () =>{
      this.setState({loading:true})
      var headers = SessionManager.shared().getAuthorizationHeader();
      Axios.get(API.GetProductData, headers)
      .then(result => {
        if(this._isMounted){
          this.setState({productData: result.data.Items});
          this.setState({loading:false})
        $('#project_table thead tr').clone(true).appendTo( '#project_table thead' );
        $('#project_table thead tr:eq(1) th').each( function (i) {
            $(this).html( '<input type="text" class="search-table-input" style="width: 100%" placeholder="Search" />' );
            $(this).addClass("sort-style");
            $( 'input', this ).on( 'keyup change', function () {
                if ( table.column(i).search() !== this.value ) {
                    table
                        .column(i)
                        .search( this.value )
                        .draw();
                }
            } );
        } );
        $('#project_table').dataTable().fnDestroy();
        var table = $('#project_table').DataTable(
            {
              "language": {
                  "lengthMenu": trls("Show")+" _MENU_ "+trls("Entries"),
                  "zeroRecords": "Nothing found - sorry",
                  "info": trls("Show_page")+" _PAGE_ of _PAGES_",
                  "infoEmpty": "No records available",
                  "infoFiltered": "(filtered from _MAX_ total records)",
                  "search": trls('Search'),
                  "paginate": {
                    "previous": trls('Previous'),
                    "next": trls('Next')
                  }
              }
            }
          );
        }
      });
    }

    getSupplierList = () =>{
      var headers = SessionManager.shared().getAuthorizationHeader();
      Axios.get(API.GetSupplierList, headers)
      .then(result => {
        if(this._isMounted){
          this.setState({Supplier: result.data.Items})
        }
      });
    }

    getUnitData = () =>{
      var headers = SessionManager.shared().getAuthorizationHeader();
      Axios.get(API.GetUnitData, headers)
      .then(result => {
        if(this._isMounted){
          this.setState({purchase_unit: result.data.Items})
          this.setState({Salesunit: result.data.Items})
        }
      });
    }

    getProducttype = () =>{
      var headers = SessionManager.shared().getAuthorizationHeader();
      Axios.get(API.GetProductType, headers)
      .then(result => {
        if(this._isMounted){
          this.setState({Producttype: result.data.Items})
        }
      });
    }

    getCustomer = () =>{
      var headers = SessionManager.shared().getAuthorizationHeader();
      Axios.get(API.GetCustomerData, headers)
      .then(result => {
        if(this._isMounted){
          this.setState({Customer: result.data.Items})
        }
      });
    }

    // getSalesunit = () =>{
    //   var headers = SessionManager.shared().getAuthorizationHeader();
    //   Axios.get(API.GetSalesUnit, headers)
    //   .then(result => {
    //     if(this._isMounted){
    //       this.setState({Salesunit: result.data.Items})
    //     }
    //   });
    // }

    getProductGroup = () =>{
      var headers = SessionManager.shared().getAuthorizationHeader();
      Axios.get(API.GetProductGroup, headers)
      .then(result => {
        if(this._isMounted){
          this.setState({Productgroup: result.data.Items})
        }
      });
    }
    loadProductDetail = (e) => {
      history.push({
        pathname: '/product-detail',
        state: { id: e.currentTarget.id, newSubmit:true }
      })
    }
    copyProduct = (data) => {
      var headers = SessionManager.shared().getAuthorizationHeader();
      let params = {
        id: data.id
      }
      Axios.post(API.GetProduct, params, headers)
      .then(result => {
        if(this._isMounted){
          this.setState({modalShow: true, copyFlag: 0, copyProduct: result.data.Items[0]})
        }
      });
        // 
    }
    componentWillUnmount() {
      this._isMounted = false
    }

    render () {
      let productData=this.state.productData;
      return (
        <div className="order_div">
            <div className="content__header content__header--with-line">
                <div id="google_translate_element"></div>
                <h2 className="title">{trls("Products")}</h2>
            </div>
            <div className="orders">
                <div className="orders__filters justify-content-between">
                    <Form inline style={{width:"100%"}}>
                        <Button variant="primary" onClick={()=>this.setState({modalShow: true, copyProduct: '', copyFlag: 1})}>{trls("Add_Product")}</Button>   
                        <Productform
                            show={this.state.modalShow}
                            onHide={() => this.setState({modalShow: false})}
                            supplier ={this.state.Supplier}
                            producttype  ={this.state.Producttype }
                            customer  ={this.state.Customer }
                            salesunit  ={this.state.Salesunit }
                            productgroup  ={this.state.Productgroup}
                            token  ={this.state.token}
                            purchase_unit = {this.state.purchase_unit}
                            approver = {this.state.approve_user}
                            copyproduct = {this.state.copyProduct}
                            copyflag={this.state.copyFlag}
                        />
                    </Form>
                </div>
                <div className="table-responsive">
                        <table id="project_table" className="place-and-orders__table table table--striped prurprice-dataTable" width="100%">
                        <thead>
                            <tr>
                                <th>{trls("Productcode")}</th>
                                <th>{trls("Supplier")}</th>
                                <th>{trls("Product")}</th>
                                <th>{trls("Customer")}</th>
                                <th>{trls("Product_Group")}</th>
                                <th>{trls("Sales_Unit")}</th>
                                <th>{trls("Kilogram")}</th>
                                <th>{trls("Copy_Product")}</th>
                            </tr>
                        </thead>
                        {productData && !this.state.loading&&(<tbody>
                              {
                                productData.map((data,i) =>(
                                <tr id={data.id} key={i}>
                                    <td>
                                      <div id={data.id} style={{cursor: "pointer", color:'#004388', fontSize:"14px", fontWeight:'bold'}} onClick={this.loadProductDetail}>{data.Productcode}</div>
                                    </td>
                                    <td>
                                        {data.Supplier}
                                    </td>
                                    <td>{data.Product}</td>
                                    <td>{data.Customer}</td>
                                    <td>{data.Productgroup}</td>
                                    <td>{data.SalesUnit}</td>
                                    <td>{data.Kilogram}</td>
                                    <td>
                                      <Row style={{justifyContent:"center"}}>
                                          <img src={require("../../assets/images/icon-orders.svg")} id={data.id} alt="copy" className="statu-item" onClick={()=>this.copyProduct(data)}/>
                                      </Row>
                                    </td>
                                </tr>
                              ))
                              }
                          </tbody>)}
                    </table>
                    { this.state.loading&& (
                      <div className="col-md-4 offset-md-4 col-xs-12 loading" style={{textAlign:"center"}}>
                          <BallBeat
                              color={'#222A42'}
                              loading={this.state.loading}
                          />
                      </div>
                    )}
                </div>
            </div>
        </div>
        
      )
    };
  }
  export default connect(mapStateToProps, mapDispatchToProps)(Product);
