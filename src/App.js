import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import { useState } from 'react';
import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

import 'bootstrap/dist/css/bootstrap.css';





function App() {

  useEffect(() => {

    getBookings();
  }, []);


  class Booking {
    description
    status
  }

  //Inicialización variables
  const  [description, setDescription] = useState("")
  const  [status, setStatus] = useState("")
  const  [data, setData] = useState([]);
  const  [booking, setBooking] = useState([]);

  const  [isDivItems, setDivItems] = useState(true);
  const  [isDivItem, setDivItem] = useState(false);
  const  [isDivForm, setDivForm] = useState(false);
  const  [isBtnCreate, setBtnCreate] = useState(true);

  
  function createBooking(e) {
    e.preventDefault();
    var BookingV = new Booking();
    BookingV.status = status;
    BookingV.description = description;
    axios.post('http://barrel-jennifer.test/create', BookingV).then((response) => {
      getBookings();
      setDivItems(!isDivItems);
      setDivForm(!isDivForm);
      setBtnCreate(!isBtnCreate);
    }).catch(error => {
      errorPopup();
    });
  }

  function updateBooking(event,idBooking) {
    event.preventDefault();
    var BookingV = new Booking();
    BookingV.status = status;
    BookingV.description = description;

    const data = {
      BookingV: BookingV,
      idBooking: idBooking
    };

    axios.post('http://barrel-jennifer.test/update', data).then((response) => {
      getBookings();
      setDivItems(!isDivItems);
      setDivItem(!isDivItem);
    }).catch(error => {
      errorPopup();
    });
  }

  function removeBooking(id) {
    var idBooking = id;
    axios.post('http://barrel-jennifer.test/remove', idBooking).then((response) => {
      getBookings();
    }).catch(error => {
      errorPopup();
    });
  }

  function deleteBooking(id) {
    var idBooking = id;
    axios.post('http://barrel-jennifer.test/delete', idBooking).then((response) => {
      getBookings();
    }).catch(error => {
      errorPopup();
    });
  }


  //Obtener todos los Booking que tenemos en la BBDD
  function getBookings(e) {
    axios.get('http://barrel-jennifer.test/showItems').then((response) => {
      setData(response.data);
    }).catch(error => {
      errorPopup();
    });

  }

  //Obtener la info de un Booking mediante el ID
  function getBooking(idBooking) {
    axios.put('http://barrel-jennifer.test/show', idBooking).then((response) => {
      setBooking(response.data);
      setDescription(response.data[0].desciption);
      setStatus(response.data[0].status)
      setDivItems(!isDivItems);
      setDivItem(!isDivItem);
    }).catch(error => {
      errorPopup();
    });
  }

  //Funcion para poner visible el Form
  const setElementVisibility = () => {
    setDivForm(!isDivForm);
    setBtnCreate(!isBtnCreate);
    setDivItems(!isDivItems);
    setDescription('');
    setStatus(true)
  };

  const handleCheckboxChange = (event) => {
    setStatus(event.target.checked);
  };


  function errorPopup(e) {
    Swal.fire({
      title: '¡Alerta!',
      text: 'Algo no ha ido como debería.',
      icon: 'warning',
      confirmButtonText: 'Aceptar'
    });
  }

return (
    
  <div className="App">
    <div class="container">
      <div style={{
          display: isDivItems ? 'block' : 'none',
          height: isDivItems ? 'auto' : 0,
          overflow: 'hidden',
        }} >
        <h2>List of Booking</h2>
        <table class="table">
          <thead>
            <tr>
              <th scope="col">ID Booking</th>
              <th scope="col">Satatus</th>
              <th scope="col">Desciption</th>
              <th scope="col">CreatedAt</th>
              <th scope="col">DeletedAt</th>
              <th scope="col">View</th>
              <th scope="col">Delete</th>
              <th scope="col">Remove permanent</th>
            </tr>
          </thead>
          <tbody>
            <>
            {data.map((item, index) => (
              <React.Fragment key={index}>
                <tr>
                  <th scope="row">{JSON.stringify(item.id)}</th>
                  <td>{JSON.stringify(item.status)}</td>
                  <td>{item.desciption}</td>
                  <td>{new Date(item.createdAt.date).toISOString().split('T')[0]}</td>
                  <td>{item.deletedAt && new Date(item.deletedAt.date).toISOString().split('T')[0]}</td>
                  <td><button class="bg-info text-white" onClick={() => getBooking(item.id)}><FontAwesomeIcon icon={faEye} /></button></td>
                  <td><button class="bg-warning text-white" onClick={() => deleteBooking(item.id)}><FontAwesomeIcon icon={faTimes} /></button></td>
                  <td><button class="bg-danger text-white" onClick={() => removeBooking(item.id)}><FontAwesomeIcon icon={faTimes} /></button></td>
                </tr>
              </React.Fragment>
            ))}
            </>
          </tbody>
        </table>
        <button style={{
          display: isBtnCreate ? 'block' : 'none',
          height: isBtnCreate ? 'auto' : 0,
          overflow: 'hidden',
        }} className={`btn btn-success`} onClick={setElementVisibility}>Create new</button>
      </div>
      
      <div style={{
          display: isDivItem ? 'block' : 'none',
          height: isDivItem ? 'auto' : 0,
          overflow: 'hidden',
        }} >
        <>
          {booking.map((booking, index) => (
            <React.Fragment key={index}>
              <form>
                <h2>Display  de Booking {booking.id}</h2>
                <div class="form-group">
                  <label for="description">Description</label>
                  <input id="description" type="textarea" name="description" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Enter description"/>
                </div>
                <div class="form-check">
                  <input type="checkbox"  id="Check" name="status" checked={status} onChange={handleCheckboxChange}/>
                  <label class="form-check-label" for="Check"> Check me out</label>
                </div>
                <button class="btn btn-primary" onClick={(event) => updateBooking(event, booking.id)}>Update</button>
              </form>
            </React.Fragment>
          ))}
        </>
      </div>

      <div style={{
          display: isDivForm ? 'block' : 'none',
          height: isDivForm ? 'auto' : 0,
          overflow: 'hidden',
        }} >
        <form>
          <h2>Create a new Booking entity</h2>
          <div class="form-group">
            <label for="descriptionFrom">Description</label>
            <input id="descriptionFrom" type="textarea" name="descriptionFrom" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Enter description"/>
          </div>
          <div class="form-check">
            <input type="checkbox"  id="checkboxForm" name="statusFrom" checked={status} onChange={handleCheckboxChange}/>
            <label class="form-check-label" for="checkboxForm"> Check me out</label>
          </div>
          <button class="btn btn-primary" onClick={createBooking}>Create</button>
        </form>
      </div>
    </div>
  </div>
  );
}

export default App;
