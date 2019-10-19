import React from 'react';
import CanvasJSReact from './canvasjs/canvasjs.react';
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class DrawChart extends React.Component {
	render() {
    const { dataPoints } = this.props;
    console.log
		const options = {
			animationEnabled: true,
			zoomEnabled: true,
			title:{
				text: ""
			},
			axisX: {
				title:"Temperature (in °C)",
				suffix: "°C",
				crosshair: {
					enabled: true,
					snapToDataPoint: true
				}
			},
			axisY:{
				title: "Sales",
				includeZero: false,
				crosshair: {
					enabled: true,
					snapToDataPoint: true
				}
			},
			data: [{
				type: "scatter",
				markerSize: 15,
				toolTipContent: "<b>Temperature: </b>{x}°C<br/><b>Sales: </b>{y}",
				dataPoints: dataPoints
			}]
		}
		return (
		<div>
			<CanvasJSChart options = {options}
				/* onRef={ref => this.chart = ref} */
			/>
			{/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
		</div>
		);
	}
}

export default DrawChart;             