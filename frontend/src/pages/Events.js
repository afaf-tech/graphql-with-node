import React, {Component} from 'react';

import Modal from '../components/modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import './Events.css';

class EventsPage extends Component{
    state={
        creating:false
    }

    modalConfirmHandler = ()=>{
        this.setState({creating:false})
    };
    
    modalCancelHandler = ()=>{
        this.setState({creating:false})
    };

    createEventHandler = ()=>{
        this.setState({creating:true});
    }
    render(){
        return(
            <React.Fragment>
                {this.state.creating && <Backdrop></Backdrop>}
                {this.state.creating &&<Modal title="Add Event" canCancel canConfirm onConfirm={this.modalConfirmHandler} onCancel={this.modalCancelHandler}>
                    <p>modal Content</p>
                </Modal>}
                <div className="events-control">
                    <p>Share your own Events!</p>
                    <button className="btn" onClick={this.createEventHandler}>Create Event</button>
                </div>
            </React.Fragment>
            ) 
    }
}


export default EventsPage;