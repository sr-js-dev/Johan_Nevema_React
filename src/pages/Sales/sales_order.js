import React, {Component} from 'react'
import { connect } from 'react-redux';
import $ from 'jquery';
import { BallBeat } from 'react-pure-loaders';
import { Button, Form } from 'react-bootstrap';
import  Salesform  from './salesform'
import { trls } from '../../components/translate';
import 'datatables.net';
import SessionManager from '../../components/session_manage';
import API from '../../components/api'
import Axios from 'axios';
import history from '../../history';
import * as Common  from '../../components/common';

const mapStateToProps = state => ({
     ...state.auth,
});

const mapDispatchToProps = dispatch => ({

}); 
class Salesorder extends Component {
    _isMounted = false
    constructor(props) {
        super(props);
        this.state = {  
            loading:true,
            salesData:[]
        };
      }
componentDidMount() {
    this.getsalesData();
}

getsalesData = () => {
    var header = SessionManager.shared().getAuthorizationHeader();
    Axios.get(API.GetSalesData, header)
    .then(result => {
        console.log('123123123', result)
        this.setState({salesData:result.data.Items})
        this.setState({loading:false})
        $('#example').dataTable().fnDestroy();
        $('#example').DataTable(
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
    });
}

loadSalesDetail = (data)=>{
    var header = SessionManager.shared().getAuthorizationHeader();
        Axios.get(API.GetCustomerData, header)
        .then(result => {
            let customerData = result.data.Items;
            let customerCode = '';
            customerData.map((customer, index)=>{
                if(customer.value===data.Customer){
                    customerCode = customer.key;
                }
                return customerData;
            });
            Axios.get(API.GetSuppliersDropdown, header)
            .then(result => {
                let supplierData = result.data.Items;
                let supplierCode = '';
                supplierData.map((supplier, index)=>{
                    if(supplier.value===data.Supplier){
                        supplierCode = supplier.key;
                    }
                    return supplierData;
                });
                history.push({
                    pathname: '/sales-order-detail',
                    state: { newId: data.id, customercode:customerCode, suppliercode: supplierCode, newSubmit:true, quality: false}
                })
            });
          });
}
render () {
    let salesData = this.state.salesData
    salesData.sort(function(a, b) {
        return a.id - b.id;
    });
    return (
        <div className="order_div">
            <div className="content__header content__header--with-line">
                <h2 className="title">{trls('Sales_Order')}</h2>
            </div>
            <div className="orders">
                <div className="orders__filters justify-content-between">
                    <Form inline style={{width:"100%"}}>
                        <Button variant="primary" onClick={()=>this.setState({modalShow:true})}>{trls('Sales_Order')}</Button>   
                        <Salesform
                            show={this.state.modalShow}
                            onHide={() => this.setState({modalShow: false})}
                            // customerData
                        />
                    </Form>
                </div>
                <div className="table-responsive purchase-order-table">
                    <table id="example" className="place-and-orders__table table table--striped prurprice-dataTable" width="100%">
                        <thead>
                            <tr>
                                <th>{trls('Customer')}</th>
                                <th>{trls('Supplier')}</th>
                                <th>{trls('Reference_customer')}</th>
                                <th>{trls('Loading_date')}</th>
                                <th>{trls('Arrival_date')}</th>
                                <th>{trls('Productcode')}</th>
                                <th>{trls('Quantity')}</th>
                                <th>{trls('PackingSlip')}</th>
                                <th>{trls('Container')}</th>
                            </tr>
                        </thead>
                        {salesData && !this.state.loading &&(<tbody >
                            {
                                salesData.map((data,i) =>(
                                <tr id={data.id} key={i}>
                                    <td>
                                        <div id={data.id} style={{cursor: "pointer", color:'#004388', fontSize:"14px", fontWeight:'bold'}} onClick={()=>this.loadSalesDetail(data)}>{data.Customer}</div>
                                    </td>
                                    <td>{data.Supplier}</td>
                                    <td>{data.referencecustomer}</td>
                                    <td>{Common.formatDate(data.loadingdate)}</td>
                                    <td>{Common.formatDate(data.arrivaldate)}</td>
                                    <td>{data.ProductCode}</td>
                                    <td>{data.Quantity}</td>
                                    <td>{data.PackingSlip}</td>
                                    <td>{data.Container}</td>
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
export default connect(mapStateToProps, mapDispatchToProps)(Salesorder);
