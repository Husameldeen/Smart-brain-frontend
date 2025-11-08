import React from 'react';
import Tilt from 'react-parallax-tilt';
import brain from './brain.png';

const Logo = () => {
    return (
        <div className='ma4 mt0'>
            <Tilt className='br2 shadow-2 pa3' style={{ 'height': '125px', width: '125px' }}>
                <div>
                    <img src={brain} alt='barin'/>
                </div>
            </Tilt>
        </div>
    )
}

export default Logo;