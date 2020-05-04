import React, {Component} from 'react';

import Modal from '../components/modal/Modal';
import Spinner from '../components/Spinner/Spinner';
import Backdrop from '../components/Backdrop/Backdrop';
import EventList from '../components/Events/EventList/EventList';
import './Events.css';

import AuthContext from '../context/auth-context';

class EventsPage extends Component{
    state={
        creating:false,
        events:[],
        isLoading:false,
        selectedEvent:null
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
                       date
                       price
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
            // code below means that we no longer update events data every updating events
            // the program is a little bit faster therefore.
            this.setState(prevState=>{
                const updatedEvents = [...prevState.events];
                updatedEvents.push({
                    _id: responData.data.createEvent._id,
                    title: responData.data.createEvent.title,
                    description:responData.data.createEvent.description,
                    date:responData.data.createEvent.date,
                    price:responData.data.createEvent.price,
                    creator :{
                        _id:this.context.userId
                    }
                })
                return {events: updatedEvents};
            })
        })
        .catch(err=> {
            console.log(err);
            
        })
        
        
    };
    
    modalCancelHandler = ()=>{
        this.setState({creating:false, selectedEvent:null})
    };

    createEventHandler = ()=>{
        this.setState({creating:true});
    }

    fetchEvents = ()=>{
        this.setState({isLoading:true});
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
            this.setState({events: events, isLoading:false});
        })
        .catch(err=> {
            console.log(err);
            this.setState({isLoading:false});
            
        })
    }

    showDetailHandler = eventId =>{
        this.setState(prevState=>{
            const selectedEvent = prevState.events.find( e => e._id === eventId);
            return {selectedEvent: selectedEvent};
        })
    }

    bookEventHandler = () =>{

    }
    render(){
    
        return(
            <React.Fragment>
                {(this.state.creating || this.state.selectedEvent ) && <Backdrop/>}
                {this.state.creating &&
                    <Modal 
                        title="Add Event" 
                        canCancel 
                        canConfirm 
                        onConfirm={this.modalConfirmHandler} 
                        onCancel={this.modalCancelHandler}
                        confirmText="Confirm"
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
                </Modal>
                }
                {this.state.selectedEvent &&
                    <Modal 
                        title={this.state.selectedEvent.title}
                        canCancel
                        canConfirm 
                        onConfirm={this.bookEventHandler} 
                        onCancel={this.modalCancelHandler}
                        confirmText="Book"
                    >
                        <h1>{this.state.selectedEvent.title}</h1>
                        <h2>{this.state.selectedEvent.price} - {new Date(this.state.selectedEvent.date).toLocaleDateString()}</h2>
                        <p>{this.state.selectedEvent.description}</p>
                </Modal> }
                {/* events box just only available if we are authenticated. */}
                {this.context.token && 
                <div className="events-control">
                    <p>Share your own Events!</p>
                    <button className="btn" onClick={this.createEventHandler}>Create Event</button>
                </div>
                }
                {this.state.isLoading ? (<Spinner/>):(
                    <EventList events={this.state.events} authUserId={this.context.userId} onViewDetail={this.showDetailHandler} />
                )}
            </React.Fragment>
            ) 
    }
}


export default EventsPage;