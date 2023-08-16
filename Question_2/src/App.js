import './App.css';
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DataDisplay from './components/dataTable';
import TrainDetails from './components/TrainDetails';
const data = require('./components/data.js');


function App() {
  const [filteredData, setFilteredData] = useState([]);
  const [token , setToken] = useState(null);
  localStorage.setItem('clientID', "1f5c151e-0725-4cc4-9b76-4b4f5fd6b59e");
  localStorage.setItem('clientSecret', "UEuHXutsjQGrfaUu");
  const clientID = localStorage.getItem('clientID');
  const clientSecret = localStorage.getItem('clientSecret');

  useEffect(() => {
    async function register() {
      if(clientID && clientSecret) return;
      const response = await fetch('http://20.244.56.144/train/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "companyName": "AffordMed",
          "ownerName": "Rahul Raj",
          "rollNo": "S20200020296",
          "ownerEmail": "rahul.r20@iiits.in",
          "accessCode": "jYjgQH"
        })
      });
      const data = await response.json();
      console.log(data);
      localStorage.setItem('clientID', "1f5c151e-0725-4cc4-9b76-4b4f5fd6b59e");
      localStorage.setItem('clientSecret', "UEuHXutsjQGrfaUu");
    }
    // register();

    async function getToken() {
      if(token) return;
      const response = await fetch('http://20.244.56.144/train/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "companyName": "AffordMed",
          "clientID": clientID,
          "ownerName": "Rahul Raj",
          "ownerEmail": "rahul.r20@iiits.in",
          "rollNo": "S20200020296",
          "clientSecret": clientSecret
        })
      });
      const data = await response.json();
      console.log(data);
      localStorage.setItem('token', data.access_token);
      setToken(data.access_token);
    }
    getToken();

    async function fetchData() {
      console.log(token);
      const response = await fetch('http://20.244.56.144/train/trains', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      console.log(data);
      setFilteredData(data);
    }
    fetchData();
  }, [token]);

  return (
    <div className="App">
      <Router>
      <Routes>
          <Route path="/" element={<DataDisplay filteredData={filteredData?filteredData:data} />}>
          <Route path="/train/:trainID" component={TrainDetails} />
          </Route>
      </Routes> 
      </Router>       
    </div>
  );
}

export default App;
