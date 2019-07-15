import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import {
  TwilioVideoLocalView,
  TwilioVideoParticipantView,
  TwilioVideo
} from 'react-native-twilio-video-webrtc'

export default class TwilioExample extends Component {
  state = {
    isAudioEnabled: true,
    isVideoEnabled: true,
    status: 'disconnected',
    participants: new Map(),
    videoTracks: new Map(),
    roomName: 'bella_teste',
    token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImN0eSI6InR3aWxpby1mcGE7dj0xIn0.eyJqdGkiOiJTSzdlNGI5YjE0OGE1YTg5Njc2ZmUzMTM2YWEzYTVjNWU2LTE1NjMyMjkyNjYiLCJpc3MiOiJTSzdlNGI5YjE0OGE1YTg5Njc2ZmUzMTM2YWEzYTVjNWU2Iiwic3ViIjoiQUMxN2U3YWYxMTIwZjM5NTQyYTViYTZhN2UyZmY3YWI5YyIsImV4cCI6MTU2MzIzMjg2NiwiZ3JhbnRzIjp7ImlkZW50aXR5IjoiYmVsbGFfdGVzdGUiLCJ2aWRlbyI6e319fQ.d4yXsC0L3cB9PE9SqcQkxPTCSz4VCwffXk3g1G9_gcs'
  }

  _onConnectButtonPress = () => {
    this.refs.twilioVideo.connect({ roomName: this.state.roomName, accessToken: this.state.token })
    this.setState({status: 'connecting'})
  }

  _onEndButtonPress = () => {
    this.refs.twilioVideo.disconnect()
  }

  _onMuteButtonPress = () => {
    this.refs.twilioVideo.setLocalAudioEnabled(!this.state.isAudioEnabled)
      .then(isEnabled => this.setState({isAudioEnabled: isEnabled}))
  }

  _onFlipButtonPress = () => {
    this.refs.twilioVideo.flipCamera()
  }

  _onRoomDidDisconnect = ({roomName, error}) => {
    console.warn("ERROR: ", error)

    this.setState({status: 'disconnected'})
  }

  _onRoomDidFailToConnect = (error) => {
    console.warn("ERROR: ", error)

    this.setState({status: 'disconnected'})
  }

  _onParticipantAddedVideoTrack = ({participant, track}) => {
    console.warn("onParticipantAddedVideoTrack: ", participant, track)

    this.setState({
      videoTracks: new Map([
        ...this.state.videoTracks,
        [track.trackSid, { participantSid: participant.sid, videoTrackSid: track.trackSid }]
      ]),
    });
  }

  _onParticipantRemovedVideoTrack = ({participant, track}) => {
    console.warn("onParticipantRemovedVideoTrack: ", participant, track)

    const videoTracks = this.state.videoTracks
    videoTracks.delete(track.trackSid)

    this.setState({videoTracks: { ...videoTracks }})
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
      <View style={{ flex: 3 }}>
        <TwilioVideo
          ref="twilioVideo"
          onRoomDidConnect={ this._onRoomDidConnect }
          onRoomDidDisconnect={ this._onRoomDidDisconnect }
          onRoomDidFailToConnect= { (error)=>this._onRoomDidFailToConnect(error) }
          onParticipantAddedVideoTrack={ this._onParticipantAddedVideoTrack }
          onParticipantRemovedVideoTrack= { this._onParticipantRemovedVideoTrack }
        />
 
        <TwilioVideoLocalView style={{flex: 1, backgroundColor: '#FFFF00'}} />
 
        <TwilioVideoParticipantView style={{flex: 1, backgroundColor: '#FF00FF'}} />
      </View>
      <View style={{flex:1}}>
              <Button
              style={{fontSize: 20, padding: 10, color: 'green'}}
              onPress={this._onConnectButtonPress}
              title="Connect">
            </Button>
     
            <Button
              style={{fontSize: 20, padding: 10, color: 'red'}}
              onPress={this._onEndButtonPress}
              title="Disconnect">
            </Button>
            </View>
            </View>
    );
  }
}