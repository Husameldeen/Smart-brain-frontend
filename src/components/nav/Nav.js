import React from 'react';
import './nav.css';

const Nav = ({dispatch, isSignedIn}) => {
        if (isSignedIn) {
            return (
                <nav>
                    <p 
                        onClick={() => dispatch({type: 'signout'})}
                        className='f3 link dim black underline pa3 pointer'>
                        Sign Out
                    </p>
                </nav>
            )
        } else {
            return (
                <div>
                    <nav>
                        <p 
                            onClick={() => dispatch({type: 'signin', payload: 'signin'})}
                            className='f3 link dim black underline pa3 pointer'>
                            Sign In
                        </p>
                        <p onClick={() => dispatch({type: 'setRoute', payload: 'signup'})}
                            className='f3 link dim black underline pa3 pointer'>
                            Sign Up
                        </p>
                    </nav>
                </div>
            )
        }
}

export default Nav;