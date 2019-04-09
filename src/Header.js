import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import pic from './assets/btn_google_signin_dark_pressed_web@2x.png';


const mapStateToProps = store => ({
    recipient: store.recipient,
    emails: store.emails,
    userInfos: store.userInfos,
    signedIn: store.signedIn
  });
  

class Header extends React.Component{
    constructor(props){
        super(props);
    }
    

    render() {
        console.log(this.props.userInfos)
        return (
            <div className="Header">
                <span>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/find">Address Finder</Link></li>
                    <li><Link to="/email">Campaign</Link></li>
        
                </span>
                {this.props.signedIn ? 
                    <img id="signout_button" onClick={this.props.handleSignoutClick} src={this.props.userInfos.picUrl}></img> : 
                    <img id="authorize_button" onClick={this.props.handleAuthClick} src={pic}></img>}
                
            </div>
        )
    }


}

export default connect(
    mapStateToProps,
    )(Header);