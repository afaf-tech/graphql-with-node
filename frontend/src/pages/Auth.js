import React, {Component} from 'react';

import './Auth.css';

import AuthContext from '../context/auth-context';

class AuthPage extends Component{
    // if isLogin == true then current is state is on Login mode
    state = {
        isLogin: true
    }

    static contextType = AuthContext;
    constructor(props){
        super(props);
        this.emailEl = React.createRef();
        this.passwordEl = React.createRef();
    }
    switchModeHandler = ()=>{
        this.setState(prevState=> {
            return {isLogin: !prevState.isLogin};
        })
    }

    submitHandler = (event) => {
        event.preventDefault();
        // we dont need to bind when calling this method due to having used arrow function
        const email = this.emailEl.current.value;
        const password = this.passwordEl.current.value;

        if(email.trim().length ===0 || password.trim().length ===0 ){
            return;
        }
        console.log(email,password);

        let requestBody={
            query: `
                query {
                    login( email:"${email}", password:"${password}"){
                        userId
                        token
                        tokenExpiration
                    }
                }
            `
        };

        if(!this.state.isLogin){
            requestBody = {
                query: `
                    mutation {
                        createUser(userInput: { email: "${email}", password: "${password}"}){
                            _id
                            email
                        }
                    }
                `
            }
        }

        
        fetch('http://localhost:8000/graphql',{
            method:'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type':'application/json'
            }
        }).then(res =>{
            if(res.status !== 200 && res.status !== 201){
                throw new Error('Failed');
            }
            return res.json();
        })
        .then(responData=>{
            if(responData.data.login.token){
                this.context.login(
                    responData.data.login.token, 
                    responData.data.login.userId,
                    responData.data.login.tokenExpiration
                )
            }
            
        })
        .catch(err=> {
            console.log(err);
            
        })
    }

    render(){
        return (
            <form className="auth-form" onSubmit={this.submitHandler}>
                <div className="form-control">
                    <label htmlFor="email" id="email">E-Mail</label>
                    <input type="email" id="email" ref={this.emailEl}/>   
                </div>
                <div className="form-control">
                    <label htmlFor="password" id="password">Password</label>
                    <input type="password" id="password" ref={this.passwordEl}/>   
                </div>
                <div className="form-actions">
                    <button type="submit">Submit</button>
                    <button type="button" onClick={this.switchModeHandler}>
                        Switch to {this.state.isLogin ? 'SignUp' : 'Login'}
                    </button>
                </div>
            </form>
        )
    }
}


export default AuthPage;