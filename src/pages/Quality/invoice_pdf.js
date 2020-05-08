// import React, {Component} from 'react'
// import { connect } from 'react-redux';
// import { Container, Row, Col } from 'react-bootstrap';

// const mapStateToProps = state => ({
//      ...state.auth,
// });

// const mapDispatchToProps = dispatch => ({

// }); 
// class Invoicepdf extends Component {
//     _isMounted = false
//     constructor(props) {
//         super(props);
//         this.state = {  
//         };
//       }
// componentDidMount() {
//     this._isMounted = true;
// }

// render () {
//     return (
//         <Container>
//             <Row>
//                 <Col>
//                 sdf
//                     {/* <img src={require("../../assets/images/invoice_pdf.jpg")} alt="invoice pdf"/> */}
//                 </Col>
//                 <Col className="invoice-pdf_info">
//                     <p>Sluiskade NZ 79 - 7676 SH Westerhaar - The Netherlands</p>
//                     <p>Tel: +31-(0)-524 525 123</p>
//                     <p>Fax: +31-(0)-524 524 196</p>
//                     <p>Mail: info@nevema.nl</p>
//                 </Col>
//             </Row> 
//         </Container>
//     )
// };
// }
// export default connect(mapStateToProps, mapDispatchToProps)(Invoicepdf);

import React, { Component } from 'react'
 
import PDF, { Text, AddPage, Line, Image, Table, Html } from 'jspdf-react'
 
// import OctoCatImage from './OctoCatImage'
 
const styleH1 = {
  fontSize: '15px',
  textAlign: 'right',
  color: 'red'
};
 
const invisibleStyle = {
  display: 'none',
};
 
export default class App extends Component {
  render () {
    const properties = {  format: 'a4' }
    const head = [["ID", "Name", "Country"]]
    const body = [
        [1, "Shaw", "Tanzania"],
        [2, "Nelson", "Kazakhstan"],
        [3, "Garcia", "Madagascar"],
    ]
    return (
      <React.Fragment>
        <PDF
          properties={properties}
          preview={true}
        >
            {/* <Image src={require("../../assets/images/invoice_pdf.jpg")} x={15} y={40} width={180} height={180} /> */}
            <Text x={100} y={5} size={12} color='blue'>Sluiskade NZ 79 - 7676 SH Westerhaar - The Netherlands</Text>
            <Text x={155} y={11} size={12} color='blue'>Tel: +31-(0)-524 525 123</Text>
            <Text x={154} y={17} size={12} color='blue'>Fax: +31-(0)-524 524 196</Text>
            <Text x={160} y={23} size={12} color='blue'>Mail: info@nevema.nl</Text>
            <Text x={1} y={70} size={12}>BTW-Nr. NL 001898486B01</Text>
            <Text x={100} y={80} size={12}>Jongkind B.V.</Text>
            <Text x={100} y={86} size={12}>Oosteinderweg 357</Text>
            <Text x={100} y={92} size={12}>1432 AX AALSMEER</Text>
            {/* <Image src={OctoCatImage} x={15} y={40} width={180} height={180} /> */}
            <Table
                head={head}
                body={body}
            />
            {/* <Html sourceById='page' /> */}
        </PDF>
        <div id="page">
          <h1 style={styleH1}>Source Html</h1>
            <p>
              <strong>lorem ipsumLorem </strong>Ipsum is simply dummy text of the printing and
              typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever
              since the 1500s, when an unknown printer took a galley of type and scrambled it to
              make a type specimen book. It has survived not only five centuries, but also the
              leap into electronic typesetting, remaining essentially unchanged. It was popularised
              in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages,
              and more recently with desktop publishing software like Aldus PageMaker including
              versions of Lorem Ipsum.
            </p>
        </div>
      </React.Fragment>
    )
  }
}
