import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import Switch from "react-switch";

import * as actions from '../Actions/actions'

const mapStateToProps = store => ({
        recipient: store.recipient,
        emails: store.emails,
        address: store.selAddress,
        templateID: store.templateID,
        mode: store.mode
});

const mapDispatchToProps = dispatch => ({
    newRecip: data => dispatch(actions.newRecip(data)),
    setTemplate: data => dispatch(actions.setTemplate(data)),
    updateState: data => dispatch(actions.updateState(data))
})



class Message extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            headers: {
                from:"vicfaucon@gmail.com",
                to: this.props.address,
            },
            text: '',
            templates: new Map(),
            rendered: '',
            template: '',
            mode: true,
            newTemplate: false,
            subject: {temp:'', message: '', rendered: ''},
            focus: null,
            templateId: false
        }
    }


    async componentDidMount(){
        console.log("component is mounting: ", this.props.recipient, this.props.templateID, this.props.mode);
        await this.getTemplates();
        if(this.props.templateID) await this.selectTemplate(this.props.templateID);
        if(this.props.templateID && this.props.recipient) {
            console.log("Here")
            await this.setState({mode:!this.props.mode}, () => this.changeMode());
        }
        else await this.changeMode();

        
       
        
    }

    getTemplates = async () => {
        let response = await axios('http://localhost:4000/gettemplate');
        response = response.data.hits.hits;

        let templates = new Map();
        for(let key in response){
            templates.set(response[key]._id, response[key]._source);
        }
        this.setState( { templates } );

    }

    changeSubject = (e) => {
        let text = e.target.value;
        let nwSub = {...this.state.subject};
        if(this.state.mode) {
            nwSub.template = nwSub.rendered = text;
            if(this.props.recipient) nwSub.message = this.loadTemplate(this.state.subject.template);
            this.setState( { subject: nwSub });
        } else {
            nwSub.rendered = nwSub.message = text;
            this.setState( {subject: nwSub} );
        }
    }

    changeMessage = (e) => {
        let text = e.target.value;
        if(this.state.mode) {
            this.setState( { template: text, rendered: text }, () => console.log(this.state) );
            if(this.props.recipient) this.setState( { text: this.loadTemplate(this.state.template) } );
        } else {
            this.setState( {rendered: text, text} )
        }
    }

    upFirst = (word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);

    }

    changeMode = () => {
        if(!this.props.recipient || !this.state.templateId) return this.setState( {mode: true});

        this.setState( {mode: !this.state.mode }, async () => {
            console.log(this.state.mode)
            this.props.updateState(['mode', this.state.mode])
            let nwSubj = {...this.state.subject}
            if(!this.state.mode){
                this.templateAction('update');
                this.getTemplates();
                nwSubj.rendered = nwSubj.message
                this.setState( { rendered: this.state.text, subject: nwSubj } );
            } else {
                nwSubj.rendered = nwSubj.template;
                this.setState( {rendered: this.state.template,  subject: nwSubj} )
            }
        });
    }

  

    placeAttribute = (e) => {

        if(e.target.value === 'Add attribute') return;
    
        let textemp = this.state.focus === 'message' ? this.state.template.slice(0) : this.state.subject.template.slice(0);

        let text = this.state.focus === 'message' ? document.getElementById('emailEditor') : document.getElementById('subject');

        let nwTemp = textemp.split("")

        if(text.selectionStart === text.selectionEnd){
            nwTemp.splice(text.selectionStart, 0, ..."{"+e.target.value+"}".split(''));
        } else {
            nwTemp.splice(text.selectionStart, text.selectionEnd - text.selectionStart, ..."{"+e.target.value+"}".split(''))
        }

        nwTemp = nwTemp.join("");

        
        if(this.state.focus === 'message') this.setState( { template: nwTemp, rendered: nwTemp} );
        else {
            let nwSubj = {...this.state.subject};
            nwSubj.template = nwSubj.rendered = nwTemp;
            this.setState( { subject: nwSubj } );
        }
  
        document.getElementsByTagName('select')[0].value = 'Add attribute';

    }

    sendMessage = () => {
        let body = "";
        let headers = {...this.state.headers, subject: this.state.subject.message}
        console.log(headers);
        for(let h in headers){
            body += h += ": " + headers[h] + "\r\n"
        }
        body += "\r\n" + this.state.text;

        const sendRequest = window.gapi.client.gmail.users.messages.send({
            'userId': 'me',
            'resource': {
                'raw': window.btoa(body)
            }
        })

        return sendRequest.execute((a)=> {console.log(a)}, (error)=>{console.log(error)})

    }

    templateAction = async (action) => {
        console.log(action);
        switch(action){
            case "save":
                axios.post('http://localhost:4000/recordtemplate', {
                    name: document.getElementById("templateName").value,
                    subject: this.state.headers.subject,
                    text: this.state.template
                }).then(async (resp) => {
                    console.log(resp);
                    this.setState({newTemplate: false, templateId:document.getElementById("templateName").value });
                    this.getTemplates();
                });
                break;
            
            case "delete":
                let del = await axios.post("http://localhost:4000/deletetemplate", {name: this.state.templateId});
                console.log(del);
                break;

            case "update":
                let upd = await axios.post('http://localhost:4000/updatetemplate', {name: this.state.templateId, subject:this.state.subject.template, text: this.state.template});
                console.log(upd);
                break;

            case "new":
                if(this.state.templateId) this.templateAction("update");
                this.setState({template:"", text:"", templateId: false, newTemplate: true})
                

        }

    }
 
    selectTemplate = (id) => {
        if(id === 'Add template') return;


        this.setState({templateId: id}, () => {
            document.getElementById('templatesName').value = id;
            this.props.setTemplate(id);
            let template;

            if(this.state.mode) {
                console.log(this.state.templates)
                template = this.state.templates.get(this.state.templateId);
                let nwSubj = {...this.state.subject};
                nwSubj.rendered = nwSubj.template = template.subject;
                
                this.setState( {template:template.text, rendered:template.text, subject:nwSubj}, () => {
                    if(this.props.recipient) {
                        let nwSubj = {...this.state.subject};
                        nwSubj.message = this.loadTemplate(template.subject);
                        this.setState( {text: this.loadTemplate(this.state.template), subject: nwSubj } );
                    }
                });

     
            }
            else {
                template = this.state.templates.get(this.state.templateId);
                let nwSubj = {...this.state.subject};
                nwSubj.rendered = nwSubj.message = this.loadTemplate(template.subject);
                nwSubj.rendered = template.subject;
                this.setState( {template:template.text, text: this.loadTemplate(this.state.template), rendered:this.loadTemplate(this.state.template)} )
            }
        });
        
        
    }
    
    loadTemplate = (temp) => {
        let text = temp.split('');


        let first = this.upFirst(this.props.recipient.first);
        let last = this.upFirst(this.props.recipient.last);
        let company = this.upFirst(this.props.recipient.domain.split('.')[0]);


        for(let i = 0; i < text.length-1; i++){
            if(text[i] === '{'){
                let j = i;
                while(text[j] !== "}"){
                    j = j + 1;
                }
                let word = text.slice(i+1, j).join('');
                let repwr;
                switch(word){
                    case "FullName":
                        repwr = first + " " + last;
                        break;
                    case "FirstName":
                        repwr = first;
                        break;
                    case "LastName":
                        repwr = last;
                        break;
                    case "Company":
                        repwr = company;
                        break;
                }
                text.splice(i, j-i+1, repwr)
                
            }
            
        }

        return text.join('');

    }



    render(){

        let templates = [];

        this.state.templates.forEach((x, i) => {
            if(x) templates.push(<option key={i} value={x.name}>{x.name}</option>)
        })

        let tempSet = <span>
                        <select onClick={this.placeAttribute}>
                            <option value="Add attribute">Add attribute</option>
                            <option value="FullName">Full Name</option>
                            <option value="FirstName">First Name</option>
                            <option value="LastName">Last Name</option>
                            <option value="Company">Company</option>
                        </select>
                       
                    </span>
        

        return(
            <div className="Message">
                
                <div className="EmailForm">
                    <input id="to" placeholder="To" value={this.props.address}/>
                    <input  id="subject" placeholder="Subject" value={this.state.subject.rendered} onChange={this.changeSubject} onFocus={() => {this.setState({focus:'subject'})}}/>
                    
                    <div id="setting">
                        {this.state.newTemplate ?  <input id="templateName" placeholder="Name the new template"/> : null}
                        {this.state.mode ? tempSet : null}
                    
                        <Switch className="Switch" onChange={this.changeMode} checked={this.state.mode} />
                        {this.state.newTemplate ? null :
                            <select id="templatesName" onClick={(e) => this.selectTemplate(e.target.value)}>
                                <option>Add template</option>
                                {templates}
                            </select>}
                    </div>

                    <textarea  id="emailEditor" placeholder="Type your email" value={this.state.rendered} onChange={this.changeMessage} onClick={this.getCursPos} onFocus={() => {this.setState({focus:'message'})}}/>
                    {this.state.mode ? 
                    <span>
                        <button id="delete" onClick={(e)=>this.templateAction(e.target.id)}>Delete</button>
                        <button id="update" onClick={(e)=>this.templateAction(e.target.id)}>Update</button>
                    </span>
                    : <button onClick={this.sendMessage}>Send</button>}
                    {this.state.newTemplate ? <button id="save" onClick={(e)=>this.templateAction(e.target.id)}>Save</button> :
                    <button id="new" onClick={(e)=>this.templateAction(e.target.id)}>New</button>}
                </div>
            </div>
        )
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Message);