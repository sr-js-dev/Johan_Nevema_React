import React, {Component} from 'react'
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import { connect } from 'react-redux';
import * as authAction  from '../../actions/authAction';
import SessionManager from '../../components/session_manage';
import API from '../../components/api'
import Axios from 'axios';
import ListErrors from '../../components/listerrors';
import { trls } from '../../components/translate';
import DraggableModalDialog from '../../components/draggablemodal';

const mapStateToProps = state => ({ 
    ...state.auth,
});
const mapDispatchToProps = (dispatch) => ({
    postUserError: (params) =>
        dispatch(authAction.dataServerFail(params)),
    removeState: () =>
        dispatch(authAction.blankdispatch()),
});
class Adduserform extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {  
            roles:[{"value":"Administrator","label":"Administrator"},{"value":"Customer","label":"Customer"}],
            selectrolvalue:"Select...",
            selectrollabel:"Select...",
            val1:'',
            selectflag:true
        };
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    componentDidMount() {
    }
    handleSubmit = (event) => {
        event.preventDefault();
        const clientFormData = new FormData(event.target);
        const data = {};
        for (let key of clientFormData.keys()) {
            data[key] = clientFormData.get(key);
        }
        if(this.props.mode==="add"){
            var params = {
                // "UserName": data.UserName,
                "Email": data.email1,
                "PhoneNumber": data.PhoneNumber,
                "password": data.password1,
                "confirmPassword": data.confirmpassword1,
                "RoleName": data.roles,
            }
            var headers = SessionManager.shared().getAuthorizationHeader();
            Axios.post(API.PostUserData, params, headers)
            .then(result => {
                this.props.onGetUser()
                this.props.onHide();
                this.setState({selectflag:true})
                this.props.removeState();
            })
            .catch(err => {
                if(err.response.data.ModelState[""]){
                    this.props.postUserError(err.response.data.ModelState[""])
                }else if(err.response.data.ModelState["model.Password"] && !err.response.data.ModelState["model.ConfirmPassword"]){
                    this.props.postUserError(err.response.data.ModelState["model.Password"])
                }else if(err.response.data.ModelState["model.ConfirmPassword"])
                    this.props.postUserError(err.response.data.ModelState["model.ConfirmPassword"])
            });
        }else{
            params = {
                "Id": this.props.userID,
                "PhoneNumber": data.PhoneNumber,
                "RoleName": data.RoleName,
            }
            headers = SessionManager.shared().getAuthorizationHeader();
            Axios.put( "https://cors-anywhere.herokuapp.com/"+API.PostUserUpdate, params, headers)
            .then(result => {
                this.props.onGetUser()
                this.props.onHide();
                this.setState({selectflag:true})
                this.props.removeState();
            })
            .catch(err => {
            });
        }
    }
    getRoles (value) {
        this.setState({selectrollabel:value.label, selectrolvalue:value.value})
        this.setState({val1:value.value})
        this.setState({selectflag:false})
    }
    render(){   
        let updateData = [];
        let roles = [];
        let roledata=''
        if(this.props.userUpdateData){
            updateData=this.props.userUpdateData;
            roles = updateData.roles;
            if(roles){
                roledata=roles[0].name;
            }
        }
        return (
            <Modal
            show={this.props.show}
            dialogAs={DraggableModalDialog}
            onHide={this.props.onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            backdrop= "static"
            centered
            >
            <Modal.Header closeButton>
                {this.props.mode==="add" ? (
                    <Modal.Title id="contained-modal-title-vcenter">
                        {trls('Add_User')}
                    </Modal.Title>
                ) : <div/>
                }
                {this.props.mode==="view" ? (
                    <Modal.Title id="contained-modal-title-vcenter">
                        {trls('View_User')}
                    </Modal.Title>
                ) : <div/>
                }
                {this.props.mode==="update" ? (
                    <Modal.Title id="contained-modal-title-vcenter">
                        {trls('Edit_User')}
                    </Modal.Title>
                ) : <div/>
                }
            </Modal.Header>
            <Modal.Body>
                { this.props.mode==="view" ? (
                    <Form className="container product-form" onSubmit = { this.handleSubmit }>
                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Form.Label column sm="3">
                            {trls('UserName')}     
                        </Form.Label>
                        <Col sm="9" className="product-text">
                            { updateData&&this.props.mode==="view" ? (
                                <Form.Control type="text" name="username" readOnly defaultValue={updateData.UserName} required placeholder={trls('UserName')} />
                            ) : <div/>
                            }
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Form.Label column sm="3">
                            {trls('Email')}     
                        </Form.Label>
                        <Col sm="9" className="product-text">
                            { updateData&&this.props.mode==="view" ? (
                                <Form.Control type="email" name="email1" readOnly defaultValue={updateData.Email} required placeholder={trls('Email')}/>
                            ) : <Form.Control type="email" name="email1" required placeholder={trls('Email')} />
                            }
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Form.Label column sm="3">
                            {trls('PhoneNumber')}     
                        </Form.Label>
                        <Col sm="9" className="product-text">
                            { updateData&&this.props.mode==="view" ? (
                                <Form.Control type="text" name="PhoneNumber" readOnly defaultValue={updateData.PhoneNumber} required placeholder={trls('PhoneNumber')}/>
                            ) : <Form.Control type="text" name="PhoneNumber" required placeholder={trls('PhoneNumber')} />
                            }
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Form.Label column sm="3">
                            {trls('Active')}     
                        </Form.Label>
                        <Col sm="9" className="product-text">
                            { updateData&&this.props.mode==="view" ? (
                                <Form.Check inline name="active" type="checkbox" disabled defaultChecked={updateData.IsActive} style={{marginTop:15}} id="Intrastat" />
                            ) : <div/>
                            }
                        </Col>
                    </Form.Group>
                </Form>
                ) : 
                <Form className="container product-form" onSubmit = { this.handleSubmit }>
                    <ListErrors errors={this.props.error} />
                    {/* {this.props.mode==="add" && (
                        <Form.Group as={Row} controlId="formPlaintextPassword">
                            <Form.Label column sm="3">
                                {trls('UserName')}     
                            </Form.Label>
                            <Col sm="9" className="product-text">
                                { updateData&&this.props.mode==="update" ? (
                                    <Form.Control type="text" name="UserName" defaultValue={updateData.UserName} required placeholder={trls('UserName')} />
                                ) : <Form.Control type="text" name="UserName" placeholder={trls('UserName')} />
                                }
                            </Col>
                        </Form.Group>
                    )
                    } */}
                    {this.props.mode==="add" && (
                        <Form.Group as={Row} controlId="formPlaintextPassword">
                            <Form.Label column sm="3">
                                {trls('Email')}     
                            </Form.Label>
                            <Col sm="9" className="product-text">
                                { updateData&&this.props.mode==="update" ? (
                                    <Form.Control type="email" name="email1" defaultValue={updateData.Email} required placeholder={trls('Email')}/>
                                ) : <Form.Control type="email" name="email1" required placeholder={trls('Email')}/>
                                }
                            </Col>
                        </Form.Group>
                    )
                    }
                    <Form.Group as={Row} controlId="formPlaintextPassword">
                        <Form.Label column sm="3">
                            {trls('PhoneNumber')}     
                        </Form.Label>
                        <Col sm="9" className="product-text">
                            { updateData&&this.props.mode==="update" ? (
                                <Form.Control type="text" name="PhoneNumber" defaultValue={updateData.PhoneNumber} required placeholder={trls('PhoneNumber')} />
                            ) : <Form.Control type="text" name="PhoneNumber" placeholder={trls('PhoneNumber')} />
                            }
                            
                        </Col>
                    </Form.Group>
                    {this.props.mode==="add" && (
                        <Form.Group as={Row} controlId="formPlaintextPassword">
                            <Form.Label column sm="3">
                                {trls('Password')}     
                            </Form.Label>
                            <Col sm="9" className="product-text">
                                
                                <Form.Control type="password" name="password1" required placeholder={trls('Password')} />
                            </Col>
                        </Form.Group>
                    )
                    }
                    {this.props.mode==="add" && (
                        <Form.Group as={Row} controlId="formPlaintextPassword">
                            <Form.Label column sm="3">
                                {trls('ConfirmPassword')}     
                            </Form.Label>
                            <Col sm="9" className="product-text">
                                <Form.Control type="password" name="confirmpassword1" required placeholder={trls('ConfirmPassword')}/>
                            </Col>
                        </Form.Group>
                    )
                    }
                    <Form.Group as={Row} controlId="formPlaintextSupplier">
                        <Form.Label column sm="3">
                            {trls('Roles')} 
                        </Form.Label>
                        <Col sm="9" className="product-text">
                            { roledata&&this.state.selectflag&&this.props.mode==="update" ? (
                                <Select
                                    name="roles"
                                    placeholder={trls('Select')}
                                    options={this.state.roles}
                                    value={{"value":roledata,"label":roledata}}
                                    onChange={val => this.getRoles(val)}
                                />
                            ) : <Select
                                    name="roles"
                                    placeholder={trls('Select')}
                                    options={this.state.roles}
                                    onChange={val => this.getRoles(val)}
                                />
                            }
                            
                            {!this.props.disabled&&this.props.mode==="add" && (
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
                    <Form.Group style={{textAlign:"center"}}>
                        <Button type="submit" style={{width:"100px"}}>{trls('Save')}</Button>
                    </Form.Group>
                </Form>
                }
                
            </Modal.Body>
            </Modal>
        );
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Adduserform);