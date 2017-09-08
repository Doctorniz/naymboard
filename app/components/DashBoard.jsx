import React from 'react';
import { Link, Route, Redirect } from 'react-router-dom';

class AppNav extends React.Component {
  constructor() {
    super();
    this.login = this.login.bind(this);
    this.signup = this.signup.bind(this);
    this.twitter = this.twitter.bind(this);
  }
  
  login(e) {
    e.preventDefault();
    if(document.getElementById("LogInUsername").value !== "" &&  document.getElementById("LogInPassword").value !== "") {
      let form = document.getElementById("LoginSignupForm");
      form.action = "/login"
      form.method = "POST"
      form.submit();

    } else {
      this.props.sendError("Please enter a username and password to login")
    }
  }
  
  signup(e) {
    e.preventDefault();
    if(document.getElementById("LogInUsername").value !== "" &&  document.getElementById("LogInPassword").value !== "") {
      let form = document.getElementById("LoginSignupForm");
      form.action = "/signup"
      form.method = "POST"
      form.submit();

    } else {
      this.props.sendError("Please enter a username and password to sign up")
    }
  }
  
  twitter (e) {
    e.preventDefault();
    window.alert("meow");
  }
  
  render() {
    return (
      <div id="AppDashBoard">
      
      {this.props.isLoggedIn.username ? (
        <div className="loggedInAppDash">
        <a href='/add' className="loggedInAppDashbtn AppDashAddImage"> Add Image </a>
        <Link to='/my' className="loggedInAppDashbtn AppDashYours"> My Images ({this.props.imagesLength}) </Link>
        <a href='/logout' className="loggedInAppDashbtn AppDashLogout"> Logout </a>
        </div>
      ) : <div className="notLoggedInAppDash">
            <form id="LoginSignupForm">
            <input type="text" name="username" id="LogInUsername" placeholder="username"/>
            <input type="password" name="password" id="LogInPassword" placeholder="password"/>
            <button className="LogInBtn AppDashButton" onClick={this.login}> Login </button>
            <button className="SignUpBtn AppDashButton" onClick={this.signup}> Sign Up </button>
            <a href="/tw" className="AppDashButton TwitterLogin" > <img className="SocialIcon" src='/client/img/twittericon.png' /> </a>
            </form>
            

      </div>}
      <div className="PaginationDiv">
      <div className="PaginationTitleinDiv"> -pagination- </div>
      <div className="NumericalperPage"> {"Displaying "} <b> {this.props.perPage} </b> {" per page"} </div>
     <input className="perPageRange" type="range" value={this.props.perPage} onChange={this.props.changePerPage} max="10" min="1" />
      
      <div className="PageNumbers">
     {this.props.page <= 1 ? "" : <button onClick={(e) => this.props.changePage(-1)} className="changePageButton"> - </button> } 
      
      <div className="PageNumber"> {"Page " + this.props.page} </div>
      {Math.ceil(this.props.pages / this.props.perPage) <= this.props.page ? "" : <button onClick={(e) => this.props.changePage(1)} className="changePageButton"> + </button>}
      
      </div>
     </div>
     
     {this.props.error ? (<div className="AppDashError">{this.props.error} </div>): "" }

      </div>
    );
  }
}

module.exports = AppNav;