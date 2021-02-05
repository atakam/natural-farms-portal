import React, { useState } from 'react';
import clsx from 'clsx';
import {
  Card,
  Dialog,
  makeStyles,
  ListItemIcon,
  Menu,
  MenuItem
} from '@material-ui/core';
import { Calendar, Views, dateFnsLocalizer } from 'react-big-calendar';
import {
    format,
    parse,
    startOfWeek,
    getDay
} from 'date-fns';
import enUs from 'date-fns/locale/en-US';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {updateFormDeliveryDate} from 'src/functions';
import SwapHorizontalCircleIcon from '@material-ui/icons/SwapHorizontalCircle';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import SummaryOrderView from '../SummaryOrderView';

const useStyles = makeStyles((theme) => ({
  root: {
      padding: '20px',
      height: '100%'
  },
  avatar: {
    marginRight: theme.spacing(2)
  }
}));

const CalendarView = ({ className, results, callback, showDate, handleClick, ...rest }) => {
    const classes = useStyles();
    const [draggedEvent, setDraggedEvent] = useState(null);
    const [defaultDate, setDefaultDate] = useState(showDate);
    const [selectedSlotDate, setSelectedSlotDate] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [summary, setSummary] = useState([]);
    const [supplierFlag, setSupplierFlag] = useState(false);
    const [summaryDialog, openSummaryDialog] = useState(false);
    const locales = {
        'en-US': enUs
    };
    const localizer = dateFnsLocalizer({
        format,
        parse,
        startOfWeek,
        getDay,
        locales
    });

    const handleEventClick = (event) => {
        const target = document.getElementById('calendar-view');
        target.menuStyle = 'calendar-menu-style';
        target.customerName = event.objectProp.name;
        handleClick(target, event.objectProp);
    }

    const handleSelect = ({ start }) => {
        setSelectedSlotDate(start);
        setAnchorEl(document.getElementById('calendar-view'));
    }

    const handleClose = () => {
        setAnchorEl(null);
    };

    const getSummary = async (isSupplier) => {
        const response = await fetch('/summary/date/' + slotFullDate, {
            headers: {
              'Content-Type': 'application/json',
            }
        });
        const body = await response.text();
        const summaryResults = JSON.parse(body);
        console.log("summary", JSON.parse(body));
        setSummary(summaryResults);
        setSupplierFlag(isSupplier);
        openSummaryDialog(true);
    };

    const supplierSummary = () => {
        setAnchorEl(null);
        getSummary(true);
    };

    const deliverySummary = () => {
        setAnchorEl(null);
        getSummary(false);
    };

    const handleCloseDialog = () => {
        openSummaryDialog(false)
    }

    let slotDate = selectedSlotDate && selectedSlotDate.toString().split('00')[0];
    const slotFullDate = (new Date(slotDate).getFullYear()) + '-' + ((new Date(slotDate).getMonth() + 1) < 10 ? '0' + (new Date(slotDate).getMonth() + 1) : (new Date(slotDate).getMonth() + 1)) + '-' + (new Date(slotDate).getDate() < 10 ? '0' + new Date(slotDate).getDate() : new Date(slotDate).getDate());

    const slotMenu = (
        <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
            className='calendar-menu-style'
        >
            <MenuItem onClick={supplierSummary}>
                <strong>{ slotDate }</strong>
            </MenuItem>
            <MenuItem onClick={() => supplierSummary()}>
                <ListItemIcon>
                    <SwapHorizontalCircleIcon fontSize="small" />
                </ListItemIcon>
                Supplier Summary
            </MenuItem>
            <MenuItem onClick={() => deliverySummary()}>
                <ListItemIcon>
                    <LocalShippingIcon fontSize="small" />
                </ListItemIcon>
                Delivery Summary
            </MenuItem>
        </Menu>
    );

    let events = results.map((result, index) => {
        return [
            {
                id: index,
                title: '(1) ' + result.firstName + ' ' + result.lastName,
                allDay: true,
                start: new Date(result.conditions_firstdeliverydate.split('T')[0] + ' 06:00 pm'),
                end: new Date(result.conditions_firstdeliverydate.split('T')[0] + ' 06:00 pm'),
                delivery: 1,
                hexColor: new Date() > new Date(result.conditions_firstdeliverydate) ? '#9e9e9e' : '#009688',
                objectProp: {
                    formid: result.formid,
                    rid: result.representative_id,
                    email: result.email,
                    phoneNumber: result.phoneNumber,
                    name: result.firstName + ' ' + result.lastName,
                    id: result.uid
                }
            },
            {
                id: index,
                title: '(2) ' + result.firstName + ' ' + result.lastName,
                allDay: true,
                start: new Date(result.conditions_seconddeliverydate.split('T')[0] + ' 06:00 pm'),
                end: new Date(result.conditions_seconddeliverydate.split('T')[0] + ' 06:00 pm'),
                delivery: 2,
                hexColor: new Date() > new Date(result.conditions_seconddeliverydate) ? '#9e9e9e' : '#ff9800',
                objectProp: {
                    formid: result.formid,
                    rid: result.representative_id,
                    email: result.email,
                    phoneNumber: result.phoneNumber,
                    name: result.firstName + ' ' + result.lastName,
                    id: result.uid
                }
            }
            ,
            {
                id: index,
                title: '(3) ' + result.firstName + ' ' + result.lastName,
                allDay: true,
                start: new Date(result.conditions_thirddeliverydate.split('T')[0] + ' 06:00 pm'),
                end: new Date(result.conditions_thirddeliverydate.split('T')[0] + ' 06:00 pm'),
                delivery: 3,
                hexColor: new Date() > new Date(result.conditions_thirddeliverydate) ? '#9e9e9e' : '#ff5722',
                objectProp: {
                    formid: result.formid,
                    rid: result.representative_id,
                    email: result.email,
                    phoneNumber: result.phoneNumber,
                    name: result.firstName + ' ' + result.lastName,
                    id: result.uid
                }
            }
        ];
    });
    events = [].concat.apply([], events);

    const DragAndDropCalendar = withDragAndDrop(Calendar)

    const moveEvent = ({ event, start, end }) => {
        events = events.map(existingEvent => {
          return existingEvent.id == event.id
            ? { ...existingEvent, start, end }
            : existingEvent
        })
        updateFormDeliveryDate({formid: event.objectProp.formid, delivery: event.delivery, date: start})
        .then(() => {
            callback && callback();
            setDefaultDate(new Date(start));
        });
    }

    const onDropFromOutside = ({ start, end }) => {
        const event = {
          id: draggedEvent.id,
          title: draggedEvent.title,
          start,
          end,
          allDay: true
        }
    
        setDraggedEvent(null);
        moveEvent({ event, start, end });
      }
    
    const handleDragStart = event => {
        setDraggedEvent(event);
    }

    const eventStyleGetter = (event) => {
        return {
            style: {
                backgroundColor: event.hexColor
            }
        };
    }

    return (
        <Card
            className={clsx(classes.root, className)}
            id='calendar-view'
            {...rest}
        >
            {slotMenu}
            <Dialog
                open={summaryDialog}
                onClose={handleCloseDialog}
                aria-labelledby="draggable-dialog-title"
                fullWidth
                maxWidth={'lg'}
            >
                <SummaryOrderView
                    title={slotFullDate}
                    subtitle={supplierFlag ? "SUPPLIER SUMMARY" : "DELIVERY SUMMARY"}
                    updateCallback={callback}
                    cancel={handleCloseDialog}
                    isSupplier={supplierFlag}
                    summary={summary}
                    slotDate={slotDate}
                />
            </Dialog>
            <DragAndDropCalendar
                selectable
                localizer={localizer}
                events={events}
                defaultView={Views.MONTH}
                scrollToTime={new Date(1970, 1, 1, 6)}
                defaultDate={defaultDate}
                onSelectEvent={(event) => handleEventClick(event)}
                onDragStart={console.log}
                onEventDrop={moveEvent}
                handleDragStart={handleDragStart}
                onDropFromOutside={onDropFromOutside}
                eventPropGetter={eventStyleGetter}
                onSelectSlot={handleSelect}
                startAccessor={({ end }) => new Date(end.getTime() - 1)}
            />
        </Card>
    );
};
export default CalendarView;