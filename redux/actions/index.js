export const addSong = (song) => {
  console.log('you added a song:', song.name);
  return {
    type: "SONG_ADD",
    payload: song
  }
}
