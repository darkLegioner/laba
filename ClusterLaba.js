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

import Step_0 from './step_0'

const styles = theme => ({
  root: {
    display: 'inline-block',
    overflowX: 'auto',
  },
  table: {
    maxWidth: 200,
  },
});

class  ClusterLaba extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      values: [[2.6,10], [4,7.6],[8.6,6],[12,11.6],[13.6,9]],
      step_0_values: [],
      viewSolution: false
    }
  }
  

  render (){
    const { classes } = this.props;
    const { values, viewSolution, step_0_values } = this.state;

    const handleChange = (i, j) => event => {
      console.log(values[i][j]);
      let newValues = values;
      newValues[i][j] = event.target.value;
      this.setState({values: newValues})
    };

    const math_pow = (value, st) => {
      return(Math.pow(value, st))
    }

    const calculateClick = () => {
      let step_0_array = []
      for (var i = 0; i < values.length; i++) {
        let row = []
        for (var j = 0; j < values.length; j++) {
          row.push( math_pow( math_pow(values[i][0]-values[j][0], 2) + math_pow(values[i][1]-values[j][1], 2), 0.5))
        }
        step_0_array.push(row)
      }
      this.setState({step_0_values: step_0_array}, function(){
        this.setState({viewSolution: true})
      })
      console.log(step_0_array)
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
                  values.map(function(item, index){
                    return (
                      <TableRow key={index}>
                      <TableCell align="right">{index+1}</TableCell>
                      <TableCell align="right">
                        <TextField
                          id={`item_${index}_0`}
                          className={classes.textFieldLeft}
                          value={values[index][0]}
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
                          value={values[index][1]}
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
        <Step_0 values={step_0_values}/>
      </Paper>
      }
      </div>
    )
  }
}

export default withStyles(styles)(ClusterLaba);