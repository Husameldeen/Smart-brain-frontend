import {Component} from 'react';
import './App.css';
//import Clarifai from 'clarifai';
import SignIn from './components/SignIn/SignIn';
import SignUp from './components/SignUp/SignUp';
import Nav from './components/nav/Nav';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Particles from './components/Particles/Particles';

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
  constructor(props) {
    super(props);
    this.state = initialState
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }
    })
    //console.log(this.state.user)
  }




  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }




  onInputChange = (event) => {
    this.setState({input: event.target.value})
    //console.log(event.target.value)
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    //console.log(this.state.input)

    fetch("http://localhost:3000/api", {
          method: 'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
          imageUrl: this.state.input
          })
        })
    .then(response => response.json())
    .then(result => {
      if (Object.keys(result.outputs[0].data).length) {
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, { entries: Number(this.state.user.entries) + 1}))
          })

          this.displayFaceBox(this.calculateFaceLocation(result))
          
        } else {
          this.setState({box: {}})
        }
    })
    .catch(error => console.error('error', error));
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState)
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route})
  }

  render() {
    return (
      <div className="App">
        <div className='header'>
          <Logo />
          <Nav 
            onRouteChange={this.onRouteChange} 
            isSignedIn={this.state.isSignedIn}
          />
        </div>
        {this.state.route === 'home'
          ? <div>
              <Rank 
                entries={this.state.user.entries} 
                name={this.state.user.name}
              />
              <ImageLinkForm 
                onInputChange={this.onInputChange} 
                onButtonSubmit={this.onButtonSubmit}
              />
              <FaceRecognition
              box={this.state.box}
              imageUrl={this.state.imageUrl}
              />
            </div>
          : (this.state.route === 'signin' 
            ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            : <SignUp loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
            )
        }
        <Particles />
      </div>
    );
  }  
  
}

export default App;
