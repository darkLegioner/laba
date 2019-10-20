import React from 'react';
import CanvasJSReact from './canvasjs/canvasjs.react';
import { makeStyles,withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const styles = theme => ({
  card: {
    display: 'block',
    overflowX: 'auto',
    margin: '10px',
    padding: '10px'
  }
});

class DrawChart extends React.Component {
	render() {
    const { classes } = this.props;
    const { dataPoints } = this.props;
    console.log
		const options = {
			animationEnabled: true,
			zoomEnabled: true,
			title:{
				text: ""
			},
			axisX: {
				title:"Cреднегодовая стоимость основных производственных фондов",
				suffix: "(млн. руб.)",
				crosshair: {
					enabled: true,
					snapToDataPoint: true
				}
			},
			axisY:{
				title: "Объем произведенной продукции",
        suffix: "(млн. руб.)",
				crosshair: {
					enabled: true,
					snapToDataPoint: true
				}
			},
			data: [{
				type: "scatter",
				markerSize: 15,
				toolTipContent: "<b>A1: </b>{x}<br/><b>A2: </b>{y}<br/><b>Кластер: </b>{cluster}",
				dataPoints: dataPoints
			}]
		}
		return (
      <Paper className={classes.card}>
        <CanvasJSChart options = {options}
          /* onRef={ref => this.chart = ref} */
        />
        {/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
      </Paper>
		);
	}
}

export default withStyles(styles)(DrawChart);