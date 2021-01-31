import React from 'react';
import {
    Box,
    Button,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow
} from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';

const Packaging = ({ results, ...rest }) => {

  return (
    <PerfectScrollbar>
        <Box minWidth={1050}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Packaging
                </TableCell>
                <TableCell>
                  Code
                </TableCell>
                <TableCell>
                  Unit Point Value
                </TableCell>
                <TableCell>
                  Purchase Price
                </TableCell>
                {/* <TableCell>
                  Actions
                </TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {results.map((packaging) => (
                <TableRow
                  hover
                  key={packaging.details_id}
                >
                  <TableCell>
                    {packaging.type + ' [' + packaging.quantity + ']'}
                  </TableCell>
                  <TableCell>
                    {packaging.code}
                  </TableCell>
                  <TableCell>
                    {packaging.point}
                  </TableCell>
                  <TableCell>
                    {packaging.purchase_price}
                  </TableCell>
                  {/* <TableCell>
                    <Button
                      variant="contained"
                      aria-controls="simple-menu"
                      aria-haspopup="true"
                      color="primary"
                    >
                      Save
                    </Button>
                    <span style={{ padding: '10px' }} />
                    <Button
                      variant="contained"
                      aria-controls="simple-menu"
                      aria-haspopup="true"
                    >
                      Delete
                    </Button>
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
  );
};

export default Packaging;
