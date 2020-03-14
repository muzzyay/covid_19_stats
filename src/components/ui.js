import React from 'react';
 


import {Card, Col} from 'react-bootstrap';


export const InfoBox = props =>(
    <Col md={4} xs={12} className="justify-content-center align-items-center mb-2">
    <Card
      bg={props.bg}
     
      text={props.textColor || 'white'}
      style={{ height:"100%" }}
      
    >
      {/* <Card.Header >{props.header}</Card.Header> */}
      <Card.Body className="text-center">
        {/* <Card.Title>{props.title.toUpperCase()} </Card.Title> */}
        <h4>{props.title.toUpperCase()} </h4>
        {/* <Card.Subtitle >
          {numberFormatter(props.number)}
        </Card.Subtitle> */}
         <h4 >
          {numberFormatter(props.number)}
        </h4>
        {
          props.title !=='confirmed'
          ?
          <Card.Text>
          {`${props.title==='deaths' ? 'Fatality': 'Recovery'} Rate: ${percentFormatter(props.rate)} %`}
        </Card.Text>
          :
          null
        }
      </Card.Body>
    </Card>
    </Col>
   
)



function numberFormatter (number){
  return new Intl.NumberFormat('en-US').format(number)
}

function percentFormatter (number){
  return Math.round(parseFloat(number*100));
}