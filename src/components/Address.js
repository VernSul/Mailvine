import React from 'react';
import { connect } from 'react-redux';

import * as actions from '../Actions/actions';


const mapStateToProps = store => ({
    recipient: store.recipient,
    emails: store.emails
});

const mapDispatchToProps = dispatch => ({
    newRecip: data => dispatch(actions.newRecip(data)),
    setAddress: data => dispatch(actions.setAddress(data)),
    setEmails: data => dispatch(actions.setEmails(data)),

    

})

const Address = (props) => {

    console.log(props.emails)

    function copy(e){
        navigator.clipboard.writeText(props.emails[e.target.id]);
    };


    function sendAddress() {
        let fullName = document.getElementById('fullName').value.split(" ")

        let obj = { first: fullName.shift().toLowerCase(),
                    last: fullName.join("").toLowerCase(),
                    domain: document.getElementById('domain').value.toLowerCase() 
                                }
        return props.single(obj);
    }



    let emails = props.emails.map((x, i) => {
        return <div id="email"><li id={i} key={i} onClick={(e)=>{props.selectAddress(e.target.id)}}>
                        {x}
                    </li>
                    <button id={i} className="far fa-clipboard" onClick={copy}/>
                </div>
              
    })

   
        return (
            <div className="Address">
                <span id="nameDomain">
                    <input id="fullName" type="text" placeholder="Elon Musk" onChange={props.changeName}/>
                    <input id="domain" type="text" placeholder="tesla.com"/>
                    <button id="submit" onClick={sendAddress}>Find email</button>
                </span>
                {props.emails.length ? <div className="EmailsList">{emails}</div> : null}
            </div>
        )
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Address);