/*eslint no-unused-vars: 0*/

import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useParams } from 'react-router';
import io from "socket.io-client";
import Peer from "peerjs"
import './chat.css';
import {
  Grid,
  Card,
  Box,
  makeStyles,
} from '@material-ui/core';

const socket = io("http://localhost:5000");

const useStyles = makeStyles(theme => ({
  root: {},
  queryField: {
    width: 500
  },
  bulkOperations: {
    position: 'relative'
  },
  bulkActions: {
    paddingLeft: 4,
    paddingRight: 4,
    marginTop: 6,
    position: 'absolute',
    width: '100%',
    zIndex: 2,
    backgroundColor: theme.palette.background.default
  },
  bulkAction: {
    marginLeft: theme.spacing(2)
  },
  avatar: {
    height: 42,
    width: 42,
    marginRight: theme.spacing(1)
  },
  sync: {
    padding: '5px',
    fontSize: '30px',
    cursor: 'pointer',
    right: 30,
    marginTop: 10
  },
  containerSync: {
    float: 'right',
    paddingRight: 10
  }
}));

let peer;
let videoGrid;

peer = new Peer(undefined, {
  port: '3001',
  host: '/'
});

const Results = ({ className, stores, ...rest }) => {

  const classes = useStyles();
  const { roomId } = useParams();
  const peers = {};

  const addVideoStream = (video, stream) =>{
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', ()=> {
      video.play()
    })
    videoGrid.append(video)
  }

  const connectToNewUser =(userId, stream) =>{
    const call = peer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream=>{
      addVideoStream(video, userVideoStream)
    })
    call.on('close',()=>{
      video.remove()
    })

    peers[userId] = call;
  }

  useEffect(()=>{

      
      videoGrid = document.getElementById('video-grid');

      const myVideo = document.createElement('video');
      myVideo.muted = true;

      navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      }).then(stream=>{
        addVideoStream(myVideo, stream)

        peer.on('call', call=>{
          call.answer(stream)
          const video = document.createElement('video')
          call.on('stream', userVideoStream =>{
            addVideoStream(video, userVideoStream)
          })
        })

        socket.on('user-connected', userId => {
          connectToNewUser(userId, stream)
        });

        socket.on('user-disconnected', userId => {
          if(peers[userId]) peers[userId].close()
        });
      })
  
      peer.on('open', id =>{
        socket.emit('join-room', roomId, id)
      })
    //eslint-disable-next-line
  },[])

  return (
 
    <Card className={clsx(classes.root, className)} {...rest}>
        <Box>
          <div id='video-grid'></div>
        </Box>
    </Card>
  );
};

Results.propTypes = {
  className: PropTypes.string,
};

export default Results;
