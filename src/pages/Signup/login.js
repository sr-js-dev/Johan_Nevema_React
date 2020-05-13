import { Link } from 'react-router-dom';
import React from 'react';
import * as authAction  from '../../actions/authAction';
import { connect } from 'react-redux';
import { Row, Col, Form, Button } from 'react-bootstrap';
import ListErrors from '../../components/listerrors';
import { trls } from '../../components/translate';
import Pageloadspiiner from '../../components/page_load_spinner';

const mapStateToProps = state => ({ ...state.auth });

const mapDispatchToProps = dispatch => ({
    authLogin: (params) =>
              dispatch(authAction.fetchLoginData(params)),
});

class Login extends React.Component {
//   constructor() {   
//     super();
//     };
  handleSubmit = (event) => {
    event.preventDefault();
    const clientFormData = new FormData(event.target);
    const data = {};
    for (let key of clientFormData.keys()) {
        data[key] = clientFormData.get(key);
    }
    this.props.authLogin(data);
  }
  render() {
    
    return (
      // <div className="auth-page" style={{height:"100%"}}>
      //   <div className="container login-page">
      //     <div className="row addQuestion">
      //       <div className="col-md-5 offset-md-1 col-xs-12  vertical-center">
      //           <Row style={{height:"100%",width:"100%"}}>
      //             <div className="login-side-div">
      //               <img src={require('../../assets/images/img_admin_side.png')} alt="appzmakerz" className="login-side-grad"></img>
      //             </div>
      //             <Col  className="login-form-div">
      //               <img src={require('../../assets/images/appmakerz.svg')} alt="appzmakerz" style={{marginTop:"80px"}}></img>
                    
      //                <form className="login-form" onSubmit = { this.handleSubmit }>
      //                <ListErrors errors={this.props.error} />
      //                   <fieldset>  
      //                       <fieldset className="form-group">
      //                           <input type="text" name="username" className="orders__filters-search input-email" placeholder={trls("Username")}/>
      //                       </fieldset>
      //                       <fieldset className="form-group">
      //                           <input type="password" name="password" className="orders__filters-search input-password" placeholder={trls("Password")}/>
      //                       </fieldset>
      //                       <p className="text-xs-center">
      //                           <Link to="/register" style={{color:"rgb(84, 79, 79)"}}>
      //                             {trls("Forgot_password")}
      //                           </Link>
      //                       </p>
      //                       <button type="submit" className="btn-small place-and-orders__add-row-btn add-row sign-in">{trls("Sign_in")}</button>
      //                   </fieldset>
      //               </form>
      //             </Col>
      //           </Row>
      //       </div>
      //     </div>
      //   </div>
      //   <Pageloadspiiner/>
      // </div>
      <div className="container auth-page">
        <div className="col-xl-5 col-lg-7 col-md-12  vertical-center">
            <Row>
              <div className="login-side-div">
                <img src={require('../../assets/images/img_admin_side.png')} alt="appzmakerz" className="login-side-grad"></img>
              </div>
              <Col>
                <div className="app-maker__image">
                  <img src={require('../../assets/images/appmakerz.svg')} alt="appzmakerz"></img>
                </div>
                <Form className="container login-form" onSubmit = { this.handleSubmit }>
                    <Form.Group controlId="form">
                        <Col className="login-form__control">
                          <Form.Control type="text" name="username" className="login-input-email" placeholder={trls("Email")}/>
                          <label className="placeholder-label__login">{trls('Email')}</label>
                        </Col>
                    </Form.Group>
                    <Form.Group controlId="form">
                        <Col className="login-form__control">
                          <Form.Control type="password" name="password" className="login-input-password" placeholder={trls("Password")}/>
                          <label className="placeholder-label__login">{trls('Password')}</label>
                        </Col>
                    </Form.Group>
                    <Form.Group controlId="form">
                        <Form.Check type="checkbox" label="Remember me" style={{color: '#B9C0CE'}} onChange={(evt)=>this.changeShowPrice(evt)}/>
                    </Form.Group>
                    <Button variant="primary" type="submit" style={{width: "100%", height: 42}} onClick={()=>this.setState({modalResumeShow: true})}>{trls('Sign_in')}</Button>
                    <p className="text-xs-center" style={{marginTop: 10}}>
                        <Link to="/forgot-password" className="back-to_signin">
                            {trls("Forgot_password")}
                        </Link>
                    </p>
                    <ListErrors errors={this.props.error} />
                </Form>
              </Col>
            </Row>
        </div>
        <Pageloadspiiner/>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
