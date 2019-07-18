import React, { Component } from 'react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Card, Button, CardTitle, CardText, Form, FormGroup, Label, Input } from 'reactstrap';

import './App.css';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

class App extends Component {
  state = {
    location: {
      lat: 51.505,
      lng: -0.09,
    },
    haveUsersLocation: false,
    zoom: 2,
    userMessage: {
      name: '',
      message: ''
    }
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition((position) =>{
      this.setState({
        location: {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        },
        haveUsersLocation: true,
        zoom: 13
      });
    }, () => {
      console.log('uh oh... they didnt give us their location...');
      fetch('https://ipapi.co/json')
        .then(res => res.json())
        .then(location => {
          this.setState({
            location: {
              lat: location.latitude,
              lng: location.longitude
            },
            haveUsersLocation: true,
            zoom: 13
          });
        });
    });
  }

  formSubmitted = (event) => {
    event.preventDefault();
    console.log(this.state.userMessage);
  }

  valueChanged = (event) => {
    const { name, value } = event.target;
    this.setState((prevState) => ({
      userMessage: {
        ...prevState.userMessage,
        [name]: value
      }
    }))
  }


  render() {
    const position = [this.state.location.lat, this.state.location.lng];
    return (
      <div className="map">
        <Map className="map" center={position} zoom={this.state.zoom}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          { 
            this.state.haveUsersLocation ?
            <Marker position={position}>
              <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
              </Popup>
            </Marker> : ''
          }
        </Map>
        <Card body className="messages-form">
          <CardTitle>Welcome to Wordly</CardTitle>
          <CardText>Leave a message with your location!</CardText>
          <CardText>Thanks for stopping by! </CardText>
          <Form onSubmit={this.formSubmitted}>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input
                onChange={this.valueChanged}
                type="text" 
                name="name" 
                id="name" 
                placeholder="Enter your name" />
            </FormGroup>
            <FormGroup>
              <Label for="message">Message</Label>
              <Input 
                onChange={this.valueChanged}
                type="textarea" 
                name="message" 
                id="message" 
                placeholder="Enter your message" />
            </FormGroup>
            <Button type="submit" color="info" disabled={!this.state.haveUsersLocation}>Send</Button>
          </Form>
        </Card>
      </div>
    );
  }
}

export default App;
