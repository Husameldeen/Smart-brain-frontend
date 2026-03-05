import { useReducer} from 'react';
import './App.css';
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

function reducer(state, action) {
  switch(action.type) {
    case 'loadUser':
      return {
        ...state,
        user: {
          id: action.payload.id,
          name: action.payload.name,
          email: action.payload.email,
          entries: action.payload.entries,
          joined: action.payload.joined
        }
      }
    case 'signout':
      return initialState
    case 'signin':
      return {
        ...state,
        route: action.payload,
      }
    case 'home':
      return {
        ...state,
        isSignedIn: true,
      }
    case 'setRoute':
      return {
        ...state,
        route: action.payload,
      }
    case 'setInput':
      return {
        ...state,
        input: action.payload,
      }
    case 'setURL':
      return {
        ...state,
        imageUrl: action.payload,
      }
    case 'setEntries':
      return {
        ...state,
        user: {
          ...state.user, 
          entries: state.user.entries + 1
        },
      }
    case 'setBox':
      return {
        ...state,
        box: action.payload,
      }
    case 'clearBox':
      return {
        ...state,
        box: {},
      }
    default : throw new Error('Unkown type')
  }
} 

function App() {

  const [state, dispatch] = useReducer(reducer, initialState)

  const { input, imageUrl, box, route, isSignedIn, user } = state
  const { id, name, entries } = user

  const loadUser = (data) => {
    dispatch({type: 'loadUser', payload: data})
  }

  const calculateFaceLocation = (data) => {
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

  const displayFaceBox = (box) => {
    dispatch({type: 'setBox', payload: box})
    //this.setState({box: box});
  }

  const onButtonSubmit = () => {
    dispatch({type: 'setURL', payload: input})
    //console.log(this.state.input)

    fetch("https://smart-brain-backend-phi.vercel.app/api", {
          method: 'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
          imageUrl: input
          })
        })
    .then(response => response.json())
    .then(result => {
      if (Object.keys(result.outputs[0].data).length) {
          fetch('https://smart-brain-backend-phi.vercel.app/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: id
            })
          })
          .then(response => response.json())
          .then(count => {
            dispatch({type: 'setEntries'})
          })

          displayFaceBox(calculateFaceLocation(result))
          
        } else {
          dispatch({type: 'clearBox'})
        }
    })
    .catch(error => console.error('error', error));
  }

  const onRouteChange = (route) => {
    if (route === 'signout') {
      dispatch({type: 'signout'})
    } else if (route === 'home') {
      dispatch({type: 'home'})
    }
    dispatch({type: 'setRoute', payload: route})
  }


  return (
    <div className="App">
      <div className='header'>
        <Logo />
        <Nav 
          dispatch={dispatch} 
          isSignedIn={isSignedIn}
        />
      </div>
      {route === 'home'
        ? <div>
            <Rank 
              entries={entries} 
              name={name}
            />
            <ImageLinkForm 
              dispatch={dispatch} 
              onButtonSubmit={onButtonSubmit}
            />
            <FaceRecognition
            box={box}
            imageUrl={imageUrl}
            />
          </div>
        : (route === 'signin' 
          ? <SignIn loadUser={loadUser} onRouteChange={onRouteChange}/>
          : <SignUp loadUser={loadUser} onRouteChange={onRouteChange} />
          )
      }
      <Particles />
    </div>
  );
}

export default App;
