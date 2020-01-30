import React, {Component} from 'react'
import { Form,Row } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import Adduserform from './adduserform';
import $ from 'jquery';
import SessionManager from '../../components/session_manage';
import API from '../../components/api'
import Axios from 'axios';
import { BallBeat } from 'react-pure-loaders';
import { getUserToken } from '../../components/auth';
import { trls } from '../../components/translate';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import 'datatables.net';

const mapStateToProps = state => ({ ...state.auth });

const mapDispatchToProps = dispatch => ({
    
});
class Userregister extends Component {
    _isMounted = false
    constructor(props) {
        super(props);
        this.state = {  
            userData:[],
            flag:'',
            userUpdateData:[],
            loading:true
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
        Axios.get(API.GetUserData, headers)
        .then(result => {
            if(this._isMounted){
                this.setState({userData:result.data})
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
    componentWillReceiveProps() {
        $('#example').dataTable().fnDestroy();
        $('#example').dataTable(
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
    userUpdate = (event) => {
        let userID=event.currentTarget.id;
        var settings = {
            "url": API.GetUserDataById+event.currentTarget.id,
            "method": "GET",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+getUserToken(),
        }
        }
        $.ajax(settings).done(function (response) {
        })
        .then(response => {
            this.setState({userUpdateData: response})
            this.setState({modalShow:true, mode:"update",userID:userID, flag:true})
        });
    }
    viewUserData = (event) => {
        this._isMounted = true;
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.get(API.GetUserDataById+event.currentTarget.id, headers)
        .then(result => {
            if(this._isMounted){
                this.setState({userUpdateData: result.data})
                this.setState({modalShow:true, mode:"view", flag:true})
            }
        });
    }
    userDelete = () => {
        var headers = SessionManager.shared().getAuthorizationHeader();
        Axios.delete("https://cors-anywhere.herokuapp.com/"+API.DeleteUserData+this.state.userId, headers)
        .then(result => {
            this.setState({loading:true})
            this.getUserData();               
        });
    }
    userDeleteConfirm = (event) => {
        this.setState({userId:event.currentTarget.id})
        confirmAlert({
            title: 'Confirm',
            message: 'Are you sure to do this.',
            buttons: [
              {
                label: 'Delete',
                onClick: () => {
                   this.userDelete()
                }
              },
              {
                label: 'Cancel',
                onClick: () => {}
              }
            ]
          });
    }
    render () {
        let userData=this.state.userData;
        let optionarray = [];
        if(userData){
            userData.map((data, index) => {
                if(data.IsActive){
                    optionarray.push(data);
                }
              return userData;
            })
        }
        return (
            <div className="order_div">
                <div className="content__header content__header--with-line">
                    <h2 className="title">{trls('Users')}</h2>
                </div>
                <div className="orders">
                    <div className="orders__filters justify-content-between">
                        <Form inline style={{width:"100%"}}>
                            <Button variant="primary" onClick={()=>this.setState({modalShow:true, mode:"add", flag:false})}>{trls('Add_User')}</Button> 
                            <Adduserform
                                show={this.state.modalShow}
                                mode={this.state.mode}
                                onHide={() => this.setState({modalShow: false})}
                                onGetUser={() => this.getUserData()}
                                userUpdateData={this.state.userUpdateData}
                                userID={this.state.userID}
                            />  
                        </Form>
                    </div>
                    <div className="table-responsive credit-history">
                        <table id="example" className="place-and-orders__table table table--striped prurprice-dataTable" width="100%">
                        <thead>
                            <tr>
                                <th>{trls('UserName')}</th>
                                <th>{trls('Email')}</th>
                                <th>{trls('Active')}</th>
                                <th>{trls('Action')}</th>
                            </tr>
                        </thead>
                        {optionarray && !this.state.loading &&(<tbody >
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
    
  export default connect(mapStateToProps, mapDispatchToProps)(Userregister);
