import { Injectable, NgZone } from '@angular/core';
import { Song } from '../reducers/playlist/playlist.model';

@Injectable()
export class YoutubeService {
  _auth: any;
  _token: string;
  window = <YTWindow>window;

  private playlist: GapiPlaylistItem[] = [];

  constructor(private zone: NgZone) {
    if (!this.window.youtubeAuth) {
      this.zone.runOutsideAngular(() => {
        const interval = setInterval(() => {
          if (this.window.youtubeAuth) {
            clearInterval(interval);
            this.assignVars();
          }
        }, 2000);
      });
    } else {
      this.assignVars();
    }
  }

  get auth() {
    return this._auth;
  }

  set auth(auth: YoutubeAuth) {
    console.log('Setting youtube auth to: ', auth);
    this._auth = auth;
  }

  get token() {
    return this._token;
  }

  set token(token: string) {
    console.log('Setting youtube token to: ', token);
    this._token = token;
  }

  assignVars() {
    this.auth = this.window.youtubeAuth;
    this.token = this.window.youtubeAuth.access_token;
  }

  getPlaylist(playlistID: string): Promise<Song[]> {
    return new Promise((resolve, reject) => {
      // get playlistItems from gapi
      // for each playlist Item - get video details
      // return Song[]
      let tempList: GapiPlaylistItem[] = [];

      function getPlaylistItems(page?: string): Promise<GapiPlaylistItem[]> {
        return new Promise((innerResolve, innerReject) => {
          const requestOptions: any = {
            part: 'snippet',
            playlistId: playlistID,
            maxResults: 50
          };
          if (page) requestOptions.pageToken = page;

          const request = gapi.client.youtube.playlistItems.list(requestOptions);
          request.execute((response: GapiResponse<GapiPlaylistItem>) => {
            if (response.items) {
              console.log(`Got ${response.items.length} songs from youtube`);
              // Add videos to tempList
              tempList = [...tempList, ...response.items];

              // handle pagination
              if (response.pageInfo && response.pageInfo.resultsPerPage < response.pageInfo.totalResults && response.nextPageToken) {
                // Get the other pages of songs from the api
                getPlaylistItems(response.nextPageToken)
                  .then(res => innerResolve(res));
              } else {
                innerResolve([...tempList, ...response.items]);
              }
            } else {
              innerReject(response);
            }
          });
        });
      }

      function getVideoDetails(video: GapiPlaylistItem): Promise<Song> {
        return new Promise((innerResolve, innerReject) => {
          const data: Song = {
            title: video.snippet.title,
            channel: '',
            videoId: video.snippet.resourceId.videoId,
            channelLink: '',
            active: false
          };
          const request = gapi.client.youtube.videos.list({
            id: video.snippet.resourceId.videoId,
            part: 'contentDetails, snippet'
          });
          request.execute((response: GapiResponse<GapiVideoItem>) => {
            if (response.items) {
              const videoDetails = response.items[0];
              data.channel = videoDetails.snippet.channelTitle;
              data.channelLink = `http://www.youtube.com/channel/${videoDetails.snippet.channelId}`;
              innerResolve(data);
            } else {
              innerReject(response);
            }
          });
        });
      }

      if (this.window.youtubeClientLoaded) {
        getPlaylistItems()
          .then((response) => {
            Promise
              .all(response.map(video => getVideoDetails(video)))
              .then(resolve);
          })
          .catch(reject);
      }
    });
  }
}
