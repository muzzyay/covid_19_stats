import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {InfoBox} from "./components/ui";
import Chart from "./components/chart";
import countries from "./constants/countries";

import {groupBy} from "lodash";

import {Container, Row, Col, Dropdown, Jumbotron} from 'react-bootstrap';

class App extends Component {
  state = {
    selected:null,
    selectedRegion: null,
    world:null,
    stats: null,
    filterValue: '',
    filterRegion:'',
    regions: {},
    ctCodes: null,
    all_data: null,
    last10days: null,
    tendays: null
  }

  componentWillMount(){
    this.getWorldData();
  }

  dataRestructure = (data, code=null)=>{
    const {selected, selectedRegion} = this.state;

    const countriesGrupedByiso = groupBy(data, 'iso2');
    
    
      let all_data = {};


      Object.entries(countriesGrupedByiso).forEach(([code, data])=>{
        
        let country = data[0].countryRegion;
        let confirmed = data.map(dt=>dt.confirmed).reduce((a,c)=>a+c,0);
        let recovered = data.map(dt=>dt.recovered).reduce((a,c)=>a+c,0); 
        let deaths = data.map(dt=>dt.deaths).reduce((a,c)=>a+c,0);
        let active = data.map(dt=>dt.active).reduce((a,c)=>a+c,0);
        let lastUpdate = data.map(dt=>dt.lastUpdate).sort((a,b)=>b-a)[0];
        let regions = data.filter(dt=>dt.provinceState).length ? data.filter(dt=>dt.provinceState) : null;

        

        all_data[code] = {
          country,
          confirmed,
          recovered,
          deaths,
          active,
          lastUpdate,
          regions
        }
      })

      let stats = {
        confirmed: Object.values(all_data).map(dt=>dt.confirmed).reduce((a,c)=>a+c,0),
        recovered: Object.values(all_data).map(dt=>dt.recovered).reduce((a,c)=>a+c,0),
        deaths: Object.values(all_data).map(dt=>dt.deaths).reduce((a,c)=>a+c,0),
        active: Object.values(all_data).map(dt=>dt.active).reduce((a,c)=>a+c,0),
        last_update: new Date(Object.values(all_data).map(dt=>dt.lastUpdate).sort((a,b)=>b-a)[0])
      }

      

      this.setState({ctCodes: Object.keys(countriesGrupedByiso), all_data, stats});

  }

  handleGraphData =(info, region=null)=>{
    const {selected, selectedRegion, tendays} = this.state;

    const payload = {...tendays}

    // console.log(country, region)

    console.log(Object.fromEntries(Object.entries(payload).map(([date, data])=>[date, data[info.country]])))

    
    let last10days = Object.keys(payload).map(key=>{
        let theObj = payload[key][info.country] || {confirmed: 0, recovered:0, deaths:0};



        return [key.slice(0,5).replace('-','/'), theObj.confirmed  , theObj.recovered, theObj.deaths];

    }).reverse();


      last10days.shift();
      last10days.unshift(["DATE", "Confirmed", "Recovered", "Deaths"])
      last10days.push(["Current", info.confirmed, info.recovered, info.deaths])

      this.setState({last10days})

  }

  getWorldData = async ()=>{


    

    try{

      

      const URL ="https://covid19.mathdro.id/api/confirmed"

      const response = await fetch(URL);
      const data = await response.json();

      const countriesGrupedByiso = groupBy(data, 'iso2');
    
    
      let all_data = {};


      Object.entries(countriesGrupedByiso).forEach(([code, data])=>{
        
        let country = data[0].countryRegion;
        let confirmed = data.map(dt=>dt.confirmed).reduce((a,c)=>a+c,0);
        let recovered = data.map(dt=>dt.recovered).reduce((a,c)=>a+c,0); 
        let deaths = data.map(dt=>dt.deaths).reduce((a,c)=>a+c,0);
        let active = data.map(dt=>dt.active).reduce((a,c)=>a+c,0);
        let lastUpdate = data.map(dt=>dt.lastUpdate).sort((a,b)=>b-a)[0];
        let regions = data.filter(dt=>dt.provinceState).length ? data.filter(dt=>dt.provinceState) : null;

        

        all_data[code] = {
          country,
          confirmed,
          recovered,
          deaths,
          active,
          lastUpdate,
          regions
        }
      })

      let stats = {
        confirmed: Object.values(all_data).map(dt=>dt.confirmed).reduce((a,c)=>a+c,0),
        recovered: Object.values(all_data).map(dt=>dt.recovered).reduce((a,c)=>a+c,0),
        deaths: Object.values(all_data).map(dt=>dt.deaths).reduce((a,c)=>a+c,0),
        active: Object.values(all_data).map(dt=>dt.active).reduce((a,c)=>a+c,0),
        last_update: new Date(Object.values(all_data).map(dt=>dt.lastUpdate).sort((a,b)=>b-a)[0])
      }

      

      this.setState({ctCodes: Object.keys(countriesGrupedByiso), all_data, stats});
      
      
      // console.log(countriesGrupedByiso, "COVID")
      // console.log(data.map(dt=>dt.deaths).reduce((a,c)=>a+c, 0), 'COVID')

    }catch(err){
      console.log(err, "COVID ERR");
      let payload = {
        confirmed: 0,
        recovered: 0,
        active: 0,
        deaths: 0
      }
      this.setState({stats: payload})
    }

    try {
      const resp = await fetch('https://covid19.mathdro.id/api/daily');
      const payload = await resp.json();

      let last10days = payload.map(item=>([item.reportDateString.slice(6), item.totalConfirmed, item.totalRecovered])).slice(payload.length-10);

      last10days.unshift(["DATE", "Confirmed", "Recovered"])

      this.setState({last10days})

    }catch(err){
      console.log(err)
    }

    const ten_days_data = await last10DaysOfData();

    this.setState({tendays: ten_days_data})

    
    
  }

  _handleSelectRegion = region=>{
    const {confirmed, deaths, recovered, active, lastUpdate} = this.state.regions[region];
    const {all_data, selected} = this.state;

    let stats = {
      confirmed,
      recovered,
      deaths,
      active,
      last_update: new Date(lastUpdate)
    }
    // this.handleGraphData(all_data[countries[selected]].country, region);

    this.setState({selectedRegion: region, stats});
  }

  _handleSelect = async country =>{
    this.setState({selected: country, selectedRegion: null, regions: {}});
    if (!country) return this.getWorldData();

    try{
     
      const data = this.state.all_data[countries[country]];

      console.log(data)
      
      const regionData = data.regions;

      let regions = {};

      regionData&&regionData.filter(reg=>reg.provinceState).forEach(region=>regions[region.provinceState]=region);

      let payload = {
        confirmed: data.confirmed,
        recovered: data.recovered,
        deaths: data.deaths,
        active: data.active,
        last_update: new Date(data.lastUpdate)
      }

      
      this.setState({stats: payload, regions})
      this.handleGraphData(data);
    }catch(err){
      console.log(err)
      let payload = {
        confirmed: 0,
        recovered: 0,
        deaths: 0,
        active: 0,
        last_update: new Date()
      }
      this.setState({stats: payload})
    }
    

  }


  
  render (){
    const {selected, selectedRegion, stats, filterValue, filterRegion, regions, ctCodes, last10days} = this.state;

    if (!stats || !ctCodes) return null;

    const countriesWithData = Object.entries(countries).filter(([name, code])=>ctCodes.includes(code))

    let filteredCountries = (filterValue && countriesWithData.filter(([name, code])=> name.toLowerCase().includes(filterValue.toLowerCase()) || name.toLowerCase().includes(filterValue.toLowerCase()))) || countriesWithData;

    let filteredRegions = (filterRegion && Object.keys(regions).filter(region=>region.toLowerCase().includes(filterRegion.toLowerCase()))) || Object.keys(regions);


    return (
      <>
      <Container  className="mb-5">
      <Jumbotron  className="text-center text-white jumbo">
        <h1>COVID-19 IN NUMBERS</h1>
        
      </Jumbotron>
        
        
        <Row className="justify-content-center ">
          <Col md={3} className="justify-content-center align-items-center text-center mb-2">
          <Dropdown>
          <Dropdown.Toggle variant="info" >
            {selected ? selected :'SELECT A COUNTRY'}
          </Dropdown.Toggle>

          <Dropdown.Menu
          style={{maxHeight: "50vh", overflow: "auto", paddingRight:'5px'}}
          >
            
            <input 
            type="text" 
            placeholder="Type to Filter..." 
            style={{border:'1px solid gray', borderRadius:"4px", padding: '3px 3px', marginLeft: '20px'}}
            onChange={e=>this.setState({filterValue: e.target.value})}
            value={filterValue}
            />

            <Dropdown.Divider/>
            
          {
            !filterValue || "the world".includes(filterValue.toLowerCase())
            ?
            <Dropdown.Item
                    key={'world'}
                   eventKey={'world'} 
                   onSelect={(country)=>this._handleSelect(null)}
                   active={!selected}
                   >THE WORLD</Dropdown.Item>
            :
            null
          }
          {
                filteredCountries.map(([country, code], index)=> (
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
          {
            Object.keys(regions).length
            ?
            <Col md={3} className="justify-content-center align-items-center text-center">
          <Dropdown>
          <Dropdown.Toggle variant="info" >
            {selectedRegion ? selectedRegion : 'SELECT A PROVINCE/STATE'}
          </Dropdown.Toggle>

          <Dropdown.Menu
          style={{maxHeight: "50vh", overflow: "auto", paddingRight:'5px'}}
          >
            
            <input 
            type="text" 
            placeholder="Type to Filter..." 
            style={{border:'1px solid gray', borderRadius:"4px", padding: '3px 3px', marginLeft: '20px'}}
            onChange={e=>this.setState({filterRegion: e.target.value})}
            value={filterRegion}
            />

            <Dropdown.Divider/>
          {
                filteredRegions.sort().map((region, index)=> (
                  <Dropdown.Item
                  key={index}
                   eventKey={region} 
                   onSelect={(region)=>this._handleSelectRegion(region)}
                   active={selectedRegion===region}
                   >{region}</Dropdown.Item>
                ))
              }
          </Dropdown.Menu>
        </Dropdown>

          </Col>
            :
            null
          }
        </Row>
        <Row>
          <Col className="mt-4 text-center text-white">
          <h4>{`${selectedRegion ? selectedRegion+",": ''} ${selected || 'THE WORLD'}`}</h4>
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
            <p className="text-center text-white">{`Last Updated : ${formatDate(stats.last_update)}`}</p>
            {
              last10days
              ?
              <Chart
              data={last10days}
              placeName={`${selected || 'THE WORLD'}`}
              />
              :
              null
            }
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


function formatDate(date){
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

  return date.toLocaleTimeString('en-US', options);
}


function formatDateFor(date){
  var dd = date.getDate();
  var mm = date.getMonth()+1;
  var yyyy = date.getFullYear();
  if(dd<10) {dd='0'+dd}
  if(mm<10) {mm='0'+mm}
  date = mm+'-'+dd+"-"+yyyy;
  return date
}



async function last10DaysOfData () {
  let result = {};
  
  let number_of_days = 10
  for (let i=-1; i<number_of_days; i++) {
      let d = new Date();
      d.setDate(d.getDate() - i);

      try{

      const response = await fetch('https://covid19.mathdro.id/api/daily/'+formatDateFor(d));
      const data = await response.json();

      data.forEach(dt=>dt.countryRegion = dt.countryRegion.includes('China') ? "China" : dt.countryRegion);
      
     if(data.length){
       let groupedData = groupBy(data, 'countryRegion');
       Object.entries(groupedData).forEach(([country, data])=>{

        let payload = {
          confirmed: data.map(dt=>parseInt(dt.confirmed)).reduce((a,c)=>a+c, 0),
          recovered: data.map(dt=>parseInt(dt.recovered)).reduce((a,c)=>a+c, 0),
          deaths: data.map(dt=>parseInt(dt.deaths)).reduce((a,c)=>a+c, 0),
          // regions: data.filter(dt=>dt.provinceState).length ? groupBy(data.filter(dt=>dt.provinceState), 'provinceState') : null
        }

        // data.filter(dt=>dt.provinceState).length ? data.filter(dt=>dt.provinceState).forEach(region=>payload.regions[region.provinceState]=region) : payload.regions=null;

        groupedData[country] = payload;
        

       })
      
      result[formatDateFor(d)] = groupedData;
      
     }else{
      number_of_days++;
     }
      

      }catch(err){
        number_of_days++;
      }
      
      
      
  }

  

  return result;
}

