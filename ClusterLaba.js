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
import Typography from '@material-ui/core/Typography';

import ResultTable from './ResultTable'
import DrawChart from './DrawChart'

const styles = theme => ({
  root: {
    display: 'block',
    overflowX: 'auto'
  },
  card: {
    display: 'block',
    overflowX: 'auto',
    margin: '10px',
    padding: '10px',
    width: 'fit-content'
  },
  table: {
    maxWidth: 300,
    backgroundColor: '#d6d6d6'
  },
  dataCell:{
    backgroundColor: 'white'
  },
  dataCellYellow:{
    backgroundColor: 'yellow'
  }
});

const defaultValues = {
  '1': [2.6,10], 
  '2': [4,7.6], 
  '3': [8.6,6],
  '4': [12,11.6],
  '5': [13.6,9]
}
const defaultColumns = ['1','2','3','4','5']

function getCluster(item) {
  let list = []
  typeof item === 'number' ? list.push(item) : item.forEach(function(col){
    let tmp = typeof col === 'number' ? [col] : getCluster(col)
    list.push(...tmp)
  })
  return list
}

function math_pow(value, st) {
  return(Math.pow(value, st))
}

class  ClusterLaba extends React.Component {
  constructor(props) {
    super(props);
    let state = {
      values: {},
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
    Object.assign(state.values, defaultValues)
    this.state = state
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
        let cell = math_pow( math_pow(values[columns[i]][0]-values[columns[j]][0], 2) + math_pow(values[columns[i]][1]-values[columns[j]][1], 2), 0.5)
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

  iteration_step(previous_step, title) {
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
              if ( parseInt(columns[j]) ){ 
                cell = values[columns[i]][columns[j]]
              } else {
                if (columns[j] === previousMinColumn){
                  cell = ((values[columns[i]][previousMinValue.x]+values[columns[i]][previousMinValue.y])-Math.abs(values[columns[i]][previousMinValue.x]-values[columns[i]][previousMinValue.y])/2)/2
                  
                } else {
                  cell = ((values[previousMinValue.x][columns[j]]+values[previousMinValue.y][columns[j]])-Math.abs(values[previousMinValue.x][columns[j]]-values[previousMinValue.y][columns[j]])/2)/2
                }
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
      minValue: minValue,
      title: title
    }
  }

  getDisp(cluster, values, centroid) {
    let tmp = 0
    cluster.forEach(function(item){
      tmp += ( math_pow( ( parseFloat(values[item][0]) - parseFloat(centroid[0]) ),2 )
             + math_pow( ( parseFloat(values[item][1]) - parseFloat(centroid[1]) ),2 ) )/cluster.length
    })
    return tmp
  }

  getRadius(cluster, values, centroid) {
    let tmp = []
    cluster.forEach(function(item){
      tmp.push(math_pow( math_pow(values[item][0]-centroid[0], 2) + math_pow(values[item][1]-centroid[1], 2), 0.5))
    })
    return Math.max.apply(null, tmp)
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
    const { values, viewSolution, step_0_values, step_1_values, step_2_values, step_3_values, columns, first_cluster, second_cluster, first_centroid,second_centroid, dataPoints, radius_2, radius_1, disp_1, disp_2 } = this.state;

    const handleChange = (i, j) => event => {
      let newValues = values;
      newValues[i][j] = parseFloat(event.target.value);
      this.setState({values: Object.assign({}, newValues)})
    };
    
    const resetClick = () => {
      this.setState({
        values: {
          '1': [2.6,10], 
          '2': [4,7.6], 
          '3': [8.6,6],
          '4': [12,11.6],
          '5': [13.6,9]
        },
        viewSolution: false}
      )
    }

    const calculateClick = () => {
      let step_0 = this.step_zero()
      let step_1 = this.iteration_step(step_0, 'Шаг 1: Метод ближнего соседа')
      let step_2 = this.iteration_step(step_1, 'Шаг 2:')
      let step_3 = this.iteration_step(step_2, 'Шаг 3:')
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

      let disp_1 = this.getDisp(first_cluster, values, first_centroid)
      let disp_2 = this.getDisp(second_cluster, values, second_centroid)

      let radius_1 = this.getRadius(first_cluster, values, first_centroid)
      let radius_2 = this.getRadius(second_cluster, values, second_centroid)

      this.setState({
        step_0_values: step_0,
        step_1_values: step_1,
        step_2_values: step_2,
        step_3_values: step_3,
        first_cluster: first_cluster,
        second_cluster: second_cluster,
        first_centroid: first_centroid,
        second_centroid: second_centroid,
        disp_1: disp_1,
        disp_2: disp_2,
        radius_1: radius_1,
        radius_2: radius_2,
        dataPoints: dataPoints
      }, function(){
        this.setState({viewSolution: true})
      })
    };

    return (
      <div>
        <form className={classes.container} noValidate autoComplete="off">
          <Paper className={classes.card}>
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
                        <TableCell align="right">{item}</TableCell>
                        <TableCell align="right" className={classes.dataCell}>
                          <TextField
                            id={`item_${index}_0`}
                            className={classes.textFieldLeft}
                            value={values[item][0]}
                            margin="normal"
                            type="number"
                            onChange={handleChange(item, 0)}
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                          </TableCell>
                        <TableCell align="right"  className={classes.dataCell}>
                          <TextField
                            id={`item_${index}_1`}
                            className={classes.textFieldRight}
                            value={values[item][1]}
                            margin="normal"
                            type="number"
                            onChange={handleChange(item, 1)}
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

        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={resetClick}
        >
          Сбросить
        </Button>
      { viewSolution && <Paper className={classes.card} >
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
        <Paper className={classes.card}>
          <Typography variant="h5" gutterBottom>
            Шаг 4: Характеристики кластера
          </Typography>
          <Paper className={classes.card}>
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
                          <TableCell align="right">{item}</TableCell>
                          <TableCell align="right" className={first_cluster.includes(parseInt(item)) ? classes.dataCellYellow : classes.dataCell}>
                            {values[item][0]}
                          </TableCell>
                          <TableCell align="right" className={first_cluster.includes(parseInt(item)) ? classes.dataCellYellow : classes.dataCell}>{values[item][1]}</TableCell>
                        </TableRow>
                      )
                    })
                  }
                </TableBody>
              </Table>
            </Paper>
            <Paper className={classes.card}>
              <Typography variant="h6" gutterBottom>
                Кластер {step_3_values.columns[0]}:
              </Typography>
              <Typography gutterBottom>
                Центр тяжести кластера : ({first_centroid.toString()})
              </Typography>
              <Typography gutterBottom>
                Дисперсия : {disp_1}
              </Typography>
              <Typography gutterBottom>
                Среднеквадратичное отклонение объектов относительно центра кластера : {math_pow(disp_1,0.5)}
              </Typography>
              <Typography gutterBottom>
                Радиус : {radius_1}
              </Typography>
            </Paper>

            <Paper className={classes.card}>
              <Typography variant="h6" gutterBottom>
                Кластер {step_3_values.columns[1]}:
              </Typography>
              <Typography gutterBottom>
                Центр тяжести кластера : ({second_centroid.toString()})
              </Typography>
              <Typography gutterBottom>
                Дисперсия : {disp_2}
              </Typography>
              <Typography gutterBottom>
                Среднеквадратичное отклонение объектов относительно центра кластера : {math_pow(disp_2,0.5)}
              </Typography>
              <Typography gutterBottom>
                Радиус : {radius_2}
              </Typography>
            </Paper>
          <DrawChart dataPoints={dataPoints} />
        </Paper>
      </Paper>
      }
      </div>
    )
  }
}

export default withStyles(styles)(ClusterLaba);