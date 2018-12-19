import React, { Component } from "react";
import axios from 'axios'
import "./App.css";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faInstagram,
  faAmazon,
  faSpotify
} from "@fortawesome/free-brands-svg-icons";

import photosArray from './Util/photosArray'

const verbs = [
  "loves",
  "thinks about",
  "desires",
  "needs",
  "wants",
  "is amazed by",
  "is amused by",
  "is proud of",
  'enjoys kissing',
  'is enamoured with',
  'is bowled over by',
  'likes being with',
  'is inspired by',
  'dreams about'
];

const loveAdjectives = [
  "an incredible",
  "a stupendous",
  "a phenomenal",
  "a mind-boggling",
  "a neverending",
  "an immeasurable",
  "a crazy",
  "a flabbergasting",
  "a silly",
  "a shocking",
  'a considerable',
  'an endless'
];

const GreetingsFrame = ({ selectedAdjective, selectedVerb, timeOfDay, temperature, feelsLike, chanceOfRain }) => {
  return (
    <div className="greetingsFrame">
      <h1>{`Good ${timeOfDay} Petia!`}</h1>
      <h2>
        It's {moment().format("h:mm a")}
        <br />
        {moment().format("dddd Do MMMM")}{" "}
      </h2>
      <h2>
        Temperature: {temperature}&deg;C ({feelsLike}&deg;C)
        <br />
        Chance of rain: {chanceOfRain < 6 ? '<5' : chanceOfRain}%
      </h2>
      <h2>
        {selectedVerb &&
          `Richard ${selectedVerb} you ${selectedAdjective} amount`}
      </h2>
      <div className="icons">
        <a href="https://gmail.com">
          <FontAwesomeIcon
            icon={faEnvelope}
            size={window.innerWidth > 640 ? "3x" : "2x"}
            color="white"
            style={{ paddingRight: "2rem" }}
          />
        </a>
        <a href="https://calendar.google.com">
          <FontAwesomeIcon
            icon={faCalendarAlt}
            size={window.innerWidth > 640 ? "3x" : "2x"}
            color="white"
            style={{ paddingRight: "2rem" }}
          />
        </a>
        <a href="https://facebook.com">
          <FontAwesomeIcon
            icon={faFacebook}
            size={window.innerWidth > 640 ? "3x" : "2x"}
            color="white"
            style={{ paddingRight: "2rem" }}
          />
        </a>
        <a href="https://open.spotify.com">
          <FontAwesomeIcon
            icon={faSpotify}
            size={window.innerWidth > 640 ? "3x" : "2x"}
            color="white"
            style={{ paddingRight: "2rem" }}
          />
        </a>
        <a href="https://instagram.com">
          <FontAwesomeIcon
            icon={faInstagram}
            size={window.innerWidth > 640 ? "3x" : "2x"}
            color="white"
            style={window.innerWidth > 640 ? {  paddingRight: "1.6rem" } : {paddingRight: "2rem"}}
          />
        </a>
        <a href="https://amazon.co.uk">
          <FontAwesomeIcon icon={faAmazon} size={window.innerWidth > 640 ? "3x" : "2x"} color="white" />
        </a>
      </div>
    </div>
  );
};

class App extends Component {

  state = {
    selectedPhoto: "",
    showGreeting: true
  };

  componentDidMount = async () => {
    const {data: {SiteRep: {DV: {Location: {Period}}}}} = await axios.get(`http://datapoint.metoffice.gov.uk/public/data/val/wxfcs/all/json/352409?res=3hourly&key=1fa41a68-8964-48cc-b5cf-d6a6e7089375`)
    this.setState({temperature: Period[0].Rep[0].T, chanceOfRain: Period[0].Rep[0].Pp, feelsLike: Period[0].Rep[0].F})

    const time = moment().format("HH");
    if (time >= 12 && time < 18) this.setState({ timeOfDay: "afternoon" });
    if (time >= 4 && time < 12) this.setState({ timeOfDay: "morning" });
    if (time >= 18 || time < 4) this.setState({ timeOfDay: "evening" });
    this.selectFirstRandomPhoto(photosArray);
    this.selectSecondRandomPhoto(photosArray)
    this.selectVerb();
    this.selectAdjective();
    setTimeout(() => setInterval(() => this.selectSecondRandomPhoto(photosArray), 12000), 6000)
    setInterval(() => {this.selectFirstRandomPhoto(photosArray)
      this.selectAdjective()
      this.selectVerb()
    }, 12000);
  };

  selectVerb = () => {
    const randomIndex = Math.floor(Math.random() * verbs.length);
    const selectedVerb = verbs[randomIndex];
    this.setState({ selectedVerb });
  };

  selectAdjective = () => {
    const randomIndex = Math.floor(Math.random() * loveAdjectives.length);
    const selectedAdjective = loveAdjectives[randomIndex];
    this.setState({ selectedAdjective });
  };

  selectFirstRandomPhoto = photosArray => {
    const randomIndex = Math.floor(Math.random() * photosArray.length);
    const firstSelectedPhoto = require(`./images/pets-photos/${
      photosArray[randomIndex]
    }`);
    this.setState({ firstSelectedPhoto });
  };

  selectSecondRandomPhoto = photosArray => {
    const randomIndex = Math.floor(Math.random() * photosArray.length);
    const secondSelectedPhoto = require(`./images/pets-photos/${
      photosArray[randomIndex]
    }`);
    this.setState({ secondSelectedPhoto });
  };

  render() {
    return (
      <React.Fragment>
        <div className="pictureFrame"
          style={{
            backgroundImage: `url(${this.state.firstSelectedPhoto})`
          }}
        />
          <div className="top"
          style={{
            backgroundImage: `url(${this.state.secondSelectedPhoto})`
          }}
        />
        <div
          onClick={() =>
            this.setState({ showGreeting: !this.state.showGreeting })
          }
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            height: "100vh",
            width: "100vw"
          }}
        >
          {this.state.showGreeting && this.state.timeOfDay && (
            <GreetingsFrame
              selectedAdjective={this.state.selectedAdjective}
              selectedVerb={this.state.selectedVerb}
              timeOfDay={this.state.timeOfDay}
              temperature={this.state.temperature}
              feelsLike={this.state.feelsLike}
              chanceOfRain={this.state.chanceOfRain}
            />
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default App;
