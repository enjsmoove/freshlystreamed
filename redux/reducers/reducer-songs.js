export default function (state=null,action){
  switch(action.type){
    case "SONG_ADD":
      return action.payload;
      break;
    case "SONG_DOWNLOAD":
      return action.payload;
      break;
    case "SONG_CANCEL":
      return action.payload;
      break;
  }
  return state;
}
