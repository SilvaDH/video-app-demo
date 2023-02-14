import React from 'react';
import { Modal, Header, Button, Icon, Card } from 'semantic-ui-react';



const VideoModal = ({ open, handleClose, modalTitle, modalVideo, description }) => {
    return (
        <Modal open={open} >
            <Header content={modalTitle} />
            <Modal.Content scrolling>
                <iframe
                    title={modalTitle}
                    width={920}
                    height={640}
                    src={modalVideo}
                    frameBorder="0"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
                <Card.Description>{description}</Card.Description>
            </Modal.Content>
            <Modal.Actions>
                <Button color='red' onClick={handleClose}>
                    <Icon name='close' /> Close
                </Button>
            </Modal.Actions>
        </Modal>
    )
}



export default VideoModal;
