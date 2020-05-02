import React, {Component} from 'react';

import Modal from '../components/modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';
import './Events.css';

import AuthContext from '../context/auth-context';

class EventsPage extends Component{
    state={
        creating:false,
        events:[]
    }

    static contextType = AuthContext;

    constructor(props){
        super(props);
        this.titleElRef = React.createRef();
        this.priceElRef = React.createRef();
        this.dateElRef = React.createRef();
        this.descriptionElRef = React.createRef();
    }

    componentDidMount(){
        this.fetchEvents();
    }

    modalConfirmHandler = ()=>{
        this.setState({creating:false})
        const title = this.titleElRef.current.value;
        const price = this.priceElRef.current.value;
        const date = this.dateElRef.current.value;
        const description = this.descriptionElRef.current.value;

        if(title.trim().length === 0 || 
                price <= 0 || 
                date.trim().length === 0 || 
                description.trim().length===0)
        {
            return;
        }
        const event= { title, price, date, description };
        console.log(event);

        const requestBody={
            query: `
                mutation {
                    createEvent( eventInput: {title:"${title}", date:"${date}", price:${price}, description:"${description}" }){
                       _id
                       title
                       description
                       price
                       date
                       creator {
                           _id
                           email
                       }
                    }
                }
            `
        };

        const token = this.context.token;

        fetch('http://localhost:8000/graphql',{
            method:'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type':'application/json',
                'Authorization': 'Bearer '+ token
            } 
        }).then(res =>{
            if(res.status !== 200 && res.status !== 201){
                throw new Error('Failed');
            }
            return res.json();
        })
        .then(responData=>{
            console.log(responData);
            this.fetchEvents();
        })
        .catch(err=> {
            console.log(err);
            
        })
        
        
    };
    
    modalCancelHandler = ()=>{
        this.setState({creating:false})
    };

    createEventHandler = ()=>{
        this.setState({creating:true});
    }

    fetchEvents = ()=>{
        const reqQuery={
            query: `
                query {
                    events {
                        _id
                        title
                        description
                        date
                        price
                        creator {
                            _id
                            email
                        }
                    }                    
                }
            `
        };

        fetch('http://localhost:8000/graphql',{
            method:'POST',
            body: JSON.stringify(reqQuery),
            headers: {
                'Content-Type':'application/json',
            } 
        }).then(res =>{
            if(res.status !== 200 && res.status !== 201){
                throw new Error('Failed');
            }
            return res.json();
        })
        .then(responData=>{
            console.log(responData);
            const events = responData.data.events;
            this.setState({events: events});
        })
        .catch(err=> {
            console.log(err);
            
        })
    }
    render(){
        const eventList = this.state.events.map(event=>{
            return <li key={event._id} className="events_list_items">{event.title}</li>;
        });
        return(
            <React.Fragment>
                {this.state.creating && <Backdrop></Backdrop>}
                {this.state.creating &&
                    <Modal 
                        title="Add Event" 
                        canCancel 
                        canConfirm 
                        onConfirm={this.modalConfirmHandler} 
                        onCancel={this.modalCancelHandler}
                    >
                        <form>
                            <div className="form-control">
                                <label htmlFor="title">Title</label>
                                <input type="text" id="title" ref={this.titleElRef} ></input>
                            </div>
                            <div className="form-control">
                                <label htmlFor="price">Price</label>
                                <input type="number" id="price" ref={this.priceElRef}></input>
                            </div>
                            <div className="form-control">
                                <label htmlFor="date">Date</label>
                                <input type="date" id="date" ref={this.dateElRef}></input>
                            </div>
                            <div className="form-control">
                                <label htmlFor="description">Description</label>
                               <textarea id="description" rows="4" ref={this.descriptionElRef}></textarea>
                            </div>
                        </form>
                </Modal>}
                {/* events box just only available if we are authenticated. */}
                {this.context.token && 
                <div className="events-control">
                    <p>Share your own Events!</p>
                    <button className="btn" onClick={this.createEventHandler}>Create Event</button>
                </div>
                }
                <ul className="events_list">
                    {eventList}
                </ul>
            </React.Fragment>
            ) 
    }
}


export default EventsPage;