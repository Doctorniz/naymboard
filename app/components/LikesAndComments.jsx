import React from 'react';
import { Link } from 'react-router-dom';
var moment = require('moment');
export default class LikesAndComments extends React.Component {
    constructor() {
        super();
        this.checkLogin = this.checkLogin.bind(this);
        this.checkLiked = this.checkLiked.bind(this);
        this.toggleComments = this.toggleComments.bind(this)
        this.state = {
            currentLiked: false,
            showComments: false
        }
        
    }
    
    componentDidMount() {
        this.checkLiked();
        this.setState({showComments: this.props.showComments})
    }
    
    toggleComments() {
        this.setState({
            showComments: !this.state.showComments
        })
    }
    
    checkLogin(e) {
        e.persist(); 
        if(!this.props.isLoggedIn.username) {
            e.preventDefault();
            return false
        } else {
            return true
        }
    }
    
    checkLiked() {
        if(this.props.ImageData.LikedBy.includes(this.props.isLoggedIn.username)) {
            this.setState({currentLiked: true});
        }
    }
    
    sendLike(e, slug) {
        e.persist(); 
        if(!this.props.isLoggedIn.username) {
            e.preventDefault();
        } else {
            let form = document.getElementById("Like"+slug);
            form.submit();
        }
        
    }
    
    deleteComment(e, id) {
        e.persist();
        if(!this.props.isLoggedIn.username) {
            e.preventDefault();
        } else {
            let form = document.getElementById("Comment"+id);
            form.submit();
        }
    }
    
    render() {
        return (
            <div className="LikesCommentsContainer">
            <div className="LikeCommentShareBar">
            
              <form id={'Like'+this.props.ImageData.slug} onSubmit={this.checkLogin} action='/LikePost' method='POST'>
                <input type="hidden" name="currentRoute" value={this.props.pathname} />
                <input type="hidden" name="slugForLike" value={this.props.ImageData.slug} />
                <input type="hidden" name="username" value={this.props.isLoggedIn.username} />

              </form>
              
              <div className="toCenter"> </div>
              <div onClick={(e)=> this.sendLike(e, this.props.ImageData.slug)}  className={this.state.currentLiked ? "FavIcon LikedHeart" : "FavIcon UnlikedHeart"}>
                ❤
                <div className="numberOfLikes">{" " + this.props.ImageData.LikedBy.length}</div>
                </div>
              
              <div onClick={this.toggleComments} className="FavIcon">
              💬
              <div className="numberOfLikes">{" " + this.props.ImageData.Comments.length}</div>
                </div>
                
                
              {this.props.isLoggedIn.username ? (
              <form id={'SubmitComment'+this.props.ImageData.slug} onSubmit={this.checkLogin} action='/CommentPost' method='POST' className="CommentBoxForm" >
                <input type="text" name="CommentContent" className="CommentBoxInput" autocomplete="off" />
                <input type="hidden" name="currentRoute" value={this.props.pathname} />
                <input type="hidden" name="slugForLike" value={this.props.ImageData.slug} />
                <input type="hidden" name="OC" value={this.props.ImageData.Contributor} />
                <input type="hidden" name="username" value={this.props.isLoggedIn.username} />
                <button type="submit" className="FavIcon">
                    	↵
                </button>
                
              </form> ) : "" }
              
              <div className="toCenter"> </div>

            </div>
           
            {this.state.showComments ? (
            <div className="CommentsContainer">
            
            <div className="ImageDescription"> 
            
             {this.props.ImageData.ImageDesc}
                   
                   </div>
            
           {this.props.ImageData.Comments.map((eachComment, index) => {
                  return (
                  <div className="EachComment" key={"comment"+index}>
                  
                  <div className="EachCommentContent">
                  {eachComment.CommentContent}
                  </div>
                  
                  <div className="EachCommentLineTwo">
                  
                  
                  <div className="EachCommentTime">
                  {moment(eachComment.CommentCreated).fromNow()}
                  </div>
                  
                  <Link to={"/user/" + eachComment.CommentAuthor} className="ImageComponentContributor">
                  {eachComment.CommentAuthor}
                  </Link> 
                  
                  
                  
                  
                  

                  {eachComment.CommentAuthor === this.props.isLoggedIn.username || this.props.ImageData.Contributor === this.props.isLoggedIn.username ? (
                  
                    <button className="DeleteCommentButton" onClick={(e) => this.deleteComment(e,eachComment._id)}> 
                    ✖ </button>
                  ) : "" }
                  
                  </div>
                  
                  <form action="/DeleteComment" method="POST" className="DeleteCommentForm" id={"Comment"+eachComment._id}>
                    <input type="hidden" name="currentRoute" value={this.props.pathname} />
                    <input type="hidden" name="slugForLike" value={this.props.ImageData.slug} />
                    <input type="hidden" name="username" value={this.props.isLoggedIn.username} />
                    <input type="hidden" name="CommentID" value={eachComment._id} />
                  </form> 
                  
                  
                  </div>
                  )})} </div>)
               : ""}
            
            
            </div>
            
            )
    }
}