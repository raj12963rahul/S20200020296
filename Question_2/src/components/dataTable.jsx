import React from 'react';
import Table from 'react-bootstrap/Table';
import './dataTable.css';
import {Link} from 'react-router-dom';

const formatTime = (time, delay) => {
    const hr = time.Hours + (time.Minutes + delay)/60;
    const min = (time.Minutes + delay)%60;
    const sec = time.Seconds;
    return `${hr}:${min}:${sec}`;
};

const convertTime = (time,delay) => {
    const curr = new Date();
    curr.setHours(time.Hours + (time.Minutes + delay)/60);
    curr.setMinutes((time.Minutes + delay)%60);
    curr.setSeconds(time.Seconds);
    return curr;
}
const diff_minutes = (dt2, dt1) => {
    var diff =(dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60;
    return Math.abs(Math.round(diff));
}
// const data

const DataDisplay = props => {

  const filteredData = props.filteredData
    .map(train => ({
      ...train,
      time:
        train.delayedBy>0 ? ( //only if actual and scheduled arrival time differ, create special class (red) for actual time
          <>
            <span className="red">{formatTime(train.departureTime,train.delayedBy)}</span>
            <span className="under">({formatTime(train.departureTime,0)})</span>
          </>
        ) : (
          formatTime(train.departureTime,0)
        )
    })) // filter out trains that have departure in next 30 mins
    .filter(train => diff_minutes(convertTime(train.departureTime,train.delayedBy),new Date())>30)
    .sort((a, b) => { // sort trains by ascending order of price, thenby descending order of seatAvailability and thenby descending order of departure time
        if(a.price.sleeper !== b.price.sleeper) return a.price.sleeper - b.price.sleeper;
        if(a.seatAvailability.sleeper !== b.seatAvailability.sleeper) return b.seatAvailability.sleeper - a.seatAvailability.sleeper;
        return convertTime(b.departureTime,b.delayedBy).getTime() - convertTime(a.departureTime,a.delayedBy).getTime();
    })
    .map(train => (
      <tr
        key={train.trainNumber + '_' + formatTime(train.departureTime,train.delayedBy)} // added timestamps to avoid duplicate keys
      >
        {/* Link train name to specific train page */}
        <td>
            <Link to={`/train/${train.trainNumber}`}> {train.trainName} </Link>
        </td>
        <td>{train.trainNumber}</td>
        <td>{train.time}</td>
        <td>
            <span className="red">{train.price.sleeper}</span>
            <span className="under">({train.price.AC})</span>
        </td>
        <td>
            <span className="red">{train.seatAvailability.sleeper}</span>
            <span className="under">({train.seatAvailability.AC})</span>
        </td>
      </tr>
    ));

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Train</th>
          <th>Train No.</th>
          <th>Departure</th>
            <th>Price</th>
            <th>Seats</th>
        </tr>
      </thead>
      <tbody>{filteredData}</tbody>
    </Table>
  );
};

export default DataDisplay;