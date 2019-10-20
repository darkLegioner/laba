import React from 'react';
import clsx from 'clsx';
import { makeStyles,withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
  root: {
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
  dataCellMin:{
    backgroundColor: 'yellow'
  }
});

class  ResultTable extends React.Component {
  render (){
    const { classes } = this.props;
    const { title, values, minValue, columns } = this.props;

    return (
      <Paper className={classes.root}>
        <Typography variant="h5" gutterBottom>
          {title}
        </Typography>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              {columns.map(function(column){
                return <TableCell>{column}</TableCell>
              })}
              
            </TableRow>
          </TableHead>
          <TableBody>
            {
              columns.map(function(item, index){
                return (
                  <TableRow key={index}>
                    <TableCell  align="right">{item}</TableCell>
                    {columns.map(function(cell, index){
                      return (
                        <TableCell align="right" className={values[item][cell] === minValue.value ? classes.dataCellMin : classes.dataCell}>
                          {values[item][cell]}
                        </TableCell>
                      )
                    })
                    }
                  </TableRow>
                    
                )})
            }
          </TableBody>
        </Table>
      </Paper>
    )
  }

}

export default withStyles(styles)(ResultTable);