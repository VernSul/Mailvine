import React from 'react';
import Address from './components/Address';
import WritingEmail from './views/writingEmail';
import Header from './Header';
import Home from './views/Home';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import * as actions from './Actions/actions';
import privData from './private_data.json'

const priv = privData[0];



const mapStateToProps = store => ({
  recipient: store.recipient,
  emails: store.emails,
  signedIn: store.signedIn
});

const mapDispatchToProps = dispatch => ({
  newRecip: data => dispatch(actions.newRecip(data)),
  setEmails: data => dispatch(actions.setEmails(data)),
  setAddress: data => dispatch(actions.setAddress(data)),
  setUserInfo: data => dispatch(actions.setUserInfo(data)),
  updateState: data => dispatch(actions.updateState(data))

})


class App extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            selAdd: false,
            emails: [],
            CLIENT_ID: priv.CLIENT_ID,
            API_KEY: priv.API_KEY,
            DISCOVERY_DOCS: [priv.DISCOVERY_DOCS],
       
            // Authorization scopes required by the API; multiple scopes can be
            // included, separated by spaces.
            SCOPES: 'https://www.googleapis.com/auth/gmail.readonly'+' https://www.googleapis.com/auth/gmail.send'

        }
        this.single = this.single.bind(this);
        this.initClient = this.initClient.bind(this);
        // this.updateSigninStatus = this.updateSigninStatus.bind(this);


    }


    async initClient() {
        const s = this.state;
        await window.gapi.client.init({
          apiKey: s.API_KEY,
          clientId: s.CLIENT_ID,
          discoveryDocs: s.DISCOVERY_DOCS,
          scope: s.SCOPES,
        }).then(async () => {
          // Listen for sign-in state changes.
          //window.gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus);

          // Handle the initial sign-in state.
          // that.updateSigninStatus(window.gapi.auth2.getAuthInstance().isSignedIn.get());
          this.props.updateState(["signedIn", window.gapi.auth2.getAuthInstance().isSignedIn.get()])
  

          if(window.gapi.auth2.getAuthInstance().isSignedIn.get()){
            let resp = await window.gapi.auth2.getAuthInstance();
            this.props.setUserInfo(resp.currentUser.Ab.w3);
          }


        },(error) => {
            console.log(error);
            this.appendPre(JSON.stringify(error, null, 2));
        });

      }


    /**
       *  Sign in the user upon button click.
       */
      handleAuthClick = async (event) => {
        let resp = await window.gapi.auth2.getAuthInstance().signIn();
        this.props.setUserInfo(resp.w3);
        this.props.updateState(['signedIn', true]);
      }

      /**
       *  Sign out the user upon button click.
       */
      handleSignoutClick = (event) => {
        window.gapi.auth2.getAuthInstance().signOut();
        this.props.updateState(['signedIn', false]);
      }

      appendPre = (message) => {
        // var pre = document.getElementById('content');
        // var textContent = document.createTextNode(message + '\n');
        // pre.appendChild(textContent);
      }
      
      
      listLabels = () => {
        let that = this;
        window.gapi.client.gmail.users.labels.list({
          'userId': 'me'
        }).then(function(response) {
          var labels = response.result.labels;
          that.appendPre('Labels:');

          if (labels && labels.length > 0) {
            for (let i = 0; i < labels.length; i++) {
              var label = labels[i];
              that.appendPre(label.name)
            }
          } else {
            that.appendPre('No Labels found.');
          }
        });
      }


    componentDidMount(){
        window.gapi.load('client:auth2', this.initClient);
    }

    selectAddress = async (i) => {
      if(!this.props.signedIn) await this.handleAuthClick();

      await this.props.setAddress(this.props.emails[i]);
      await this.props.setEmails([]);
      await this.props.history.push('/email');
    }

    single(obj) {
      console.log(obj);
        let forced = {
            first: "chris",
            last: "lee",
            domain: "bauerxcel.com"
        }
        fetch("http://localhost:4000/single", { 
            method: "POST",
            headers: {
                'Accept': 'application/json',   
                'Content-Type': 'application/json'
              },
            body: JSON.stringify(obj)
        }).then(data => {
            console.log(data);
            return data.json()})
        .then(emails => {
          let name = {...obj};
          this.props.setEmails(emails);
          this.props.newRecip(name);
          this.props.history.push('/find');
        })
    }


    render(){

        
        return (
            <div className="App">
              <Header handleSignoutClick={this.handleSignoutClick} handleAuthClick={this.handleAuthClick}/>
              <Switch>
                <Route path="/email" component={()=>{return <WritingEmail selectAddress={this.selectAddress} single={this.single} selAdd={this.state.selAdd} single={this.single} emails={this.state.emails} selectAddress={this.selectAddress} name={this.state.name} changeName={this.changeName}/> }}/>
                <Route path="/find" component={() => {return <Address single={this.single} selectAddress={this.selectAddress} selAdd={this.state.selAdd} changeName={this.changeName}/>}}/>
                <Route path="/" component={() => {return <Home single={this.single} emails={this.state.emails} selectAddress={this.selectAddress} selAdd={this.state.selAdd} changeName={this.changeName}/>}}/>
              </Switch>
            </div>
        )
    }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
  )(withRouter(App));