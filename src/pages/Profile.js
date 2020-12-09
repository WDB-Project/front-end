  import React from "react";
  import Header from "../components/NavBar";
  import ErrorPage from "../components/ErrorPage";
  import ProfileCard from "../components/ProfileCard";
  import EventCard from "../components/EventCard";
  import {Modal, Form, Button, Col } from "react-bootstrap";
  import { withRouter } from 'react-router-dom';

  import axios from "axios";
  const url = `http://upandcoming-env.eba-icsyb2cg.us-east-1.elasticbeanstalk.com/profile/`;


  function myEvents(data, condition) {
    return data && data.length > 0 ? (
      Repeater(data, condition)
    ) : (
      <p className="secondary-sans" id="nothing-to-see">Nothing to see here...</p>
    );
  }

  function myProfileArea(data) {
    return data ? (
      ProfileFormatter(data)
    ) : (
      <p className="secondary-sans" id="nothing-to-see">Nothing to see here...</p>
    );
  }
  const ProfileFormatter = (data) => {
    console.log(data)
    return (
      <ProfileCard user={data.user} events={data.events} myEvents={data.myEvents} />

    );
  };

  const Repeater = (items, condition) => {
    console.log(items);
    if (!items || items.length === 0) {
      return <p className="secondary-sans" id="nothing-to-see">Nothing to see here...</p>;
    }
    return (
      <div>
        <ul>
          <div>
            {items.map((event) => {
              return (
                <div class="individual-event">
                  <EventCard event={event} condition={condition} />
                </div>
              );
            })}
          </div>
        </ul>
      </div>
    );
  };

  class Profile extends React.Component {
    _isMounted = false;

    constructor(props) {
      super(props);
      this.state = { isLoaded: false, data: undefined };
      this.getProfileInfo = this.getProfileInfo.bind(this);
      this.handleClose = this.handleClose.bind(this);
      this.handleShow = this.handleShow.bind(this);
      this.buttonRef = React.createRef();
      this.pfpRef = React.createRef();

      this.state.user = JSON.parse(localStorage.getItem("user"));
      console.log(this.state.user);
    }

    componentDidMount() {
      if (this.state.user) {
        this.getProfileInfo();
      } else {
        this.setState({ isLoaded: false });
      }

      this._isMounted = true;
      try {
      } catch (err) {
        console.log(err);
        this.setState({ isLoaded: false });
      }
    }

    handleClose = () => {
      this.setState({modalRequested: false})
    }
    handleCloseSuccess = () => {
      let newUrl = this.pfpRef.current.value;
      let config = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      };
      axios.post(url + "updateProfilePic", {
        pfp: newUrl
      }, config).then((result) => {
            if (result.data.message === "success") {
                let user1 = this.state.user
                user1.profilepic = newUrl;
                localStorage.setItem('user', JSON.stringify(user1))
            } else {
                console.log("Did not register");
            }
           this.setState({modalRequested: false})
          },(err) => {
                console.log("Did not register");
                console.log(err)
                this.setState({modalRequested: false})
            }
        )
    }
    handleShow = (e) => {
      e.preventDefault();
      this.setState({modalRequested: true})
    }
    async getProfileInfo() {
      console.log('get profile info')
      let config = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      };
      axios.get(url +'basic', config).then((res) => {
        let result = res.data
        this.setState({user: result.userProfile, events: result.userEvents, myEvents: result.myEvents, isLoaded: true})

      }).catch((err) => {
        console.log(err);
        this.setState({isLoaded: true, error: err})
      });

    }

    render() {
      require("../css/Profile.css");
      if (!this.state.user || !this.state.isLoaded) {
        console.log("Loading");
        if (this.state.error) {
          return <ErrorPage />;
        } else {
          return <div>Loading...</div>;
        }
      } else {
        let pfp = "https://i.stack.imgur.com/34AD2.jpg"
        if (this.state.user.profilepic && this.state.user.profilepic !== "") {
          pfp = this.state.user.profilepic
        }
        return (
          <div className="wrapper">
            <div className="nav-bar">
              <Header pfp={pfp} />
            </div>

            <div className="eventpage-content">
            <Modal show={this.state.modalRequested} onHide={this.handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Change Profile Picture</Modal.Title>
              </Modal.Header>
              <Modal.Body  style={{paddingLeft: 25,}} >Fill in the field below.</Modal.Body>
              <Form.Group  style={{paddingLeft: 25,}}  className = "field" controlId="formBasicPfp">
                <Form.Control ref={this.pfpRef} type="name" placeholder="Profile Picture link" />
              </Form.Group>
              <Modal.Footer>
                <Button variant="secondary" onClick={this.handleClose}>
                  Close
                </Button>
                <Button variant="primary" onClick={this.handleCloseSuccess}>
                  Save Changes
                </Button>
              </Modal.Footer>
            </Modal>
              <div className="profile-personal">
                <div className="name-wrap">
                  <img
                    className="profile-pic"
                    src={pfp}
                    alt=""
                  />
                  <div className="centered-text">
                  <a href="" onClick={(e) => this.handleShow(e)}>Change photo</a>
                  </div>
                  <div className="profile-box">

                  <div className="banner">
                      <p className="banner-text primary-mont">About Me</p>
                      <div>{myProfileArea({user: this.state.user, events: this.state.events, myEvents: this.state.myEvents})}</div>
                    </div>
                </div>
                </div>
              </div>
              <div className="description-wrapper">
                <div className="flex-on-myevent">
                  <div className="event-type">
                    <div className="banner">
                      <p className="banner-text primary-mont">My Upcoming Events</p>
                      <div>{myEvents(this.state.events.upcoming, 'start')}</div>
                    </div>
                  </div>
                  <div className="event-type">
                    <div className="banner">
                      <p className="banner-text primary-mont">My Past Events</p>
                    </div>
                    {myEvents(this.state.events.past, 'ongoing')}
                  </div>
                  <div className="event-type">
                    <div className="banner">
                      <p className="banner-text primary-mont">Events Created By Me</p>
                    </div>
                    {Repeater(this.state.myEvents, 'end')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }
    }
  }

  export default withRouter(Profile);
