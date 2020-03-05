import React, {Component} from 'react'
import { connect } from 'react-redux';
import $ from 'jquery';
import { BallBeat } from 'react-pure-loaders';
import { Button, Form, Row, Spinner, Col } from 'react-bootstrap';
import { trls } from '../../components/translate';
import 'datatables.net';
import SessionManager from '../../components/session_manage';
import API from '../../components/api'
import Axios from 'axios';
import Select from 'react-select';
import * as Common from '../../components/common';
import FlashMassage from 'react-flash-message'
import DatePicker from "react-datepicker";
import Salesdetailfrom from "../Sales/salesorder_detailform";

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
            showModeList: [{"value": "1", "label": trls('Show_all')}, {"value": "2", "label": trls('Show_just_not_completed')}, {"value": "3", "label": trls('Show_just_completed')}],
            showMode: "2",
            exactFlag: false,
            sendingFlag: false,
            originQualityData: [],
            showModeData: [],
            fistFilterWeek: 0,
            secondFilterWeek: 0,
            firstFilterDate: new Date(),
            secondFilterDate: new Date(),
            filterDateFlag: false,
            filterWeekFlag: false,
            orderId: '',
            customerCode: '',
            supplierCode: '',
            detailFlag: ''
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
        let optionarray = [];
        if(result.data.Items){
            result.data.Items.map((data, index) => {
                if(!data.isCompleted){
                    optionarray.push(data);
                }
                return data;
            })
        }
        this.setState({originQualityData: result.data.Items, qualityData: optionarray, showModeData: optionarray, loading: false})
        // if(!this.state.exactFlag){
        //     $('#example-task thead tr').clone(true).appendTo( '#example-task thead' );
        //     $('#example-task thead tr:eq(1) th').each( function (i) {
        //         $(this).html( '<input type="text" class="search-table-input" style="width: 100%" placeholder="Search" />' );
        //         $(this).addClass("sort-style");
        //         $( 'input', this ).on( 'keyup change', function () {
        //             if ( table.column(i).search() !== this.value ) {
        //                 table
        //                     .column(i)
        //                     .search( this.value )
        //                     .draw();
        //             }
        //         } );
        //     } );
        // }
        // $('#example-task').dataTable().fnDestroy();
            $('#example-task').DataTable(
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
    });
}

componentWillUnmount() {
}

loadSalesDetail = (data)=>{
    this.setState({orderId: data.Id, customerCode: data.customercode, supplierCode: data.suppliercode, detailFlag: true, modalShow: true})
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
        params = {id: id}
        Axios.post(API.CompleteOrder , params, headers)
        .then(result => {
            this.setState({exactFlag: true, sendingFlag: false}, ()=>{
                this.getQualityData();
            });
            
        });
    });
    
}

changeShowMode = (value) =>{
    this.setState({showMode: value}, ()=>{
        let optionarray = [];
        if(this.state.showMode==="2"){
            if(this.state.originQualityData){
                this.state.originQualityData.map((data, index) => {
                    if(!data.isCompleted){
                        optionarray.push(data);
                    }
                    return data;
                })
            }
        }else if(this.state.showMode==="3"){
            if(this.state.originQualityData){
                this.state.originQualityData.map((data, index) => {
                    if(data.isCompleted){
                        optionarray.push(data);
                    }
                    return data;
                })
            }
        }else{
            optionarray = this.state.originQualityData;
        }
        
        this.setState({
            qualityData: optionarray, 
            showModeData: optionarray,
            fistFilterWeek: 0,
            secondFilterWeek: 0,
            firstFilterDate: new Date(),
            secondFilterDate: new Date(),
            filterDateFlag: false,
            filterWeekFlag: false
        });
    });
}

onChangeWeeks = (evt, mode) => {
    if(mode==='first'){
        this.setState({fistFilterWeek: evt.target.value, filterWeekFlag: true}, () => {
            this.filterData();
        })
    }else{
        this.setState({secondFilterWeek: evt.target.value, filterWeekFlag: true}, () => {
            this.filterData();
        })
    }
}

onChangeDateFilter = (date, mode) => {
    if(mode==="first"){
        this.setState({firstFilterDate: date, filterDateFlag: true}, ()=>{
            this.filterData();
        })
    }else{
        this.setState({secondFilterDate: date, filterDateFlag: true}, ()=>{
            this.filterData();
        })
    }
}

filterData = () => {
    let qualityData = [];
    let showModeData = this.state.showModeData;
    if(this.state.fistFilterWeek<=this.state.secondFilterWeek){
        this.state.showModeData.map((val, key) => {
            if(this.state.filterDateFlag && this.state.filterWeekFlag){
                if(this.state.secondFilterWeek>=val.Loadingweek && this.state.fistFilterWeek<=val.Loadingweek && new Date(this.state.firstFilterDate)<=new Date(val.Loadingdate) && new Date(this.state.secondFilterDate)>=new Date(val.Loadingdate)){
                    qualityData.push(val)
                }
            }else if(this.state.filterDateFlag&&!this.state.filterWeekFlag){
                if(new Date(this.state.firstFilterDate)<=new Date(val.Loadingdate) && new Date(this.state.secondFilterDate)>=new Date(val.Loadingdate)){
                    qualityData.push(val)
                }
            }else if(!this.state.filterDateFlag&&this.state.filterWeekFlag){
                if(this.state.secondFilterWeek>=val.Loadingweek && this.state.fistFilterWeek<=val.Loadingweek){
                    qualityData.push(val)
                }
            }
            
            return val;  
        })
        this.setState({qualityData: qualityData});
    }else{
        this.setState({qualityData: showModeData});
    }
}

render () {
    let qualityData = this.state.qualityData
    qualityData.sort(function(a, b) {
        return a.id - b.id;
    });
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
                <Row className="order_filter">
                    <Col xl={3} style={{paddingLeft: 0, paddingTop: 10}}>
                        <Select
                            name="filter"
                            options={this.state.showModeList}
                            className="select-show-class"
                            onChange={val => this.changeShowMode(val.value)}
                            defaultValue={{"value": "2", "label":trls('Show_just_not_completed')}}
                        />
                    </Col>
                    <Col xl={4} style={{display: "flex", marginRight: 30, paddingLeft: 0, paddingTop: 10}}>
                        <span style={{marginTop:6}}>{trls('Week')}</span>
                        <div style={{display: "flex", paddingLeft: 12}}>
                            <Form.Control type="text" className="order-filter_date" value={this.state.fistFilterWeek} name="firstweek" onChange={(evt)=>this.onChangeWeeks(evt, "first")} />
                            <Form.Control type="text" className="order-filter_date" value={this.state.secondFilterWeek} name="secondweek" onChange={(evt)=>this.onChangeWeeks(evt, "second")} />
                        </div>
                    </Col>
                    <Col xl={4} style={{display: "flex", paddingLeft: 0, paddingTop: 10}}>
                        <span style={{marginTop:6}}>{trls('Date')}</span>
                        <div style={{display: "flex"}}>
                            <DatePicker name="startdate" className="myDatePicker order-filter_date" dateFormat="dd-MM-yyyy" selected={this.state.firstFilterDate} onChange={(date) =>this.onChangeDateFilter(date, 'first')} />
                            <DatePicker name="startdate" className="myDatePicker order-filter_date" dateFormat="dd-MM-yyyy" selected={this.state.secondFilterDate} onChange={(date) =>this.onChangeDateFilter(date, 'second')} />
                        </div>
                    </Col>
                </Row>
                <div className="table-responsive purchase-order-table">
                    <table id="example-task" className="place-and-orders__table table" width="100%">
                        <thead>
                            <tr>
                                <th>{trls('Id')}</th>
                                <th>{trls('Supplier')}</th>
                                <th>{trls('Customer')}</th>
                                <th>{trls('Purchase_Amount')}</th>
                                <th>{trls('Sales_Amount')}</th>
                                <th>{trls('Loading_date')}</th>
                                <th>{trls('Loading_week')}</th>
                                <th>{trls('Complete')}</th>
                            </tr>
                        </thead>
                        {qualityData && !this.state.loading &&(<tbody >
                            {
                                qualityData.map((data,i) =>(
                                <tr id={data.id} key={i}>
                                    <td><div id={data.id} style={{cursor: "pointer", color:'#004388', fontSize:"14px", fontWeight:'bold'}} onClick={()=>this.loadSalesDetail(data)}>{data.Id}</div></td>
                                    <td>{data.supplier}</td>
                                    <td>{data.customer}</td>
                                    <td>{Common.formatMoney(data.PurchaseAmount)}</td>
                                    <td>{Common.formatMoney(data.SalesAmount)}</td>
                                    <td>{Common.formatDate(data.Loadingdate)}</td>
                                    <td>{data.Loadingweek}</td>
                                    <td>
                                        <Row style={{justifyContent:"center"}}>
                                            {!data.isCompleted && data.referencecustomer!=="" && !data.Temporary?(
                                                <Button type="submit" style={{width:"auto", height: 35}} onClick={()=>this.completeOrder(data.Id)}>{trls('Send_salesinvoice')}</Button>
                                            ):
                                                <Button type="submit" disabled style={{width:"auto", height: 35}}>{trls('Send_salesinvoice')}</Button>
                                            }
                                            
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
                    <Salesdetailfrom
                        show={this.state.modalShow}
                        onHide={() => this.setState({modalShow: false})}
                        onSetDetailFlag={()=>this.setState({detailFlag: false})}
                        detailflag={this.state.detailFlag}
                        orderid={this.state.orderId}
                        customercode={this.state.customerCode}
                        suppliercode={this.state.supplierCode}
                    />
                </div>
            </div>
        </div>
    )
};
}
export default connect(mapStateToProps, mapDispatchToProps)(Taskoverview);
