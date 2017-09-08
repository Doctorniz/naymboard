import React from 'react';
import ImageComponent from './ImageComponent.jsx';

export default class AddPost extends React.Component {
    constructor() {
        super();
        this.uploadImageAndUpdate = this.uploadImageAndUpdate.bind(this);
        this.checkPost = this.checkPost.bind(this);
        this.notValidURLImage = this.notValidURLImage.bind(this);
        this.updateImageState = this.updateImageState.bind(this);
        this.updateState = this.updateState.bind(this);
        this.updateTags = this.updateTags.bind(this);
        this.state = {
            image: '',
            title: '',
            description: '',
            tags: [],
            file: '',
            submitButton: "Create",
            Contributor:'',
            editMode: false,
            slug: "preview"
        }
        
    }
    
    componentDidMount() {
        if(this.props.editPost && this.props.isLoggedIn.username === this.props.ImageData.Contributor) {
            this.setState({title: this.props.ImageData.ImageTitle,
                            image: this.props.ImageData.ImageLink,
                            description: this.props.ImageData.ImageDesc,
                            tags: this.props.ImageData.ImageTags,
                            submitButton: "Edit",
                            editMode: true,
                            slug: this.props.ImageData.slug
                
            })
        }
        if(this.props.isLoggedIn.username) {
            this.setState(({Contributor:this.props.isLoggedIn.username}))
        }
    }
    
    uploadImageAndUpdate(e) {
        e.persist()
        var reader = new FileReader();
        let file = e.target.files[0];
        

        reader.onloadend = () => {

            if (!reader.result.startsWith('data:image/png') && !reader.result.startsWith('data:image/jpeg') && !reader.result.startsWith('data:image/gif')) {
                this.props.sendError("Sorry, only image filtypes are supported for now")
                e.target.value = '';
            } else if(file.size>2097152) {
                this.props.sendError("Sorry, images have to be less than 2MB for now")
                e.target.value = '';
            }
            else {
                this.props.sendError('');
                console.log(file);
                this.setState({
                    file: file,
                    image: reader.result
                });
            }
        }

        reader.readAsDataURL(file)
        
    }
    
    checkPost(e) {
        //e.preventDefault();
        e.persist();
        if(e.target.Title.value === '' || this.state.image === '') {
            e.preventDefault();
            this.props.sendError("Please make sure you have entered a valid title AND image")
            return false
        } else {
            return true;
        }
    }
    
    notValidURLImage(e) {
        if(document.querySelector('#imageSourceField').value === '') return
        this.setState({image: ''});
        document.querySelector('.PreviewImage').src = 'http://www.intowindows.com/wp-content/uploads/2013/11/The-Selected-File-is-not-a-valid-ISO-file-Step4_thumb.jpg'
    }
    
    updateState(field, e) {
        e.persist();
        this.setState({ [field]: e.target.value})
        
    }
    
   updateTags(e) {
       let options = e.target.options || [],
            tags = [];
        for(var i = 0, l = options.length; i < l; i++) {
            if(options[i].selected) {
                tags.push(options[i].value)
            }
        }
        
       this.setState({tags});
   }
    
    updateImageState(e) {
        var val = e.target.value;
        var img = new Image();
        img.onload = () => {
            this.props.sendError("");
            this.setState({ image: val})
        }
        img.onerror = () => {
            this.props.sendError("Oops! You may not have entered a valid URL");
            this.setState({ image: '/client/img/NoImageFound.png'})
        }
        img.src = e.target.value;
       
    }
    
    
    
    render() {
        return (
            <div className="AddPostContainer">
           
           <div className="ImagePostHeader">
            {this.state.editMode ? "Edit Image" : "Add Image" } 
            </div>
            
            <ImageComponent 
                        isLoggedIn={this.props.isLoggedIn}
                        newPost={!this.state.editMode}
                        editMode={this.state.editMode}
                        ImageData={{ImageLink: this.state.image,
                                    slug: this.state.slug,
                                    ImageTitle : this.state.title,
                                    ImageTags : this.state.tags,
                                    ImageDesc : this.state.description,
                                    Contributor: this.props.isLoggedIn.username
        }} /> 
            
        <form onSubmit={this.checkPost}
            autoComplete="off"
            className="AddEditPostForm"
            action={this.state.editMode ? '/editPost' : '/addPost'} 
            method='POST' encType="multipart/form-data">
        <input type="text" className="AddEditInput AddEditTitle" name='Title' id="Title" placeholder="1. Enter a title for your post" onChange={this.updateState.bind(this, "title")} value={this.state.title} />
        
        <div className="AddEditChoiceText">
            2. Choose one of the following ways of to add your image...
        </div>
        
        <div className="SomehowAddImage">
        <input type="file" name="ImageUpload" id="ImageUpload" className="AddEditFileUpload" onChange={this.uploadImageAndUpdate} />
        <label htmlFor="ImageUpload" className="AddEditFileUploadLabel"> 
            {this.state.file ? this.state.file.name + " uploaded successfully (" + this.state.file.size + " bytes)" : "a. Either upload a file from your device or ..." }
        </label>
        <input type="text" className="AddEditInput AddEditImageLink" name="ImageSource" id="imageSourceField" onChange={this.updateImageState} placeholder="b. ...paste an image link here" />
        </div>
        <textarea name="ImageDesc" id="ImageDesc" onChange={this.updateState.bind(this, "description")} value={this.state.description} placeholder="3. Enter a description for your image here"></textarea>
        <datalist id="ImageTags">
        <option value="Photography">Photography</option>
            <option value="Artwork">Artwork</option>
        </datalist>
        
        <input type="hidden" name="Contributor" value={this.state.Contributor} />
        <input type="hidden" name="FinalImage" value={this.state.image} />
        
        {this.state.editMode ? (
        <input type="hidden" value={this.props.ImageData.slug} name="slugForEdit" />
    
        ) : ''
            
            
        }
        <button type='submit' className="AddEditFormButton">{this.state.submitButton}</button>
            </form>
            
            
            </div>
            )
    }
}