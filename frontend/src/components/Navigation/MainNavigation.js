import React, { Component } from 'react';
import {NavLink} from 'react-router-dom';


import AuthContext from '../../context/auth-context';
import './MainNavigation.css';
// NaavLink is used for preventing anchor default event to reload the current page
// instead it will behave like anchor but it still keeps on the same page 
class mainNavigation extends Component{
    render(){
        return(
            <AuthContext.Consumer>
            {(context) => {
                return (
                    <header className="main-navigation">
                        <div className="main-navigation_logo">
                            <h1>Easy Event</h1>
                        </div>
                        <nav className="main-navigation_item">
                            <ul>
                                {!context.token && (<li><NavLink to="/auth">Authenticate</NavLink></li>)}
                                <li><NavLink to="/events">Event</NavLink></li>
                                {context.token && (
                                    <React.Fragment>
                                        <li><NavLink to="/bookings">Booking</NavLink></li>
                                        <li><button onClick={context.logout}>Logout</button></li>
                                    </React.Fragment>
                                    )

                                }
                            </ul>
                        </nav> 
                    </header>
                )
            }}
            </AuthContext.Consumer>
        )
    }
}
export default mainNavigation;