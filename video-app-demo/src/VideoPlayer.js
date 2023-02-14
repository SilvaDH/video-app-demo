import React, { useState } from 'react';
import { useEffect } from 'react';
import { Grid, Message, Button, Card, Segment, Sticky, Header, Image, Dropdown } from 'semantic-ui-react';

import brand from './resources/logo.png'

import VideoModal from './VideoModal';
import VideoCard from './VideoCard';

const API_KEY = 'AIzaSyBhFTJZhTEx6BkbUViDoGXXGvhJk80bsmc';
const API_KEY_GOOGLE_SHEET = "AIzaSyBqS7_Xme5dnzwmvlcxKBfcQmSd9_QvQq4"
const SPREADSHEET_ID = '1WbVW54tMrwobxHddSNRCad15faVGeeqaKeSvu5kgS_A';



const VideoPlayer = () => {
    const [currentPlaylist, setCurrentPlaylist] = useState('');
    const [playlists, setPlaylists] = useState([]);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [language, setLanguage] = useState("sinhala");

    const handleChange = (event, data) => {
        setLanguage(data.value);
    };

    const languageOptions = [
        {
            key: 'si',
            text: 'Sinhala',
            value: 'sinhala',
        },
        {
            key: 'en',
            text: 'English',
            value: 'english',
        },
    ];


    useEffect(() => {
        setLoading(true);
        setError(null);
        const fetchPlaylists = async () => {
            try {
                const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/A:c?key=${API_KEY_GOOGLE_SHEET}`);
                const data = await response.json();
                const sinhalaPlaylists = []
                const englishPlaylists = []
                data.values.map((value) => {

                    if (value[0] === "Sinhala") {
                        return sinhalaPlaylists.push(value)
                    } else {
                        return englishPlaylists.push(value)
                    }
                })
                if (language === "sinhala") {
                    setPlaylists(sinhalaPlaylists || []);
                    setCurrentPlaylist(sinhalaPlaylists[0][2])

                } else {
                    setPlaylists(englishPlaylists || []);
                    setCurrentPlaylist(englishPlaylists[0][2])


                }
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPlaylists();
    }, [language]);

    useEffect(() => {
        if (playlists.length !== 0) {
            setLoading(true);
            setError(null);
            const fetchVideos = async () => {
                try {
                    // Use the YouTube API to fetch the list of videos in the selected playlist
                    const response = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${currentPlaylist}&key=${API_KEY}&maxResults=20`);
                    const data = await response.json();

                    // Store the videos in the component's state
                    setVideos(data.items || []);
                } catch (err) {
                    setError(err);
                } finally {
                    setLoading(false);
                }
            };
            fetchVideos();
        }

    }, [currentPlaylist, playlists.length]);

    const [open, setOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalVideo, setModalVideo] = useState('');
    const [modalDescription, setModalDescription] = useState('');

    const handleOpen = (title, url, description) => {
        setModalTitle(title);
        setModalVideo(url);
        setModalDescription(description);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setModalVideo('');
    };


    return (
        <Segment loading={loading} basic>
            <Grid >

                <Grid.Column width={2} >
                    <Sticky>
                        <Image src={brand} size="massive" />
                        <Header as='h2' icon textAlign='center'>
                            <Header.Content>Sri Lanka Trainings</Header.Content>
                        </Header>
                        <hr></hr>
                        <Segment textAlign='center' basic>
                            <Header as="h5" > Please select language</Header>

                            <Dropdown
                                placeholder="Select Language"
                                selection
                                options={languageOptions}
                                value={language}
                                onChange={handleChange}
                            />
                            <hr></hr>

                            <Button.Group vertical >
                                <Header as="h5"> Please select topic from here</Header>
                                {playlists.map(playlist => (
                                    <Button
                                        key={playlist}
                                        onClick={() =>
                                            setCurrentPlaylist(playlist[2])
                                        }
                                        style={{ height: '50px', width: '100%' }}
                                    >
                                        {playlist[1]}
                                    </Button>
                                ))}
                            </Button.Group>
                        </Segment>

                    </Sticky>
                    <Segment basic textAlign="center">
                        <p style={{ color: 'grey', marginTop: '5px' }}>©2023 - Hik-Partner Link.<br />Hikvision South Asia.</p>
                    </Segment>
                </Grid.Column>
                <Grid.Column width={14} >
                    {
                        error &&
                        <Message negative>
                            <Message.Header>Error loading data</Message.Header>
                            <p>{error}</p>
                        </Message>
                    }
                    <Card.Group >
                        {videos.map(video => (
                            <VideoCard
                                key={video.snippet.resourceId.videoId}
                                video={video}
                                onClick={() => handleOpen(video.snippet.title, `https://www.youtube.com/embed/${video.snippet.resourceId.videoId}`, video.snippet.description)}
                            />
                        ))}
                    </Card.Group>
                </Grid.Column>
            </Grid>

            <VideoModal
                open={open}
                handleClose={handleClose}
                modalTitle={modalTitle}
                modalVideo={modalVideo}
                description={modalDescription}
            />

        </Segment>

    );
}

export default VideoPlayer;