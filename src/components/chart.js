import React, {Component} from "react";
import { render } from "react-dom";
import { Chart } from "react-google-charts";

export default class App extends Component {
  render() {
   const options={
      title: 'Last 10 Days of '+(this.props.placeName),
      legendTextStyle: { color: '#FFF' },
      legend: { position: 'bottom', alignment: 'center' },
      titleTextStyle: { color: '#FFF', fontSize: 20 },
      hAxis: { titleTextStyle: { color: '#fff' }, textStyle: {color: '#fff'},  gridlines: {color: '#fff'}, color: '#fff' },
      vAxis: {minValue: 0, titleTextStyle: { color: '#fff' }, textStyle: {color: '#fff'},  gridlines: {color: '#fff'},color: '#fff' },
      // For the legend to fit, we make the chart area smaller
      chartArea: { width: '70%', height: '70%', },
      colors: ['#ffc107', '#28a745', '#dc3545'],
      pointSize: 5,
      areaOpacity: 0.8,
      backgroundColor: 'transparent',
      is3D: true
      // lineWidth: 25
    }
    return (
      <div className={"my-pretty-chart-container"}>
        <Chart
          chartType="AreaChart"
          loader={<div>Loading Chart</div>}
          data={this.props.data}
          // data={[
          //   ['Year', 'Sales', 'Expenses'],
          //   ['2013', 1000, 400],
          //   ['2014', 1170, 460],
          //   ['2015', 660, 1120],
          //   ['2016', 1030, 540],
          // ]}
          width="100%"
          height="400px"
          options={options}
          
          legendToggle
        />
      </div>
    );
  }
}