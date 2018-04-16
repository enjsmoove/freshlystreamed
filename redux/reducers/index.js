import {combineReducers} from 'redux'
import SongReducer from './reducer-songs'

const allReducers = combineReducers({
  songs: SongReducer
})

export default allReducers
