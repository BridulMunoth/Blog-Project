import React, {useEffect, useState} from 'react'
import {Container, PostForm} from '../components'
import StorageService from "../appwrite/config";
import { useNavigate,  useParams } from 'react-router-dom';

function EditPost() {
  const [post, setPost] = useState(null);
  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if(slug){
      StorageService.getPost(slug).then((post) => {
        if(post){
          setPost(post);
        } else {
          console.error("Post not found");
          navigate('/');
        }
      })
    } else{
      navigate('/')
    }
  }, [slug, navigate]);
  
  return post ? (
    <div className='py-8'>
        <Container>
            <PostForm post={post} />
        </Container>
    </div>
  ) : null
}

export default EditPost
