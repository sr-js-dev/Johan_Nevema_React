import React, {Component} from 'react'
import { connect } from 'react-redux';
import $ from 'jquery';
import { BallBeat } from 'react-pure-loaders';
import { Button, Form, Row, Spinner } from 'react-bootstrap';
// import  Taskupdate  from './taskupdate_form'
import { trls } from '../../components/translate';
import 'datatables.net';
import SessionManager from '../../components/session_manage';
import API from '../../components/api'
import Axios from 'axios';
import history from '../../history';
import Select from 'react-select';
import * as Common from '../../components/common';
import FlashMassage from 'react-flash-message'

const mapStateToProps = state => ({
     ...state.auth,
});

const mapDispatchToProps = dispatch => ({

}); 
class Taskoverview extends Component {
    _isMounted = false
    constructor(props) {
        super(props);
        this.state = {  
            loading:true,
            qualityData:[],
            showModeList: [{"value": "1", "label": "Show all"}, {"value": "2", "label": "Show just not completed"}, {"value": "3", "label": "Show just completed "}],
            showMode: "2",
            exactFlag: false,
            sendingFlag: false,
        };
      }
componentDidMount() {
    this.getQualityData();
}

detailmode = () =>{
    this.setState({taskId: ""})
}

getQualityData = () => {
    this.setState({loading:true})
    var header = SessionManager.shared().getAuthorizationHeader();
    Axios.get(API.GetQualityControl, header)
    .then(result => {
        this.setState({qualityData:result.data.Items})
        this.setState({loading:false})
        $('#example-task').dataTable().fnDestroy();
        $('#example-task').DataTable(
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
componentWillUnmount() {
}

loadSalesDetail = (data)=>{
    var header = SessionManager.shared().getAuthorizationHeader();
        Axios.get(API.GetCustomerData, header)
        .then(result => {
            let customerData = result.data.Items;
            let customerCode = '';
            customerData.map((customer, index)=>{
                if(customer.value===data.customer){
                    customerCode = customer.key;
                }
                return customerData;
            });
            Axios.get(API.GetSuppliersDropdown, header)
            .then(result => {
                let supplierData = result.data.Items;
                let supplierCode = '';
                supplierData.map((supplier, index)=>{
                    if(supplier.value===data.supplier){
                        supplierCode = supplier.key;
                    }
                    return supplierData;
                });
                history.push({
                    pathname: '/sales-order-detail',
                    state: { newId: data.Id, customercode:customerCode, suppliercode: supplierCode, newSubmit:true, quality: true}
                })
            });
          });
}

completeOrder = (id) => {
    this.setState({sendingFlag: true, exactFlag: false})
    let params = []
    var headers = SessionManager.shared().getAuthorizationHeader();
    params = {
        salesid: id
    }
    Axios.post(API.PostSalesOrderExact, params, headers)
        .then(result => {
            Axios.get(API.GenerateProductXmlExact, headers)
            .then(result => {
                Axios.post(API.PostSalesOrderExactSend, params, headers)
                .then(result => {
                    params = {id: id}
                    Axios.post(API.CompleteOrder , params, headers)
                    .then(result => {
                        this.setState({exactFlag: true, sendingFlag: false});
                        this.getQualityData();
                    });
                });
            });
        });
    
}

changeShowMode = (value) =>{
    this.setState({showMode: value});
    this.getQualityData();
}

render () {
    let qualityData = this.state.qualityData
    qualityData.sort(function(a, b) {
        return a.id - b.id;
    });
    let optionarray = [];
    if(this.state.showMode==="2"){
        if(qualityData){
            qualityData.map((data, index) => {
                if(!data.isCompleted){
                    optionarray.push(data);
                }
                return qualityData;
            })
        }
    }else if(this.state.showMode==="3"){
        if(qualityData){
            qualityData.map((data, index) => {
                if(data.isCompleted){
                    optionarray.push(data);
                }
                return qualityData;
            })
        }
    }else{
        optionarray = qualityData;
    }
    return (
        <div className="order_div">
            <div className="content__header content__header--with-line">
                <h2 className="title">{trls('Quality')}</h2>
            </div>
             {this.state.exactFlag&&(
                    <div style={{marginLeft: 20}}>
                        <FlashMassage duration={2000}>
                            <div className="alert alert-success" style={{marginTop:10}}>
                                <strong><i className="fas fa-check-circle"></i> Success!</strong>
                            </div>
                        </FlashMassage>
                    </div>
                )
                }
                {this.state.sendingFlag&&(
                    <div style={{marginTop:10, marginLeft: 20}}><Spinner animation="border" variant="info"/><span style={{marginTp:10, fontWeight: "bold", fontSize: 16}}> {trls('Sending')}...</span></div>
                )}
            <div className="orders">
                <div className="orders__filters justify-content-between">
                    <Form inline style={{width:"100%"}}>
                        <Select
                            name="filter"
                            options={this.state.showModeList}
                            className="select-show-class"
                            onChange={val => this.changeShowMode(val.value)}
                            defaultValue={{"value": "2", "label":"Show just not completed"}}
                        />
                    </Form>
                </div>
                <div className="table-responsive purchase-order-table">
                    <table id="example-task" className="place-and-orders__table table table--striped prurprice-dataTable" width="100%">
                        <thead>
                            <tr>
                                <th>{trls('Id')}</th>
                                <th>{trls('Supplier')}</th>
                                <th>{trls('Customer')}</th>
                                <th>{trls('Purchase_Amount')}</th>
                                <th>{trls('Sales_Amount')}</th>
                                <th>{trls('Complete')}</th>
                            </tr>
                        </thead>
                        {optionarray && !this.state.loading &&(<tbody >
                            {
                                optionarray.map((data,i) =>(
                                <tr id={data.id} key={i}>
                                    <td><div id={data.id} style={{cursor: "pointer", color:'#004388', fontSize:"14px", fontWeight:'bold'}} onClick={()=>this.loadSalesDetail(data)}>{data.Id}</div></td>
                                    <td>{data.supplier}</td>
                                    <td>{data.customer}</td>
                                    <td>{Common.formatMoney(data.PurchaseAmount)}</td>
                                    <td>{Common.formatMoney(data.SalesAmount)}</td>
                                    <td>
                                        <Row style={{justifyContent:"center"}}>
                                            {!data.isCompleted?(
                                                <Button type="submit" style={{width:"100px", height: 35}} onClick={()=>this.completeOrder(data.Id)}>{trls('Complete')}</Button>
                                            ):<Button type="submit" disabled style={{width:"100px", height: 35}}>{trls('Complete')}</Button>}
                                            
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
export default connect(mapStateToProps, mapDispatchToProps)(Taskoverview);
