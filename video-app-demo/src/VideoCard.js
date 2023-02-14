import React from 'react';
import { Card, Image, Header } from 'semantic-ui-react';

const VideoCard = ({ video, onClick }) => {
  return (
    <Card onClick={onClick}>
      <Image src={video.snippet.thumbnails.high.url} />
      <Card.Content>
        <Header as='h3'>{video.snippet.title}</Header>
        {/* <Card.Description>{video.snippet.description}</Card.Description> */}
      </Card.Content>
    </Card>
  );
};

export default VideoCard;
