import React, {Component} from 'react'
// import { Form,Row } from 'react-bootstrap';
// import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import $ from 'jquery';
import SessionManager from '../../components/session_manage';
import API from '../../components/api'
import Axios from 'axios';
import { BallBeat } from 'react-pure-loaders';
// import { getUserToken } from '../../components/auth';
import { trls } from '../../components/translate';
import 'datatables.net';

const mapStateToProps = state => ({ ...state.auth });

const mapDispatchToProps = dispatch => ({
    
});
class Demurragemanage extends Component {
    _isMounted = false
    constructor(props) {
        super(props);
        this.state = {  
            demurrageData: []
        };
      }
    componentDidMount() {
        this._isMounted=true
        this.getUserData()
    }
    componentWillUnmount() {
        this._isMounted = false
    }
    getUserData () {
        this._isMounted = true;
        this.setState({loading:true})
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.get(API.GetDemurrage, headers)
        .then(result => {
            if(this._isMounted){
                this.setState({demurrageData: result.data.Items})
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
            }
        });
    }

    render () {
        return (
            <div className="order_div">
                <div className="content__header content__header--with-line">
                    <h2 className="title">{trls('Demurrage')}</h2>
                </div>
                <div className="orders demurrage-manage">
                    <div className="table-responsive credit-history">
                        <table id="example" className="place-and-orders__table table table--striped prurprice-dataTable" width="100%">
                        <thead>
                            <tr>
                                <th>{trls('Supplier')}</th>
                                <th>{trls('Productcode')}</th>
                                <th>{trls('Arrival_date')}</th>
                                <th>{trls('Packing_date')}</th>
                            </tr>
                        </thead>
                        {/* {optionarray && !this.state.loading &&(<tbody >
                            {
                                optionarray.map((data,i) =>(
                                    <tr id={i} key={i}>
                                        <td>{data.UserName}</td>
                                        <td>{data.Email}</td>
                                        <td><Form.Check inline name="Intrastat" type="checkbox" disabled defaultChecked={data.IsActive} id="Intrastat" /></td>
                                        <td >
                                            <Row style={{justifyContent:"center"}}>
                                                <i id={data.Id} className="far fa-trash-alt statu-item" onClick={this.userDeleteConfirm}></i>
                                                <i id={data.Id} className="fas fa-pen statu-item" onClick={this.userUpdate} ></i>
                                                <i id={data.Id} className="far fa-eye statu-item" onClick={this.viewUserData} ></i>
                                            </Row>
                                        </td>
                                    </tr>
                            ))
                            }
                        </tbody>)} */}
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
    
  export default connect(mapStateToProps, mapDispatchToProps)(Demurragemanage);
