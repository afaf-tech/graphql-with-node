import React from 'react';

import './EventItem.css';

const eventItem = props => {
    return (
        <li key={props.eventId} className="events_list_items">
            <div>
                <h1>{props.title}</h1>
                <h2>${props.price} - {new Date(props.date).toLocaleDateString()}</h2>
            </div>
            <div>
                {props.userId === props.creatorId ?
                (<p>You're the Owner of this event.</p>):
                (<button className="btn" onClick={props.onDetail.bind(this,props.eventId)}>View Detail</button>)
                }
                
            </div>
        </li>
    )
}


export default eventItem;