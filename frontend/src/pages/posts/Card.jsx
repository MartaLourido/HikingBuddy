import React, { useEffect, useState } from "react";
import CommentCard from "../comments/CommentCard";
import CommentForm from "../comments/CommentForm";
import CommentsApi from "../../api/CommentsApi";
import PostsApi from "../../api/PostsApi";
import UpdateCard from "./UpdateCard";
import moment from "moment";
import Like from "../posts/Like";

import {
  Grid,
  Divider,
  Feed,
  Card,
  Comment,
  Container,
  Header,
  Segment,
  Button,
  Image,
} from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import { Link } from "react-router-dom";
//  Importing the buttons to be used for react share
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
} from "react-share";

export default function PostCard({ post, onDeleteClick, onUpdateClick, user }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [comments, setComments] = useState([]);

  const [postTitle, setPostTitle] = useState(post.postLocation);
  const [postKm, setPostKm] = useState(post.postDistance);
  const [postBody, setPostBody] = useState(post.body);

  async function createComment(commentData) {
    try {
      const response = await CommentsApi.createComment(post.id, commentData);
      const comment = response.data;
      const newComment = comments.concat(comment);

      setComments(newComment);
    } catch (e) {
      console.error(e);
    }
  }

  async function deleteComment(post) {
    try {
      await CommentsApi.deleteComment(post.id);
      const newComments = comments.filter((p) => p.id !== post.id);

      setComments(newComments);
    } catch (e) {
      console.error(e);
    }
  }

  async function updatePost(postToUpdate) {
    try {
      await PostsApi.updatePost(post.id, postToUpdate);
      PostsApi.getPostById(post.id)
        .then(({ data }) => {
          setPostTitle(data.postLocation);
          setPostKm(data.postDistance);
          setPostBody(data.body);
        })
        .catch((err) => console.error(err));
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    CommentsApi.getComments(post.id).then(({ data }) => setComments(data));
  }, [setComments]);

  // Components

  let filteredCommentList = comments.filter(
    (item) => item.commentedPost == post.id
  );

  console.log("ss", post);
  console.log("ssss", post.user);

  return (
    <Container>
      <Segment.Group>
        <Segment >
    
              <Link to={`/${post.user}/profile`}>
                <Image
                  floated="left"
                  size="mini"
                  as="a"
                  src={user.imageUrl || null}
                />
              </Link>

         
    
                  <Comment.Author as="a">
                    {" "}
                    <Link to={`/${post.user}/profile`}>{post.user}</Link>
                  </Comment.Author>

                  <Feed.Summary>
   
                  <Comment.Metadata>
                <div>
                  {moment(post.createAt).format("MMMM Do, YYYY HH:mm")}
                </div>
              </Comment.Metadata>
     
                   </Feed.Summary>

                  <Divider hidden />
                  <Grid columns={2} container divided='vertically' stackable>
                    <Grid.Column>
                      <b>Location:</b> {postTitle}
                    </Grid.Column>
                    <Grid.Column>
                      <b>Distance:</b> {postKm} km
                    </Grid.Column>
                    </Grid>
                    <Grid centered columns={1}>
                    <Feed.Extra center>
                    <Divider hidden />
                    <Image src={post.imageUrl} className="shadow" />{' '} 
                    <Divider hidden />
                    <Feed.Meta>
                    <Comment.Text>{postBody}</Comment.Text>
                    </Feed.Meta>
                    </Feed.Extra>
                  </Grid>
                 
                  <Header
                    as="h3"
                    dividing
                    content=""
                    textAlign="center"
                  ></Header>
                        <Divider hidden />
                  
                        <Container text>
   <Grid  margin= '4em'columns={4}>
                 
                    {post.user == user.name && (
                      <>
                        <Grid.Column
                          active
                          onClick={() => setIsUpdating(true)}
                        >

                          Edit Post 
                        </Grid.Column>{' '} 
                        
                        <Grid.Column onClick={onDeleteClick} active>
                          {" "}
                          Delete post 
                        </Grid.Column>{' '} 

                        <Grid.Column active>
                          {comments.length} comment(s) 
                        </Grid.Column>{' '} 
                        <Grid.Column>
                          <Like />
                        </Grid.Column>
                      </>
                    )}
  
                  </Grid>
                  </Container>
      
                <br></br>
                <br></br>
                {/* Buttons for share to social media and like button */}
                <Button.Group size="small" className="AvatarWrap">
                  <br></br>
                  <FacebookShareButton
                    url={window.location.href} //share the actual link of the post
                    title={post.user} //the user who wrote the post
                    description={postTitle} //the comment written in the post is shared
                    quote="link"
                  >
                    <FacebookIcon className="mx-3" size={35} />
                  </FacebookShareButton>
                  <TwitterShareButton
                    url={window.location.href}
                    title={postTitle} //the comment written in the post is shared
                    quote="link"
                    hashtag="hiking"
                  >
                    <TwitterIcon className="mx-3" size={35} />
                  </TwitterShareButton>
                  <WhatsappShareButton
                    url={window.location.href}
                    separator=""
                    title={postTitle} //the comment written in the post is shared
                    quote="link"
                  >
                    <WhatsappIcon size={35} />
                  </WhatsappShareButton>
                </Button.Group>
                {/* Buttons for share to social media finish here  */}
                <Header as="h3" dividing content="" textAlign="center"></Header>

                <div className="comments-container">
                  {comments &&
                    filteredCommentList.map((comment) => (
                      <CommentCard
                        key={post.id}
                        comment={comment}
                        onDeleteClick={() => deleteComment(comment)}
                        user={user}
                      />
                    ))}
                </div>

                {isUpdating && (
                  <UpdateCard
                    onUpdateClick={(postData) => {
                      updatePost(postData);
                      setIsUpdating(false);
                    }}
                    post={post}
                  />
                )}

                <div className="comments-form">
                  <CommentForm id={post.id} onSubmit={createComment} />
                </div>
             

            
        </Segment>
        
      </Segment.Group>
    </Container>
  );
}
