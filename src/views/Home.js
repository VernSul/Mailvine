import React from 'react';
import Address from '../components/Address';

const Home = (props) => {

    return (
        <div className="Home">
            <Address single={props.single} emails={props.emails} selectAddress={props.selectAddress} selAdd={props.selAdd} changeName={props.changeName}/>
            <div id="presentation">
                <p>In one click find an email address.</p>
                <p id="rightFloat">In another send it a message.</p>
                <p>Store your templates and save so much time copy pasting hundred times the same email.</p>
            </div>
        </div>
    )

}

export default Home;