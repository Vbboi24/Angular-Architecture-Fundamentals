import * as fromRoot from '../../state/app.state';
import { VideoConsoleModel } from '../video-console.model';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { VideoConsoleActionTypes } from './video-consoles.actions';

export interface VideoConsoleState {
  showVideoConsoleCode: boolean;
  // currentVideoConsole: VideoConsoleModel;
  currentVideoConsoleId: number | null;
  videoconsoles: VideoConsoleModel[];
  error: string;
}

export interface State extends fromRoot.Sate {
  videoconsoles: VideoConsoleState;
}

const initialState: VideoConsoleState = {
  showVideoConsoleCode: true,
  currentVideoConsoleId: null,
  videoconsoles: [],
  error: '',
};

const getVideoConsoleFeatureState = createFeatureSelector<VideoConsoleState>('videoconsoles');

export const getShowVideoConsoleCode = createSelector(
  getVideoConsoleFeatureState,
  state => state.showVideoConsoleCode
);

export const getCurrentVideoConsoleId = createSelector(
  getVideoConsoleFeatureState,
  state => state.currentVideoConsoleId,
);

export const getCurrentVideoConsole = createSelector(
  getVideoConsoleFeatureState,
  getCurrentVideoConsoleId,
  (state, videoConsoleId) => {
    if (videoConsoleId === 0) {
      return {
        id: 0,
        name: '',
        code: 'new',
        description: '',
        rating: 0,
      };
    } else {
      return videoConsoleId ? state.videoconsoles.find(p => p.id === videoConsoleId) : null;
    }
  }
)

export const getVideoConsoles = createSelector(
  getVideoConsoleFeatureState,
  state => state.videoconsoles,
);

export const getError = createSelector(
  getVideoConsoleFeatureState,
  state => state.error
);


export const reducer = (state: VideoConsoleState = initialState, action): VideoConsoleState => {
  switch (action.type) {
    case VideoConsoleActionTypes.LoadSuccess:
      return {
        ...state,
        videoconsoles: [...action.payload],
        error: '',
      };

    case VideoConsoleActionTypes.LoadFailed:
      return {
        ...state,
        videoconsoles: [],
        error: action.payload,
      };

    case VideoConsoleActionTypes.ToggleVideoConsoleCode:
      return {
        ...state,
        showVideoConsoleCode: action.payload,
      };

    case VideoConsoleActionTypes.SetCurrentVideoConsole:
      return {
        ...state,
        currentVideoConsoleId: action.payload.id
      };

    case VideoConsoleActionTypes.ClearCurrentVideoConsole:
      return {
        ...state,
        currentVideoConsoleId: null
      };

    case VideoConsoleActionTypes.InitializeCurrentVideoConsole:
      return {
        ...state,
        currentVideoConsoleId: 0
      };

    case VideoConsoleActionTypes.UpdateVideoConsoleSuccess:
      const updatedVideoConsoles = state.videoconsoles.map(
        vc => action.payload.id === vc.id ? action.payload : vc
      );
      return {
        ...state,
        videoconsoles: updatedVideoConsoles,
        currentVideoConsoleId: action.payload.id,
        error: '',
      };

    case VideoConsoleActionTypes.UpdateVideoConsoleFailed:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

