import React, {Component} from 'react'
import { connect } from 'react-redux';
import $ from 'jquery';
import { BallBeat } from 'react-pure-loaders';
import { Button, Form, Row } from 'react-bootstrap';
import  Taskupdate  from './taskupdate_form'
import { trls } from '../../components/translate';
import 'datatables.net';
import SessionManager from '../../components/session_manage';
import API from '../../components/api'
import Axios from 'axios';

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
            taskOverviewData:[],
            text: 1111
        };
      }
componentDidMount() {
    this.getTaskData();
}

getUpdateTaskData = (event) => {
        
    this._isMounted = true;
    let taskid=event.currentTarget.id;
    let params = {
        taskid:taskid
    }
    var headers = SessionManager.shared().getAuthorizationHeader();
    Axios.post(API.GetTaskById, params, headers)
    .then(result => {
        if(this._isMounted){    
            this.setState({updateTask: result.data.Items})
            this.setState({modalupdateShow:true, taskId: taskid})
        }
    });
}

detailmode = () =>{
    this.setState({taskId: ""})
}

getTaskData = () => {
    var header = SessionManager.shared().getAuthorizationHeader();
    Axios.get(API.GetTasks, header)
    .then(result => {
        this.setState({taskOverviewData:result.data.Items})
        this.setState({loading:false})
        $('#example-task').dataTable().fnDestroy();
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

render () {
    let taskOverviewData = this.state.taskOverviewData
    taskOverviewData.sort(function(a, b) {
        return a.id - b.id;
    });
    return (
        <div className="order_div">
            <div className="content__header content__header--with-line">
                <h2 className="title">{trls('Task_Overview')}</h2>
            </div>
            <div className="orders">
                <div className="orders__filters justify-content-between">
                    <Button variant="primary" onClick={()=>this.setState({modalShow:true})}><i className="fas fa-plus add-icon"></i>{trls('Add_Task')}</Button> 
                    <div className="has-search">
                        <span className="fa fa-search form-control-feedback"></span>
                        <Form.Control className="form-control" type="text" name="number"placeholder={trls("Quick_search")}/>
                    </div>
                </div>
                <div className="table-responsive purchase-order-table">
                    <table id="example-task" className="place-and-orders__table table" width="100%">
                        <thead>
                            <tr>
                                <th>{trls('Id')}</th>
                                <th>{trls('Tasktype')}</th>
                                <th>{trls('Subject')}</th>
                                <th>{trls('TaskStatus')}</th>
                                <th>{trls('User')}</th>
                                <th>{trls('Action')}</th>
                            </tr>
                        </thead>
                        {taskOverviewData && !this.state.loading &&(<tbody >
                            {
                                taskOverviewData.map((data,i) =>(
                                <tr id={data.id} key={i}>
                                    <td>{i+1}</td>
                                    <td>{data.Tasktype}</td>
                                    <td>{data.subject}</td>
                                    <td>{data.TaskStatus}</td>
                                    <td>{data.User}</td>
                                    <td>
                                        <Row style={{justifyContent:"center"}}>
                                            <Button id={data.id} variant="light" onClick={()=>this.getUpdateTaskData()} className="action-button"><i className="fas fa-pen add-icon"></i>{trls('Edit')}</Button>
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
            <Taskupdate
                show={this.state.modalupdateShow}
                onHide={() => this.setState({modalupdateShow: false})}
                taskUpdateData={this.state.updateTask}
                taskId={this.state.taskId}
                detailmode={this.detailmode}
                onGetTaskData={this.getTaskData}
            />
        </div>
    )
};
}
export default connect(mapStateToProps, mapDispatchToProps)(Taskoverview);
