import React from 'react';
import './nav.css';

const Nav = ({onRouteChange, isSignedIn}) => {
        if (isSignedIn) {
            return (
                <nav>
                    <p 
                        onClick={() => onRouteChange('signout')}
                        className='f3 link dim black underline pa3 pointer'>
                        Sign Out
                    </p>
                </nav>
            )
        } else {
            return (
                <div>
                    <nav>
                        <p onClick={() => onRouteChange('signin')}
                            className='f3 link dim black underline pa3 pointer'>
                            Sign In
                        </p>
                        <p onClick={() => onRouteChange('signup')}
                            className='f3 link dim black underline pa3 pointer'>
                            Sign Up
                        </p>
                    </nav>
                </div>
            )
        }
}

export default Nav;