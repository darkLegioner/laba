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
    display: 'inline-block',
    overflowX: 'auto',
  },
  table: {
    maxWidth: 300,
    backgroundColor: '#d6d6d6'
  },
  dataCell:{
    backgroundColor: 'white'
  }
});

class  Step_0 extends React.Component {
  render (){
    const { classes } = this.props;
    const { values } = this.props;

    return (
      <Paper className={classes.root}>
        <Typography variant="h5" gutterBottom>
          Шаг 0: Матрица расстояний
        </Typography>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>1</TableCell>
              <TableCell>2</TableCell>
              <TableCell>3</TableCell>
              <TableCell>4</TableCell>
              <TableCell>5</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              values.map(function(item, index){
                console.log(item)
                return (
                  <TableRow key={index}>
                    <TableCell  align="right">{index+1}</TableCell>
                    {item.map(function(cell, index){
                      return (
                        <TableCell align="right" className={classes.dataCell}>
                          {cell}
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

export default withStyles(styles)(Step_0);