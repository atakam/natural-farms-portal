import React, { useState } from 'react';
import clsx from 'clsx';
import {
  Card,
  makeStyles
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
import { doc } from 'prettier';

const useStyles = makeStyles((theme) => ({
  root: {
      padding: '20px',
      height: '100%'
  },
  avatar: {
    marginRight: theme.spacing(2)
  }
}));

const CalendarView = ({ className, results, callback, showDate, actions, handleClick, ...rest }) => {
    const classes = useStyles();
    const [draggedEvent, setDraggedEvent] = useState(null);
    const [defaultDate, setDefaultDate] = useState(showDate);
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

    let events = results.map((result, index) => {
        return [
            {
                id: index,
                title: '(1) ' + result.firstName + ' ' + result.lastName,
                allDay: true,
                start: new Date(result.conditions_firstdeliverydate),
                end: new Date(result.conditions_firstdeliverydate),
                delivery: 1,
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
                start: new Date(result.conditions_seconddeliverydate),
                end: new Date(result.conditions_seconddeliverydate),
                delivery: 2,
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
                start: new Date(result.conditions_thirddeliverydate),
                end: new Date(result.conditions_thirddeliverydate),
                delivery: 3,
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

    return (
        <Card
            className={clsx(classes.root, className)}
            id='calendar-view'
            {...rest}
        >
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
            />
        </Card>
    );
};
export default CalendarView;