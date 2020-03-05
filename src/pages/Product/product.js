import React, {Component} from 'react'
import $ from 'jquery';
import { Form, Row } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { trls } from '../../components/translate';
import { connect } from 'react-redux';
import { BallBeat } from 'react-pure-loaders';
import 'datatables.net';
import SessionManager from '../../components/session_manage';
import API from '../../components/api'
import Axios from 'axios';
import * as Common from '../../components/common';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import * as authAction  from '../../actions/authAction';
import Productform from './product_form'
import Productdetail from './product_detail';

const mapStateToProps = state => ({ ...state.auth });

const mapDispatchToProps = dispatch => ({
  blankDispatch: () =>
        dispatch(authAction.blankdispatch()),
});

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
            slideFormFlag: false,
            slideproductDetailFlag: false,
            copyProduct: [],
            copyFlag: 1,
            productId: ''
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
        // $('#project_table thead tr').clone(true).appendTo( '#project_table thead' );
        // $('#project_table thead tr:eq(1) th').each( function (i) {
        //     $(this).html( '<input type="text" class="search-table-input" style="width: 100%" placeholder="Search" />' );
        //     $(this).addClass("sort-style");
        //     $( 'input', this ).on( 'keyup change', function () {
        //         if ( table.column(i).search() !== this.value ) {
        //             table
        //                 .column(i)
        //                 .search( this.value )
        //                 .draw();
        //         }
        //     } );
        // } );
        $('#project_table').dataTable().fnDestroy();
        $('#project_table').DataTable(
          {
            "language": {
                "lengthMenu": trls("Show")+" _MENU_ "+trls("Result_on_page"),
                "zeroRecords": "Nothing found - sorry",
                "info": trls("Show_page")+" _PAGE_ "+trls('Results_of')+" _PAGES_",
                "infoEmpty": "No records available",
                "infoFiltered": "(filtered from _MAX_ total records)",
                "search": trls('Search'),
                "paginate": {
                  "previous": trls('Previous'),
                  "next": trls('Next')
                }
            },
              "searching": false,
              "dom": 't<"bottom-datatable" lip>'
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

    getProductGroup = () =>{
      var headers = SessionManager.shared().getAuthorizationHeader();
      Axios.get(API.GetProductGroup, headers)
      .then(result => {
        if(this._isMounted){
          this.setState({Productgroup: result.data.Items})
        }
      });
    }

    loadProductDetail = (id) => {
     this.setState({slideproductDetailFlag: true, productId: id});
     Common.showSlideForm();
    }

    copyProduct = (data) => {
      let copyData = data;
      let customerData = this.state.Customer.filter(item => item.key===data.CustomerCode.trim());
      let supplierData = this.state.Supplier.filter(item => item.key===data.SupplierCode.trim());
      copyData.defaultCustomer = { "value": customerData[0].key, "label": customerData[0].value};
      copyData.defaultSupplier = { "value": supplierData[0].key, "label": supplierData[0].value};
      copyData.defaultProductgroup = { "value": data.ProductGroupCode.trim(), "label": data.Productgroup};
      copyData.defaultSalesUnit = { "value": data.SalesUnitCode, "label": data.SalesUnit};
      copyData.defaultPurchaseUnit = { "value": data.PurchaseUnitCode, "label": data.PurchaseUnit};
      copyData.defaultApprove = { "value": data.Approver, "label": data.ApproverUserName};
      this.setState({copyFlag: 0, copyProduct: copyData, slideFormFlag: true});
      Common.showSlideForm();
    }

    addProduct = () => {
      this.setState({copyProduct: '', copyFlag: 1, slideFormFlag: true});
      Common.showSlideForm();
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
                      <Button variant="primary" onClick={()=>this.addProduct()}><i className="fas fa-plus add-icon"></i>{trls("Add_Product")}</Button>   
                      <div className="has-search">
                          <span className="fa fa-search form-control-feedback"></span>
                          <Form.Control className="form-control" type="text" name="search" placeholder={trls("Quick_search")}/>
                      </div>
                </div>
                <div className="table-responsive">
                      <table id="project_table" className="place-and-orders__table table" width="100%">
                        <thead>
                            <tr>
                                <th>{trls("Productcode")}</th>
                                <th style={{width: 100}}>{trls("Supplier")}</th>
                                <th>{trls("Product")}</th>
                                <th>{trls("Customer")}</th>
                                <th>{trls("Product_Name")}</th>
                                <th>{trls("Sales_Price")}</th>
                                <th>{trls("Purchase_Price")}</th>
                                <th>{trls("Sales_Unit")}</th>
                                <th>{trls("Purchase_Unit")}</th>
                                <th>{trls("Kilogram")}</th>
                                <th>{trls("Copy_Product")}</th>
                            </tr>
                        </thead>
                        {productData && !this.state.loading&&(<tbody>
                            {
                              productData.map((data,i) =>(
                              <tr id={data.id} key={i}>
                                  <td>
                                    <div id={data.id} style={{cursor: "pointer", color:'#004388', fontSize:"14px", fontWeight:'bold'}} onClick={()=>this.loadProductDetail(data.id)}>{data.Productcode}</div>
                                  </td>
                                  <td>
                                      {data.Supplier}
                                  </td>
                                  <td>{data.Product}</td>
                                  <td>{data.Customer}</td>
                                  <td>{data.Product}</td>
                                  <td>{data.SalesPrice}</td>
                                  <td>{data.PurchasePrice}</td>
                                  <td>{data.SalesUnit}</td>
                                  <td>{data.PurchaseUnit}</td>
                                  <td>{data.Kilogram}</td>
                                  <td>
                                    <Row style={{justifyContent:"center"}}>
                                      <Button id={data.id} variant="light" onClick={()=>this.copyProduct(data)}><i className="fas fa-copy add-icon" ></i>{trls('Copy')}</Button>
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
            {this.state.slideFormFlag ? (
              <Productform
                onHide={() => this.setState({slideFormFlag: false})}
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
                customercode={this.state.CustomerCode}
                onShowProductDetail={(productId)=>this.loadProductDetail(productId)}
              />
            ): null}
            {this.state.slideproductDetailFlag ? (
              <Productdetail
                onHide={() => this.setState({slideproductDetailFlag: false})}
                productid={this.state.productId}
              />
            ): null}
            
        </div>
      )
    };
  }
  export default connect(mapStateToProps, mapDispatchToProps)(Product);
