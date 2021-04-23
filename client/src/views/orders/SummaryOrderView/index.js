import React, { useState } from 'react';
import {
  Container,
  Card,
  CardHeader,
  Divider,
  CardContent,
  IconButton,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import PrintIcon from '@material-ui/icons/Print';
import RoomIcon from '@material-ui/icons/Room';
import ListIcon from '@material-ui/icons/List';
import Results from './Results';
import MapView from './MapView';

const SummaryOrderView = ({
  title,
  subtitle,
  isSupplier,
  summary,
  updateCallback,
  cancel,
  slotDate
}) => {
  const [showMap, setShowMap] = useState(false);
  const [addresses, setAddresses] = useState([]);

  const showMapView = () => {
    let results = summary.reduce((r, a) => {
      r[a.form_id] = [...r[a.form_id] || [], a];
      return r;
    }, {});
    results = Object.values(results);
    const adds = results.map((user) => {
      const sector = (user.sector != null ? (' (' + user.sector + ')') : '');
      return {
        user: user[0].firstName + ' ' + user[0].lastName,
        address: user[0].streetAddress + ', ' + user[0].city + sector + ', ' + user[0].province + ' ' + user[0].postalCode
      }
    });
    setAddresses(adds);
    setShowMap(true);
  }

  const hideMapView = () => {
    setShowMap(false);
  }

  const printDiv = () => {
    // const mywindow = window.open('', 'PRINT', 'height=400,width=600');

    // mywindow.document.write('<html><head>' + document.head.innerHTML);
    // mywindow.document.write('</head><body >');
    // mywindow.document.write('<h1>' + document.title + '</h1>');
    // mywindow.document.write(document.getElementById('printDiv').innerHTML);
    // mywindow.document.write('</body></html>');

    // mywindow.document.close(); // necessary for IE >= 10
    // mywindow.focus(); // necessary for IE >= 10*/

    // mywindow.print();
    // mywindow.close();

    // return true;
    // console.log('HEAD', document.head.innerHTML);
    // console.log('CONTENT', document.getElementById('printDiv').innerHTML);

    const _window = window.open('', 'PRINT', 'height=400,width=600');
    _window.document.write(document.head.innerHTML);
    _window.document.write(`
    <style type="text/css" media="print">
      @page { size: landscape; }
      @media print {
        table {page-break-after: always;}
      }
    </style>
    <style>
      body {
        background-color: #fff !important;
      }
      tr:nth-child(even) {background-color: #f2f2f2 !important;}
    </style>
    `);
    const printAreas = document.getElementsByClassName('printArea');
    for (let i = 0; i < printAreas.length; i++) {
      _window.document.write(printAreas[i].innerHTML);
    }
    _window.document.write('<script>window.print();window.close();</script>');
    //_window.print();
  }

  return (
    <Container maxWidth="lg" id='printDiv'>
      <Card>
        <CardHeader
          subheader={subtitle}
          title={slotDate}
          action={
            <>
              {
                showMap ? (
                  <IconButton
                    color="primary"
                    size="medium"
                    variant="contained"
                    onClick={hideMapView}
                  >
                    <ListIcon />
                  </IconButton>
                ) : (
                  <IconButton
                    color="primary"
                    size="medium"
                    variant="contained"
                    onClick={showMapView}
                  >
                    <RoomIcon />
                  </IconButton>
                )
              }
              {
                showMap ? <></> : (
                  <IconButton
                    color="primary"
                    size="medium"
                    variant="contained"
                    onClick={printDiv}
                  >
                    <PrintIcon />
                  </IconButton>
                )
              }
              <IconButton
                color="primary"
                size="medium"
                variant="contained"
                onClick={cancel}
              >
                <CloseIcon />
              </IconButton>
            </>
          }
        />
        <Divider />
        <CardContent>
          {
            showMap ? <MapView addresses={addresses} /> : <Results results={summary} isSupplier={isSupplier} callback={updateCallback} date={title} slotDate={slotDate} />
          }
        </CardContent>
      </Card>
    </Container>
  );
};

export default SummaryOrderView;
