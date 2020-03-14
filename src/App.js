import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {InfoBox} from "./components/ui";
import countries from "./constants/countries";

import {Container, Row, Col, Dropdown, Jumbotron} from 'react-bootstrap';

class App extends Component {
  state = {
    selected:null,
    world:null,
    stats: null
  }

  componentWillMount(){
    this.getWorldData();
  }

  getWorldData = async ()=>{

    try{
      const response = await fetch("https://covid19.mathdro.id/api");
      const data = await response.json();
      let payload = {
        confirmed: data.confirmed.value,
        recovered: data.recovered.value,
        deaths: data.deaths.value
      }
      this.setState({world: payload, stats: payload})
    }catch(err){
      let payload = {
        confirmed: 0,
        recovered: 0,
        deaths: 0
      }
      this.setState({world: payload, stats: payload})
    }
    
  }

  _handleSelect = async country =>{
    this.setState({selected: country});
    if (!country) return this.setState({stats: this.state.world});

    try{
      const response = await fetch("https://covid19.mathdro.id/api/countries/"+countries[country]);
      const data = await response.json();
      let payload = {
        confirmed: data.confirmed.value,
        recovered: data.recovered.value,
        deaths: data.deaths.value
      }
  
      this.setState({stats: payload})
    }catch(err){
      let payload = {
        confirmed: 0,
        recovered: 0,
        deaths: 0
      }
      this.setState({stats: payload})
    }
    

  }


  
  render (){
    const {selected, stats} = this.state;

    if (!stats) return null;
    return (
      <>
      <Jumbotron fluid className="text-center">
        <h1>COVID-19 IN NUMBERS</h1>
        
      </Jumbotron>
      <Container className="mb-5">
        
        
        <Row className="justify-content-center  mt-2">
          <Col md={3} className="justify-content-center align-items-center text-center">
          <Dropdown>
          <Dropdown.Toggle variant="info" id="dropdown-basic">
            SELECT A COUNTRY
          </Dropdown.Toggle>

          <Dropdown.Menu
          style={{height: "30vh", overflow: "auto"}}
          >
            <Dropdown.Item
                    key={'world'}
                   eventKey={'world'} 
                   onSelect={(country)=>this._handleSelect(null)}
                   active={!selected}
                   >THE WORLD</Dropdown.Item>
          {
                Object.entries(countries).map(([country, code], index)=> (
                  <Dropdown.Item
                  key={index}
                   eventKey={country} 
                   onSelect={(country)=>this._handleSelect(country)}
                   active={selected===country}
                   >{country}</Dropdown.Item>
                ))
              }
          </Dropdown.Menu>
        </Dropdown>

              
             
            
          
          </Col>
        </Row>
        <Row>
          <Col className="mt-4 text-center">
          <h4>{`${selected || 'THE WORLD'}`}</h4>
          </Col>
        </Row>
        <Row className="justify-content-between">
          
          <InfoBox
          bg='warning'
          
          title="confirmed"
          number={stats.confirmed}
          />
           <InfoBox
          bg='success'
          
          title="recovered"
          number={stats.recovered}
          rate={stats.confirmed>0 ? (stats.recovered/stats.confirmed) : 0}
          />
           <InfoBox
          bg='danger'
          
          title="deaths"
          number={stats.deaths}
          rate={stats.confirmed>0 ? (stats.deaths/stats.confirmed) : 0}
          />
          
          
        </Row>
      </Container>
      <footer className="container-fluid">
        <nav className="navbar fixed-bottom footer-style justify-content-center">
          {` Mustafa Ay  @2020 `}
        </nav>
      </footer>
      </>
    );
  }
  
}

export default App;
