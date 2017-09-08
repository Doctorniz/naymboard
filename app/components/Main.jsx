import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import DashBoard from './DashBoard.jsx';


import AddPost from './AddPost.jsx';
import Gallery from './Gallery.jsx';
import ImageComponent from './ImageComponent.jsx';


export default class Main extends React.Component {
    constructor() {
        super();
        this.sendError = this.sendError.bind(this);
        this.changePerPage = this.changePerPage.bind(this);
        this.changePage = this.changePage.bind(this);
        this.countPages = this.countPages.bind(this);
        this.state = {
            error: "",
            perPage: 10,
            page: 1,
            pages: 1
        }
        
    }
    
    componentWillMount() {
        if (this.props.error) this.setState({error:this.props.error})
        var perPage = localStorage.getItem('_perPage')
        if(perPage) this.setState({perPage});
        var page = localStorage.getItem('_pageNo')
        if(page) this.setState({page});
        var pages = Number(localStorage.getItem('_pages'))
        if(pages) this.setState({pages});
    }
    sendError(error) {
        this.setState({error});
    }
    
    changePage(number) {
        var newPage = Number(this.state.page) + number;
        this.setState({page:newPage})
        
        localStorage.setItem('_pageNo',newPage);
    }
    
    changePerPage(e) {
        e.persist();
        this.setState({perPage : e.target.value,
                    page: 1
        })
        localStorage.setItem('_perPage', e.target.value)
        localStorage.setItem('_pageNo',1 );
    }
    
    countPages(pages) {
        if(pages!=this.state.pages) {
        this.setState({pages})
        this.setState({page: 1})
        localStorage.setItem('_pages', pages);
        localStorage.setItem('_pageNo',1);
        }
    }
    
    checkLoggedIn() {
        return this.props.isLoggedIn.username;
    }
    
    render() {
        return (
        <main id="MainContainer">
        
        <DashBoard error={this.state.error}
                sendError={this.sendError}
                perPage={this.state.perPage}
                changePerPage={this.changePerPage}
                isLoggedIn={this.props.isLoggedIn}
                imagesLength={this.props.dataToRender.data.filter(eachPost => eachPost.Contributor === this.props.isLoggedIn.username).length}
                changePage={this.changePage}
                page={this.state.page}
                pages={this.state.pages}
                />
        
        <Switch>
            <Route exact path="/" render={(props) => ( 
                    <Gallery imagesToRender={this.props.dataToRender.data}
                             perPage={this.state.perPage}
                             title={"Front Page"}
                             isLoggedIn={this.props.isLoggedIn}
                             pathname={props.match.url}
                             page={this.state.page}
                             countPages={this.countPages}
                             /> )} />
      
            <Route path="/user/:user" render={ 
                ({match}) => (<Gallery imagesToRender={this.props.dataToRender.data.filter(eachPost => eachPost.Contributor === match.params.user)}
                                        perPage={this.state.perPage}
                                        page={this.state.page}
                                        title={match.params.user+"'s Gallery"}
                                        isLoggedIn={this.props.isLoggedIn}
                                        pathname={match.url}
                                        countPages={this.countPages}
                                        /> 
                
            )} />
            
            <Route path="/my" render={ 
                ({match}) => {
                
                return this.props.isLoggedIn.username ? (<Gallery imagesToRender={this.props.dataToRender.data.filter(eachPost => eachPost.Contributor === this.props.isLoggedIn.username)}
                                        perPage={this.state.perPage}
                                        title={"Your Gallery"}
                                        isLoggedIn={this.props.isLoggedIn}
                                        pathname={match.url}
                                        page={this.state.page}
                                        countPages={this.countPages}
                 /> 
                
            ) : (<Redirect  to="/" />)}} />
            
            <Route path='/add' render={(props) => {
                     return this.props.isLoggedIn.username ? (<AddPost 
                                                        sendError={this.sendError}
                                                        editPost={false} 
                                                        isLoggedIn={this.props.isLoggedIn} 
                                                        pathname={props.match.url}
                                                            
                                                         />) : (<Redirect to='/' />)  }} />
            
            <Route path='/edit/:slug' render= {({match}) => {
                let ImageData = this.props.dataToRender.data.find(eachPost => eachPost.slug === match.params.slug);
                if(!ImageData) {
                   return <Redirect to="/" />
                } else if(this.props.isLoggedIn.username !== ImageData.Contributor) {
                    return <Redirect to="/" />
                } else if(this.props.isLoggedIn.username === ImageData.Contributor) {
                    return (<AddPost sendError={this.sendError} 
                        editPost={true} 
                        isLoggedIn={this.props.isLoggedIn}
                        ImageData={ImageData}
                        pathname={match.url}
                        /> )
                } 
                
                
            }} />
            
            
            <Route path="/:slug" render={ 
                ({match}) => {
                let ImageData = this.props.dataToRender.data.find(eachPost => eachPost.slug === match.params.slug)
                return ImageData ? (<ImageComponent ImageData={ImageData}
                                            showComments={true}
                                            isLoggedIn={this.props.isLoggedIn}
                                            pathname={match.url}
                 />) : (<Redirect to="/" />)
                
            }} />
                    
            
            
        </Switch>
        </main>)
    }
}

