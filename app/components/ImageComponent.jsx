import React from 'react';
import { Link } from 'react-router-dom';

import LikesAndComments from './LikesAndComments.jsx'

export default class ImageComponent extends React.Component {
    constructor() {
        super();    
        this.deletePost = this.deletePost.bind(this);
        
    }
    
    
    deletePost(e) {
        
        
        document.getElementById('delete'+e.target.value).submit()
    }
    
    render() {
        return this.props.ImageData ? (
            
            <div className="ImageComponentContainer">
            
            <Link to={'/'+this.props.ImageData.slug} className="ImageComponentHeader">
            {this.props.ImageData.ImageTitle}
            </Link>
            <Link to={'/'+this.props.ImageData.slug} className="ImageComponentImageLink">
                    
                    {this.props.ImageData.ImageLink ? (
                    <div className="ImageComponentImage" style={{"background": "no-repeat center url("+this.props.ImageData.ImageLink+")", "backgroundSize": "cover", "minWidth": "200px", "minHeight": "200px", "maxHeight":"300px", "maxWidth":"300px"}}  > </div>
                    ): ""}    
                        
                     </Link>
            <div className="ImageInfoBar"> 
            
            
            <Link to={'/'+this.props.ImageData.slug} className="ImageComponentSlug">
             <div>{"/"+this.props.ImageData.slug}</div>
            </Link>
            <div to={'/'} className="ImageComponentTags">     
             {this.props.ImageData.ImageTags}
            </div>
            <Link to={'/user/'+this.props.ImageData.Contributor} className="ImageComponentContributor">
            {""+this.props.ImageData.Contributor}
            </Link>
                </div>
  
            {!this.props.newPost && this.props.ImageData.Contributor === this.props.isLoggedIn.username ? (
            <div className="editMode">
                { this.props.editMode ? '' : ( 
                     <Link to={'/edit/'+this.props.ImageData.slug}> Edit </Link>
                     )}
                     
                     
                     <div className="deletePost" value={this.props.ImageData.slug} onClick={this.deletePost}> Delete </div>
                     
            <form 
            id={"delete"+this.props.ImageData.slug}
            action={'/delete/'+this.props.ImageData.slug} method="post" className="deletePostForm">
                     
                     
                     
                     </form>
                      </div>
                     ) : ''
                     }
                     {this.props.newPost || this.props.editMode ? "" : (
                     <LikesAndComments isLoggedIn={this.props.isLoggedIn}
                                        ImageData={this.props.ImageData}
                                        pathname={this.props.pathname}
                                        showComments={this.props.showComments}
                     /> )}
                    
                     </div>
            ) : (
                <div>
                Nothing to show here
                
                </div>
                
                )
    }

}