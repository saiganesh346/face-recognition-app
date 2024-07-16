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

/*const returnclarifaiReturnOptions = (imageUrl) => {
const PAT = 'b07c12096a22467a8b0b7bdb037351d2';
// Specify the correct user_id/app_id pairings
// Since you're making inferences outside your app's scope
const USER_ID = 'saiganesh346';
const APP_ID = 'Machinelearning';
// Change these to whatever model and image URL you want to use
const MODEL_ID = 'face-detection';
const IMAGE_URL = imageUrl;*/

/*const App = new Clarifai.App({
  apikey : 'bfef1f55ec444b708a60771b61251f77'
})*/

/*const raw = JSON.stringify({
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
    MODEL_ID : MODEL_ID,
    headers: {
        'Accept': 'application/json',
        'Authorization': 'Key ' + PAT
    },
    body: raw
};

return requestOptions;
}*/


const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

//  componentDidMount(){
//    fetch('http://localhost:3000/')
//    .then(response => response.json())
//    .then(console.log)
//  }
  
  loadUser = (data) => {
    this.setState({user : {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: clarifaiFace.right_col * width,
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange =(event) => {
    this.setState({input: event.target.value});
  }

onButtonSubmit = () => {
  this.setState({imageUrl: this.state.input});
   fetch('http://localhost:3000/imageurl', {
        method : 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          input: this.state.input
        })
      })
      .then(response => response.json())
  .then(response => {
    if(response) {
      fetch('http://localhost:3000/image', {
        method : 'put',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          id: this.state.user.id
        })
      })
      .then(response => response.json())
      .then(count => {
        this.setState(Object.assign(this.state.user,{ entries: count}))
      })
      .catch(console.log)
    }
    this.displayFaceBox(this.calculateFaceLocation(response))
  })
  .catch(err => console.log(err));
}  

   onRouteChange = (route) => {
    if(route === 'signout') {
      this.setState(initialState)
    } else if (route ==='home'){
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
   }
  
  render() {
    const  {isSignedIn, imageUrl, route, box} = this.state;
  return (
    <div className="App">
    <ParticlesBg type="fountain" bg={true} 
    />
    <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
    {route === 'home'
      ?<div>
      <Logo/>
      <Rank 
        name={this.state.user.name}
        entries={this.state.user.entries}
      />
      <ImageLinkForm 
      onInputChange={this.onInputChange} 
      onButtonSubmit={this.onButtonSubmit}
      />
      <FaceRecognition box = {box} imageUrl={imageUrl}/>
      </div>
      :(
        route === 'signin'
      ?<Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
      :<Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
      )
    }
    </div>
  );
}
}

export default App;
