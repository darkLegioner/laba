import React from 'react';
import clsx from 'clsx';
import { makeStyles,withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';

import ResultTable from './ResultTable'
import DrawChart from './DrawChart'

const styles = theme => ({
  root: {
    display: 'inline-block',
    overflowX: 'auto',
  },
  table: {
    maxWidth: 200,
  },
});

const defaultValues = {
  '1':[2.6,10], 
  '2': [4,7.6], 
  '3': [8.6,6],
  '4': [12,11.6],
  '5': [13.6,9]
}
const defaultColumns = ['1','2','3','4','5']

function getCluster(item) {
  let list = []
  item.forEach(function(col){
    let tmp = typeof col === 'number' ? [col] : getCluster(col)
    list.push(...tmp)
  })
  return list
}

class  ClusterLaba extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      values: defaultValues,
      columns: defaultColumns,
      step_0_values: {},
      step_1_values: {},
      step_2_values: {},
      step_3_values: {},
      first_cluster: [],
      second_cluster: [],
      first_centroid: [],
      second_centroid: [],
      dataPoints: [],
      viewSolution: false
    }
  }
  
  step_zero() {
    let step_0_array = {}
    let columns = this.state.columns
    let values = this.state.values
    let minValue = {
      value: Number.MAX_VALUE,
      x: 0,
      y: 0
    }
    for (var i = 0; i < columns.length; i++) {
      let row = {}
      for (var j = 0; j < columns.length; j++) {
        let cell = this.math_pow( this.math_pow(values[columns[i]][0]-values[columns[j]][0], 2) + this.math_pow(values[columns[i]][1]-values[columns[j]][1], 2), 0.5)
        row[columns[j]] = cell
        if ( cell < minValue.value && i !== j) {
          minValue = {
            value: cell,
            x: columns[i],
            y: columns[j]
          }
        }
      }
      step_0_array[columns[i]] = row
    }

    return {
      values: step_0_array,
      columns: columns,
      minValue: minValue
    }
  }

  iteration_step(previous_step) {
    let iteration_step_array = {}
    let columns = [] 
    let previousMinValue = previous_step.minValue
    previous_step.columns.forEach(function(col){
      if(col!==previousMinValue.x && col!==previousMinValue.y){
        columns.push(col)
      }
    })
    let previousMinColumn = '[' + previous_step.minValue.x + ', ' + previous_step.minValue.y + ']'
    columns.push(previousMinColumn)    
    
    let values = previous_step.values
    let minValue = {
      value: Number.MAX_VALUE,
      x: 0,
      y: 0
    }
    for (var i = 0; i < columns.length; i++) {
      let row = {}
      for (var j = 0; j < columns.length; j++) {
        let cell = 0
        if ( i === j ) {
          cell = 0
        } else {
          if ( parseInt(columns[i]) ){
            if ( parseInt(columns[j]) ){
              cell = values[columns[i]][columns[j]]
            } else {
              if ( columns[j] === previousMinColumn ) {
                cell = ((values[columns[i]][previousMinValue.x]+values[columns[i]][previousMinValue.y])-Math.abs(values[columns[i]][previousMinValue.x]-values[columns[i]][previousMinValue.y])/2)/2
              } else {
                cell = values[columns[i]][columns[j]]
              }
            }

          } else {
            if (columns[i] === previousMinColumn){
              if ( parseInt(columns[j]) ){
                cell = ((values[previousMinValue.x][columns[j]]+values[previousMinValue.y][columns[j]])-Math.abs(values[previousMinValue.x][columns[j]]-values[previousMinValue.y][columns[j]])/2)/2
              } else {
                cell = ((values[previousMinValue.x][columns[j]]+values[previousMinValue.y][columns[j]])-Math.abs(values[previousMinValue.x][columns[j]]-values[previousMinValue.y][columns[j]])/2)/2
              }
            } else {
              if (columns[j] === previousMinColumn){
                cell = ((values[columns[i]][previousMinValue.x]+values[columns[i]][previousMinValue.y])-Math.abs(values[columns[i]][previousMinValue.x]-values[columns[i]][previousMinValue.y])/2)/2
                
              } else {
                cell = ((values[previousMinValue.x][columns[j]]+values[previousMinValue.y][columns[j]])-Math.abs(values[previousMinValue.x][columns[j]]-values[previousMinValue.y][columns[j]])/2)/2
              }
            }
          }
        }
        row[columns[j]] = cell
          if ( cell < minValue.value && i !== j) {
            minValue = {
              value: cell,
              x: columns[i],
              y: columns[j]
            }
          }
      }
      iteration_step_array[columns[i]] = row
    }

    return {
      values: iteration_step_array,
      columns: columns,
      minValue: minValue
    }
  }

  math_pow(value, st) {
    return(Math.pow(value, st))
  }

  getCentroid(cluster, values) {
    let x = 0
    let y = 0
    cluster.forEach(function(item){
      x += parseFloat(values[item][0])/cluster.length
      y += parseFloat(values[item][1])/cluster.length
    })
    return [x,y]
  }

  render (){
    const { classes } = this.props;
    const { values, viewSolution, step_0_values, step_1_values, step_2_values, step_3_values, columns, first_cluster, second_cluster, first_centroid,second_centroid, dataPoints } = this.state;

    const handleChange = (i, j) => event => {
      let newValues = values;
      newValues[i][j] = event.target.value;
      this.setState({values: newValues})
    };

    const calculateClick = () => {
      let step_0 = this.step_zero()
      let step_1 = this.iteration_step(step_0)
      let step_2 = this.iteration_step(step_1)
      let step_3 = this.iteration_step(step_2)
      let first_cluster = getCluster(JSON.parse(step_3.columns[0]))
      let second_cluster = getCluster(JSON.parse(step_3.columns[1]))
      let first_centroid = this.getCentroid(first_cluster, values)
      let second_centroid = this.getCentroid(second_cluster, values)
      let dataPoints = []
      columns.forEach(function(item){
        dataPoints.push({
          x: values[item][0],
          y: values[item][1],
          cluster: first_cluster.includes[item] ? '1':'2',
          color: first_cluster.includes[item] ? 'green':'blue',
        })
      })

      dataPoints.push({
        x: first_centroid[0],
        y: first_centroid[1],
        cluster: '1',
        color: 'red',
      })

      dataPoints.push({
        x: second_centroid[0],
        y: second_centroid[1],
        cluster: '2',
        color: 'red',
      })

      console.log(dataPoints)

      this.setState({
        step_0_values: step_0,
        step_1_values: step_1,
        step_2_values: step_2,
        step_3_values: step_3,
        first_cluster: first_cluster,
        second_cluster: second_cluster,
        first_centroid: first_centroid,
        second_centroid: second_centroid,
        dataPoints: dataPoints
      }, function(){
        this.setState({viewSolution: true})
      })
    };

    return (
      <div>
        <form className={classes.container} noValidate autoComplete="off">
          <Paper className={classes.root}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>t</TableCell>
                  <TableCell align="right">A1</TableCell>
                  <TableCell align="right">A2</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  columns.map(function(item, index){
                    return (
                      <TableRow key={index}>
                      <TableCell align="right">{index+1}</TableCell>
                      <TableCell align="right">
                        <TextField
                          id={`item_${index}_0`}
                          className={classes.textFieldLeft}
                          value={values[columns[index]][0]}
                          margin="normal"
                          type="number"
                          onChange={handleChange(index, 0)}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                        </TableCell>
                      <TableCell align="right">

                        <TextField
                          id={`item_${index}_1`}
                          className={classes.textFieldRight}
                          value={values[columns[index]][1]}
                          margin="normal"
                          type="number"
                          onChange={handleChange(index, 1)}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                        </TableCell>

                      </TableRow>
                    )
                  })
                }
              </TableBody>
            </Table>
          </Paper>
        </form>
        <Button
        variant="contained"
        color="primary"
        className={classes.button}
        onClick={calculateClick}
      >
        Расчитать
      </Button>
      { viewSolution && <Paper >
        <ResultTable 
          values={step_0_values.values} 
          columns={step_0_values.columns} 
          minValue={step_0_values.minValue} 
          title={step_0_values.title}
          />
        <ResultTable 
        values={step_1_values.values} 
        columns={step_1_values.columns} 
        minValue={step_1_values.minValue} 
        title={step_1_values.title}
        />
        <ResultTable 
        values={step_2_values.values} 
        columns={step_2_values.columns} 
        minValue={step_2_values.minValue} 
        title={step_2_values.title}
        />
        <ResultTable 
        values={step_3_values.values} 
        columns={step_3_values.columns} 
        minValue={step_3_values.minValue} 
        title={step_3_values.title}
        />
        <DrawChart dataPoints={dataPoints} />
      </Paper>
      }
      </div>
    )
  }
}

export default withStyles(styles)(ClusterLaba);