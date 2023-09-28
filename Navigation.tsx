import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import TrackPlayer, { Capability, Event, State, usePlaybackState, useProgress, useTrackPlayerEvents } from 'react-native-track-player'
import { songs } from './src/musicData'
import { Slider } from '@rneui/themed';
const Navigation = () => {
    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };
    const [activeAudio, setActiveAudio] = useState(require('./assets/img/banner1.jpg'))
    const [activeName, setActiveName] = useState("Song 1")
    const progress = useProgress();
    const playbackState = usePlaybackState();
    const [currentSong, setCurrentSong] = useState<any>(0);
    const [remainingTime, setRemainingTime] = useState(0);
    const currentTime = progress.position !== null ? progress.position : 0;
    const totalDuration = progress.duration !== null ? progress.duration : 0;
    const formattedTotalDuration = formatTime(totalDuration);
    const formattedCurrentTime = formatTime(currentTime);
    const ref = useRef();
    useEffect(() => {
        setupPlayer()
    }, [])

    const setupPlayer = async () => {
        try {
            await TrackPlayer.setupPlayer();
            await TrackPlayer.updateOptions({
                // Media controls capabilities
                capabilities: [
                    Capability.Play,
                    Capability.Pause,
                    Capability.SkipToNext,
                    Capability.SkipToPrevious,
                    Capability.Stop,
                ],

                // Capabilities that will show up when the notification is in the compact form on Android
                compactCapabilities: [Capability.Play, Capability.Pause],


            });
            await TrackPlayer.add(songs)
            await TrackPlayer.skip(currentSong);
            console.log(playbackState)
            togglePlayback(playbackState);
        } catch (error) {
            console.log(error, "error in playing music")
        }
    }
    const togglePlayback = async playbackState => {
        console.log(playbackState);
        if (
            playbackState === State.Paused ||
            playbackState === State.Ready ||
            playbackState === State.Buffering ||
            playbackState === State.Connecting
        ) {
            await TrackPlayer.play();
        } else {
            await TrackPlayer.pause();
        }
    };
    const togglePlayback2 = async playbackState => {
        console.log(playbackState);
        if (
            playbackState === State.Paused ||
            playbackState === State.Ready ||
            playbackState === State.Buffering ||
            playbackState === State.Connecting
        ) {
            await TrackPlayer.play();
        }
    };

    const togglePlayback3 = async (playbackState, songIndex) => {
        console.log(playbackState);
        if (playbackState === State.Playing) {
            // If audio is already playing, stop the current playback and start the new audio
            // await TrackPlayer.pause();
            if (songIndex >= 0 && songIndex < songs.length) {
                // setCurrentSong(songIndex); // Set the selected song as the current song
                await TrackPlayer.skip(songIndex); // Skip to the selected song's URL
                await TrackPlayer.play();
            }
        } else if (
            playbackState === State.Paused ||
            playbackState === State.Ready ||
            playbackState === State.Buffering ||
            playbackState === State.Connecting
        ) {
            if (songIndex >= 0 && songIndex < songs.length) {
                // setCurrentSong(songIndex); // Set the selected song as the current song
                await TrackPlayer.skip(songIndex); // Skip to the selected song's URL
                await TrackPlayer.play();
            }
        }
    };
    // useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
    //     if (event.type === Event.PlaybackTrackChanged && event.nextTrack != null) {
    //         const track = await TrackPlayer.getTrack(event.nextTrack);
    //         const { title, artwork }: any = track || {};
    //         setActiveName(title);
    //         setActiveAudio(artwork);
    //     } else {
    //         if (currentSong < songs.length - 1) {
    //             console.log("first")
    //         } else {
    //             // If on the last track, start from the beginning
    //             setCurrentSong(0);
    //             await TrackPlayer.skip(0);
    //             togglePlayback2(playbackState);
    //         }
    //     }
    // });
    useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
        if (event.type === Event.PlaybackTrackChanged && event.nextTrack != null) {
            const track = await TrackPlayer.getTrack(event.nextTrack);
            const { title, artwork }: any = track || {};
            setActiveName(title);
            setActiveAudio(artwork);

            // Update the currentSong state when the song changes
            let trackIndex = await TrackPlayer.getCurrentTrack();
            setCurrentSong(trackIndex);

        } else {
            if (currentSong < songs.length - 1) {
                console.log("first")
            } else {
                // If on the last track, start from the beginning
                setCurrentSong(0);
                await TrackPlayer.skip(0);
                togglePlayback2(playbackState);
            }
        }
    });

    useEffect(() => {
        if (State.Playing == playbackState) {
            if (progress.position.toFixed(0) == progress.duration.toFixed(0)) {
                if (currentSong < songs.length) {
                    setCurrentSong(currentSong + 1);
                }
            }
        }
    }, [progress]);



    return (
        <View style={{ flex: 1, }}>
            <ScrollView style={{ flex: 1, width: "100%" }}>
                <View style={{ flex: 1, alignItems: 'center', }}>
                    <View style={{ width: "100%", justifyContent: 'center', alignSelf: 'center', alignItems: 'center', marginVertical: 15 }}>
                        <Image source={activeAudio} style={{ width: 180, height: 180, borderRadius: 20 }} />
                        <View style={styles.sliderView}>
                            <Slider
                                value={progress.position ? Math.floor(progress.position) : 0}
                                maximumValue={progress.position ? Math.floor(progress.duration) : 0}
                                minimumValue={0}
                                thumbStyle={{ width: 20, height: 20 }}
                                thumbTintColor={'black'}
                                onValueChange={async value => {
                                    await TrackPlayer.seekTo(value);
                                    console.log(value)
                                }}
                            />
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text>{formattedCurrentTime}</Text>
                                <Text>{formattedTotalDuration}</Text>
                            </View>
                        </View>
                        <Text style={{ fontSize: 20, fontWeight: "bold", flex: 1, alignSelf: 'center', marginBottom: 20 }}>{activeName}</Text>
                    </View>
                    <Image source={require('./assets/img/play.png')} style={{ width: 35, height: 35, alignSelf: 'center', marginTop: 20 }} />
                    <Text style={{ fontSize: 22, fontWeight: "bold", flex: 1, alignSelf: 'center', marginBottom: 20 }}>{'Play all'}</Text>
                    {
                        songs.map((item: any, index: any) => {
                            const isCurrentSong = currentSong === index;
                            return (
                                <TouchableOpacity style={{ width: "85%", height: 55, marginHorizontal: 5, marginVertical: 8, borderRadius: 10, paddingHorizontal: 8, borderWidth: 1, alignItems: 'center', flexDirection: "row", }}
                                    key={index}
                                    onPress={() => {
                                        setCurrentSong(index); // Set the selected song as the current song
                                        togglePlayback3(playbackState, index); // Play the selected song
                                    }}>
                                    <Text style={{ fontSize: 22, fontWeight: "bold", flex: 1 }}>{item?.title}</Text>
                                    <Image source={isCurrentSong && playbackState === State.Playing
                                        ? require('./assets/img/pause.png')
                                        : require('./assets/img/play.png')} style={{ width: 35, height: 35 }} />
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>
            </ScrollView>
            <View style={{ width: "100%", flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 20, backgroundColor: 'grey' }}>
                <TouchableOpacity style={{ paddingHorizontal: 15, paddingVertical: 5 }}>
                    <Image source={require('./assets/img/suffle.png')} style={{ width: 22, height: 22, }} />

                </TouchableOpacity>
                <TouchableOpacity style={{ paddingHorizontal: 15, paddingVertical: 5 }} onPress={async () => {
                    if (currentSong > 0) {
                        setCurrentSong(currentSong - 1);

                        await TrackPlayer.skip(parseInt(currentSong) - 1);
                        togglePlayback2(playbackState);
                    }
                }}>
                    <Image source={require('./assets/img/previous.png')} style={{ width: 22, height: 22, }} />

                </TouchableOpacity>
                <TouchableOpacity style={{ paddingHorizontal: 15, paddingVertical: 5 }} onPress={() => {
                    togglePlayback(playbackState)
                }}>
                    <Image source={playbackState == State.Paused || playbackState == State.Ready
                        ? require('./assets/img/play.png') : require('./assets/img/pause.png')} style={{ width: 22, height: 22, }} />

                </TouchableOpacity>
                <TouchableOpacity style={{ paddingHorizontal: 15, paddingVertical: 5 }} onPress={async () => {
                    if (currentSong < songs.length - 1) { // Check if not on the last track
                        setCurrentSong(currentSong + 1);
                        await TrackPlayer.skip(currentSong + 1);
                    } else {
                        // If on the last track, start from the beginning
                        setCurrentSong(0);
                        await TrackPlayer.skip(0);
                    }
                    togglePlayback2(playbackState);
                }}>
                    <Image source={require('./assets/img/next.png')} style={{ width: 22, height: 22, }} />

                </TouchableOpacity>
                <TouchableOpacity style={{ paddingHorizontal: 15, paddingVertical: 5 }}>
                    <Image source={require('./assets/img/repeat.png')} style={{ width: 22, height: 22, }} />

                </TouchableOpacity>
            </View>

        </View>
    )

}

const styles = StyleSheet.create({
    sliderView: {
        marginTop: 20,
        alignSelf: 'center',
        width: '90%',
    },
});

export default Navigation