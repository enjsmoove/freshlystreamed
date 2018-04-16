import React from 'react';
const Search= require('../components/Search')
const axios = require('axios')
const SearchList = require('../containers/SearchList')
const SongList = require('../containers/SongList')

import { Item } from 'semantic-ui-react'
const jsonp = require('jsonp-fallback')

import {Grid, Table,Col, Row,Nav,Navbar,ListGroup,Button} from 'react-bootstrap'



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
    this.getSuggestionValue =this.getSuggestionValue.bind(this)
  }

  // When suggestion is clicked, Autosuggest needs to populate the input element
  // based on the clicked suggestion. Teach Autosuggest how to calculate the
  // input value for every given suggestion.

  getSuggestionValue(suggestion){
    this.handleSubmit();
    return suggestion;
  }
  updateDownloadLinks(){
    var songs = []
    // adding id key to songs to keep track
    // this.state.addedData.forEach((song,index,array)=>{
    //   var e = song.id
    //   var endpoint ='/song/'+e
    //   axios.get(endpoint)
    //   .then(res=>{
    //     var updatedSong = res.data.song
    //     updatedSong['id']= song.id
    //     songs.push(updatedSong)
    //   }).then(res=>{
    //     //set state after pushed new songs
    //     if(index === array.length-1){
    //       console.log('done uploading')
    //       console.log(this.state.addedData)
    //       this.setState({addedData:songs})
    //       console.log(this.state.addedData)
    //     }
    //   })
    // })
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
  // Teaching Autosuggest how to calculate suggestions for any given input value.
  getSuggestions(value){
    console.log('get suggestions ',value)
    const inputValue = value.trim().toLowerCase();
    console.log('input',input)
    return inputLength === 0 ? [] : this.state.suggestions.filter(suggest =>
      suggest.toLowerCase().slice(0, inputLength) === inputValue
    );
  };


  renderSuggestion(suggestion){
    return (
    <div>
      {suggestion}
    </div>
  );
}
handleChange(event, { newValue }){
  console.log('event')
  // Teach Autosuggest how to calculate suggestions for any given input value.
    this.setState({value:newValue},()=>console.log('state value',this.state.value));
    console.log(event.key)
    if(event.key === 'Enter'){
      this.handleSubmit()
    }
}
  //
    // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested(value){
    console.log('value is ',value)
    var url ='https://suggestqueries.google.com/complete/search?q='+value.value+'&client=chrome&ds=yt'

       jsonp(url)
         .then(response=>{
           console.log(response)
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
    var endpoint = '/search/'+this.state.value
    axios.get(endpoint)
    .then(res=>{
      console.log(res.data.results)
      this.setState({searchData:res.data.results},()=>{
        console.log('got it'+this.state.searchData)
      })

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
    var song = this.state.searchData.filter(curr => {
      return curr.url ===id
    })
    console.log(song)
    song[0]["id"]= song[0].url
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
        <a href="#">Freshly Stream d</a>
      </Navbar.Brand> </Navbar>
      <Grid>
       <Row className="show-grid">
         <Col xs={12} md={8}>
           <Search getSuggestionValue={this.getSuggestionValue} handleSubmit={this.handleSubmit} handleAdd={this.handleAdd} handleChange={this.handleChange} getSuggestions={this.getSuggestions} renderSuggestion={this.renderSuggestion} onSuggestionsClearRequested={this.onSuggestionsClearRequested} onSuggestionsFetchRequested={this.onSuggestionsFetchRequested} handleSubmit={this.handleSubmit} getSong={this.getSong} updateDownloadLinks={this.updateDownloadLinks} inputProps={this.inputProps} {...this.state} />

        </Col>
         <Col xs={6} md={4}>
           <Item.Group divided>
                {this.state.addedData ? this.state.addedData.map(curr=>{
                    return(<SongList handleDelete={this.deleteSong} handleDownload={this.handleDownload} {...curr}/>)
                  }) : null
                }
            </Item.Group>
          </Col>
        </Row>
     </Grid>
     </div>
    );
  }
}
export default App;
