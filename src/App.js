import React, {Component} from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
//import Clarifai from 'clarifai';
import ParticlesBg from 'particles-bg';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import './App.css';

const returnclarifaiReturnOptions = (imageUrl) => {
// Your PAT (Personal Access Token) can be found in the Account's Security section
const PAT = 'YOUR_PERSOONAL_ACCESS TOKEN';
// Specify the correct user_id/app_id pairings
// Since you're making inferences outside your app's scope
const USER_ID = 'YOUR_USER_ID';
const APP_ID = 'Machinelearning';
// Change these to whatever model and image URL you want to use
const MODEL_ID = 'face-detection';
const IMAGE_URL = imageUrl;


const raw = JSON.stringify({
  "user_app_id": {
      "user_id": USER_ID,
      "app_id": APP_ID
  },
  "inputs": [
      {
          "data": {
              "image": {
                  "url": IMAGE_URL
                  // "base64": IMAGE_BYTES_STRING
              }
          }
      }
  ]
});


const requestOptions = {
  method: 'POST',
  headers: {
      'Accept': 'application/json',
      'Authorization': 'Key ' + PAT
  },
  body: raw
};

return requestOptions;
}

const particlesOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}
class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange =(event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = (MODEL_ID) => {
    this.setState({imageUrl: this.state.input});
    console.log('Click')
    //app.models.predict('face-detection', this.state.input)
    fetch("https://api.clarifai.com/v2/models/" + 'face-detection' + "/outputs", returnclarifaiReturnOptions(this.state.input))
        .then(response => response.json())
        .then(response => {
        console.log('hi')
          if (response) {
            fetch('http://localhost:3000/image', {
              method: 'put',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count}))
            })
        }
        //this.displayFaceBox(this.calculateFaceLocation(response))
      })
   }

   onRouteChange = (route) => {
    if(route === 'signout') {
      this.setState({isSignedIn: false})
    } else if (route ==='home'){
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
   }
  
  render() {
    const  {isSignedIn, imageUrl, route, box} = this.state;
  return (
    <div className="App">
    <ParticlesBg type="fountain" bg={true} className='particles'
      params={{particlesOptions}}
    />
    <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
    {route === 'home'
      ?<div>
      <Logo/>
      <Rank/>
      <ImageLinkForm 
      onInputChange={this.onInputChange} 
      onButtonSubmit={this.onButtonSubmit}
      />
      <FaceRecognition box = {box} imageUrl={imageUrl}/>
      </div>
      :(
        route === 'signin'
      ?<Signin onRouteChange={this.onRouteChange}/>
      :<Register onRouteChange={this.onRouteChange}/>
      )
    }
    </div>
  );
}
}

export default App;
