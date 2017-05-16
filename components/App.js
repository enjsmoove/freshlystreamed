import React from 'react';
const Search= require('./Search')
const axios = require('axios')
const SearchList = require('./SearchList')
const SongList = require('./SongList')

import { Item} from 'semantic-ui-react'
const jsonp = require('jsonp-fallback')

import {Grid, Table,Col, Row,Nav,Navbar,ListGroup,Button} from 'react-bootstrap'

const getSuggestionValue = suggestion => suggestions;

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      value: '',
      searchData: [],
      addedData: [],
      suggestions: [],

      flag:true

    };

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.getSong = this.getSong.bind(this)
    this.handleAdd =this.handleAdd.bind(this)
    this.clearAllSongs = this.clearAllSongs.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.handleDownload =this.handleDownload.bind(this)
    this.updateDownloadLinks = this.updateDownloadLinks.bind(this)
    this.deleteSong=this.deleteSong.bind(this)
    this.onSuggestionsFetchRequested =this.onSuggestionsFetchRequested.bind(this)
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this)
    this.renderSuggestion =this.renderSuggestion.bind(this)
    // this.getSuggestions=this.getSuggestions.bind(this)
  }
  updateDownloadLinks(){
    var songs = []
    // adding id key to songs to keep track
    this.state.addedData.forEach((song,index,array)=>{
      var e = song.id
      var endpoint ='/song/'+e
      axios.get(endpoint)
      .then(res=>{
        var updatedSong = res.data.song
        updatedSong['id']= song.id
        songs.push(updatedSong)
      }).then(res=>{
        //set state after pushed new songs
        if(index === array.length-1){
          console.log('done uploading')
          console.log(this.state.addedData)
          this.setState({addedData:songs})
          console.log(this.state.addedData)
        }

      })
    })
  }
  componentWillMount(){
    // this.clearAllSongs()
    axios.get('/songs')
      .then(response=>{
        // console.log(response.data)
        this.setState({addedData:response.data})
        console.log('uploading')
          console.log(this.state.addedData)
        this.updateDownloadLinks();
      }).catch(err=>{
        console.log('error fetching ',err)
      })

  }
  getSuggestions(value){
    const inputValue = value.trim().toLowerCase();
    const input =function(){
      return inputLength === 0 ? [] : this.state.suggestions.filter(suggest =>
      suggest.toLowerCase().slice(0, inputLength) === inputValue
      )
    }
    console.log(input)
    return inputLength === 0 ? [] : this.state.suggestions.filter(suggest =>
      suggest.toLowerCase().slice(0, inputLength) === inputValue
    );
  };
  // When suggestion is clicked, Autosuggest needs to populate the input element
  // based on the clicked suggestion. Teach Autosuggest how to calculate the
  // input value for every given suggestion.


  // Use your imagination to render suggestions.
  renderSuggestion(){return (
    <div>
      {suggestion}
    </div>
  );
}
  handleChange(event, { newValue }){
    // Teach Autosuggest how to calculate suggestions for any given input value.
      this.setState({value:newValue})
      console.log(this.state.value)

      // console.log(this.state.value)
      // console.log(url)

  }
    // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested(value){
    console.log(value)
    var url ='https://suggestqueries.google.com/complete/search?q='+value+'&client=chrome&ds=yt'

       jsonp(url)
         .then(response=>{
           this.setState({suggestions:response[1]})
         }).catch(err=>{
           console.log('error getting suggestions ',err)
         })
         console.log(this.state.suggestions)
        //  this.setState({flag:false})

  };

    // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested(){
    console.log('clear')
    this.setState({
      suggestions: []
    });
  };

  handleKeyPress(target) {
    if(target.charCode==13) {this.handleSubmit() }
  }
  handleSubmit(e){
    if(e){ e.preventDefault() }
    // console.log(this.state.value)
    var endpoint = '/search/'+this.state.value
    axios.get(endpoint)
      .then(res=>{
      this.setState({searchData:res.data.results})
      console.log(this.state.searchData)
    }).catch(err=>{
      console.log('error searching ',err)
    })
  }
  deleteSong(id){
    console.log("deleting", id)
    var newData = this.state.addedData.filter(curr=>{
      return curr.id!==id
    })
    this.setState({addedData:newData})
    var endpoint = '/song/'+id
    axios.delete(endpoint)
      .then(res=>{
        console.log(res)
      }).catch(err=>{
        console.log(err)
      })
  }
  getSong(id){
    var song= this.state.searchData.filter(curr=>{return curr.url ===id})
    song[0]["id"]= song[0].url
    console.log(song)
    return song
  }
  clearAllSongs(){
    axios.delete('/songs')
      .then(res=>{
        console.log(res)
      })
  }

  handleAdd(id){
    console.log(id)
    axios.post('/add',this.getSong(id))
      .then(res=>{
        console.log(res)
        this.setState({addedData:this.state.addedData.concat(res.data[0])})
        this.updateDownloadLinks()
      })
  }
  handleDownload(e){
    console.log(e)
    console.log('before filter')
    var filteredSongs = this.state.addedData.filter(curr=>{
      return curr.id !==e
    })
      console.log('after filter')
    console.log('filtered songs',filteredSongs)
    this.deleteSong(e)
    this.setState({addedData:filteredSongs})
    }
  render() {
    const { value, suggestions } = this.state;

    const inputProps = {
      placeholder: 'Type in artist/song',
      value,
      onChange: this.handleChange
    };

    return (
      <div>
      <Navbar inverse collapseOnSelect><Navbar.Brand>
        <a href="#">Freshly Streamed</a>
      </Navbar.Brand> </Navbar>
      <Grid>
       <Row className="show-grid">
         <Col xs={12} md={8}>
         <Search   suggestions={this.state.suggestions}
           onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
           onSuggestionsClearRequested={this.onSuggestionsClearRequested}
           getSuggestionValue={this.getSuggestionValue}
           renderSuggestion={this.renderSuggestion}
           inputProps={inputProps}
           />
         <Item.Group>
                {this.state.searchData.map(curr=>{
                  // console.log(curr.title)
                    return (<SearchList  handleAdd={this.handleAdd} {...curr}/>)
                  })
                }

          </Item.Group>
          </Col>
         <Col xs={6} md={4}>

         <Item.Group divided>
              {this.state.addedData.map(curr=>{
                  return(<SongList handleDelete={this.deleteSong} handleDownload={this.handleDownload} {...curr}/>)
                })}
          </Item.Group>
          </Col>
          </Row>
     </Grid>
     </div>
    );
  }
}
export default App;
