import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Card
} from '@material-ui/core';
import Content from './Content';

const Results = ({ className, objectProp, printDivId,...rest }) => {
  
    return (
        <Card
        className={clsx(className)}
        {...rest}
        >
            <PerfectScrollbar>
                <Content objectProp={objectProp} printDivId={printDivId} />
            </PerfectScrollbar>
        </Card>
    );
    };

Results.propTypes = {
  className: PropTypes.string
};

export default Results;
