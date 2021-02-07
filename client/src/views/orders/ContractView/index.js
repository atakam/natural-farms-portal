import React from 'react';
import {
  Container,
  Card,
  CardHeader,
  Divider,
  CardContent,
  IconButton,
  Tooltip
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import PrintIcon from '@material-ui/icons/Print';
import Contract from './Contract';
import PDF from './PDF';

const CustomerListView = ({
    objectProp,
    cancel,
    showPDF,
    pdfFormId
}) => {

  const printDivId = 'printDiv';
  const printDiv = () => {
    const mywindow = window.open('', 'PRINT', 'height=400,width=600');

    mywindow.document.write('<style>');
    const styles = document.head.getElementsByTagName('style')
    for (let i=0; i<styles.length; i++) {
      mywindow.document.write(styles[i].innerHTML);
    }
    mywindow.document.write('</style>');
    mywindow.document.write(document.getElementById(printDivId).innerHTML);

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/

    mywindow.print();
    mywindow.close();

    return true;
  }
  return (
    <Container maxWidth="lg">
      <Card>
            <CardHeader
                subheader={'Binding Contract'}
                title={objectProp.name}
                action={
                  <>
                    <Tooltip title="Print">
                        <IconButton
                            color="primary"
                            size="medium"
                            variant="contained"
                            onClick={printDiv}
                        >
                            <PrintIcon /> 
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Close">
                        <IconButton
                            color="primary"
                            size="medium"
                            variant="contained"
                            onClick={cancel}
                        >
                            <CloseIcon /> 
                        </IconButton>
                    </Tooltip>
                  </>
                }
            />
            <Divider />
            <CardContent>
                {showPDF ? 
                  <PDF formid={pdfFormId} closeDialog={cancel} /> :
                  <Contract objectProp={objectProp} printDivId={printDivId}/>
                }
            </CardContent>
      </Card>
    </Container>
  );
};

export default CustomerListView;
