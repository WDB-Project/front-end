import React from "react";

import "../css/EventCard.css";

function daysLeft(event, condition) {
  const now = Date.now();
  const days = (time) => {
    return Math.floor(time / 86400000);
  };
  switch (condition) {
    case "start":
      return `In ${days(event.startDate - now)} days`;
    case "end":
      return `${days(now - event.endDate)} days ago`;
    case "ongoing":
      return `${days(now - event.startDate)} days left`;
    default:
      return null;
  }
}

const EventCard = (props) => {
  console.log(props.event);
  return (
    <div>
      <a href={`/event/${props.event._id}`} className="link">
        <div className="padding-between-cards">
          <div className="image-spacing">
            <img src={props.event.image} alt="event banner" />
          </div>
          <div className="card-body">
            <h5 className="title-card primary-mont">{props.event.name}</h5>
            <div className="date-event secondary-sans"></div>
            <div className="date-event secondary-sans">
              <div className="date secondary-sans">
                Start: {new Date(props.event.startDate).toString().slice(4, 15)}
              </div>
              <div className="date secondary-sans">
                End: {new Date(props.event.endDate).toString().slice(4, 15)}
              </div>
            </div>
            <div className="date-event secondary-sans">
              <div>Location: {props.event.location}</div>
            </div>
            <div className="upcoming-past secondary-sans">
              {daysLeft(props.event, props.condition)}
            </div>
            <ul className="tags secondary-sans">
              <li className="tag">{props.event.tag}</li>
            </ul>
          </div>
        </div>
      </a>
    </div>
  );
};

export default EventCard;
