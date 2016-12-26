/*
 * Custom Type Definitions
 * When including 3rd party modules you also need to include the type definition for the module
 * if they don't provide one within the module. You can try to install it with typings
 typings install node --save
 * If you can't find the type definition in the registry we can make an ambient definition in
 * this file for now. For example
 declare module "my-module" {
 export function doesSomething(value: string): string;
 }
 *
 * If you're prototying and you will fix the types later you can also declare it as type any
 *
 declare var assert: any;
 *
 * If you're importing a module that uses Node.js modules which are CommonJS you need to import as
 *
 import * as _ from 'lodash'
 * You can include your type definitions in this file until you create one for the typings registry
 * see https://github.com/typings/registry
 *
 */

// Extra variables that live on Global that will be replaced by webpack DefinePlugin
declare var AOT: boolean;
declare var ENV: string;
declare var HMR: boolean;
declare var HOST: string;
declare var PORT: number;
declare var STORE_DEV_TOOLS: string;
declare var System: SystemJS;
interface YoutubeAuth {
  state: string;
  access_token: string;
  token_type: string;
  expires_in: string;
  scope: string;
}

interface YTWindow extends Window {
  youtubeAuth: YoutubeAuth;
  youtubeClientLoaded: boolean;
  YoutubeIframeAPIReady: boolean;
}

declare type VideoID = string;

interface GapiResponse<T> {
  kind: string;
  etag: string;
  nextPageToken: string;
  prevPageToken: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: T[];
}
interface GapiPlaylistItem {
  kind: 'youtube#playlistItem';
  etag: string;
  id: string;
  snippet: {
    publishedAt: string;
    channelId: string;
    channelTitle: string;
    title: string;
    description: string;
    thumbnails: {
      [key: string]: {
        url: string;
        width: number;
        height: number;
      }
    };
    resourceId: {
      kind: 'youtube#video';
      videoId: string;
    }
  };
  channelTitle: string;
  tags: string[];
  defaultLanguage: string;
  localized: {
    title: string;
    description: string;
  };
  status: {
    privacyStatus: 'private' | 'public' | 'unlisted';
  };
  contentDetails: {
    itemCount: number;
  };
  player: {
    embedHtml: string;
  };
}
interface GapiVideoItem {
  contentDetails: {
    caption: boolean;
    definition: string;
    deminsion: string;
    duration: string;
    licensedContent: string;
    projection: string;
  };
  etag: string;
  id: VideoID;
  kind: 'youtube#video';
  snippet: {
    categoryId: string;
    channelId: string;
    channelTitle: string;
    description: string;
    liveBroadcastContent: string;
    localized: {
      description: string;
      title: string;
    };
    publishedAt: string;
    tags: string[];
    thumbnails: {
      [key: string]: {
        url: string;
        width: number;
        height: number;
      }
    };
    title: string;
  };
}

interface SystemJS {
  import: (path?: string) => Promise<any>;
}

declare namespace gapi {
  export const client: {
    youtube: {
      activities: any,
      captions: any,
      channelBanners: any,
      channels: any,
      channelSections: any;
      comments: any;
      commentThreads: any;
      guideCategories: any;
      i18nLanguages: any;
      i18nRegions: any;
      playlistItems: any;
      playlists: any;
      search: any;
      subscriptions: any;
      thumbnails: any;
      videos: any;
    }
  };
}

interface GlobalEnvironment {
  AOT;
  ENV;
  HMR;
  HOST;
  PORT;
  STORE_DEV_TOOLS;
  SystemJS: SystemJS;
  System: SystemJS;
}

interface WebpackModule {
  hot: {
    data?: any,
    idle: any,
    accept(dependencies?: string | string[], callback?: (updatedDependencies?: any) => void): void;
    decline(dependencies?: string | string[]): void;
    dispose(callback?: (data?: any) => void): void;
    addDisposeHandler(callback?: (data?: any) => void): void;
    removeDisposeHandler(callback?: (data?: any) => void): void;
    check(autoApply?: any, callback?: (err?: Error, outdatedModules?: any[]) => void): void;
    apply(options?: any, callback?: (err?: Error, outdatedModules?: any[]) => void): void;
    status(callback?: (status?: string) => void): void | string;
    removeStatusHandler(callback?: (status?: string) => void): void;
  };
}
interface WebpackRequire extends NodeRequireFunction {
  context(file: string, flag?: boolean, exp?: RegExp): any;
}


// interface ErrorStackTraceLimit {
//   stackTraceLimit: number;
// }


// Extend typings
interface NodeRequire extends WebpackRequire {
}
// interface ErrorConstructor extends ErrorStackTraceLimit {}
interface NodeModule extends WebpackModule {
}
interface Global extends GlobalEnvironment {
}
