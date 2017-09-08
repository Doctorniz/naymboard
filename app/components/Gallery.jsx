import React from 'react';

import ImageComponent from './ImageComponent.jsx';


export default class Gallery extends React.Component {
    constructor() {
        super();
    }
    componentDidMount() {
        this.props.countPages(this.props.imagesToRender.length)
    }
    
    componentWillUpdate(nextProps, nextState) {
        nextProps.countPages(nextProps.imagesToRender.length)
    }
    
    render() {
        
        return (
            <div className="Gallery">
            <div className="ImagePostHeader">{this.props.title}</div>
            <div className="GalleryContainer">
            {this.props.imagesToRender.map((eachPost, index) => {
                    if((index < this.props.perPage * this.props.page) && (index >= this.props.perPage * (this.props.page-1))) { 
                        return ( 
                            <ImageComponent ImageData={eachPost}
                                        isLoggedIn={this.props.isLoggedIn}
                                        key={"image"+index}
                                        pathname={this.props.pathname} 
                                        /> 
                        ) }
                 })}
                 </div>
            
            
            </div>
            )
    }
}