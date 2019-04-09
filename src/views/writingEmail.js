import React from 'react';
import Address from '../components/Address';
import Message from '../components/Message';
import { connect } from 'react-redux';

const mapStateToProps = store => ({
    emails: store.emails

})

const mapDispatchToProps = dispatch => ({

})


const WritingEmail = (props) => {
    return (
        
        <div className="writingEmail">
            <Address selectAddress={props.selectAddress} selAdd={props.selAdd} emails={props.emails} changeName={props.changeName} single={props.single}/>
            {props.emails.length ? null : <Message/>}
        </div>

    )
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(WritingEmail);