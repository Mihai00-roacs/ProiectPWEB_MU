import React from 'react';
import pic from '../CarSharing-logos_white2.png'
function Home() {

      return (
        <main role="main" className="pb-3">
        <div className="text-center">
            <h1 className="display-4">Welcome To</h1>
                  <img src={pic} alt="Car-Sharing-logos-white" style={{ width: '50%', height: '50%', margin: '0px -10px 0px 0px' }} />
            <h1></h1>
            <p style={{fontSize: 18 }}>A better way of peer to peer car rental.</p>
              </div>
          </main>
    );
}
export default Home;
