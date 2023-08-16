import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function TrainDetails() {
  const { trainID } = useParams();
  const [trainDetails, setTrainDetails] = useState(null);

  useEffect(() => {
    fetch(`http://20.244.56.144/train/${trainID}`)
      .then(response => response.json())
      .then(data => setTrainDetails(data))
      .catch(error => console.error('Error fetching train details:', error));
  }, [trainID]);

  return (
    <div className="container mt-5">
      <h2>Train Details</h2>
      {trainDetails ? (
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">{trainDetails.trainName}</h5>
            <p className="card-text">Number: {trainDetails.trainNumber}</p>
            <p className="card-text">Departure: {trainDetails.departureTime.Hours}</p>
            
          </div>
        </div>
      ) : (
        <p>Loading train details...</p>
      )}
    </div>
  );
}

export default TrainDetails;
