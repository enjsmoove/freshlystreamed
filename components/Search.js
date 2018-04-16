import React, {Component} from 'react'
import Autosuggest from 'react-autosuggest';
import { Item } from 'semantic-ui-react'
const jsonp = require('jsonp-fallback')
const axios = require('axios')
const SearchList = require('./SearchList')

class Search extends Component {
  constructor(props){
    super(props)
    this.state = {
      value: ' ',
      searchData: [],
      suggestions: [],
      addedData: [],
      flag:true
    }
    this.getSong = this.getSong.bind(this)
    this.handleAdd =this.handleAdd.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.hitSubmit = this.hitSubmit.bind(this)
    this.renderSuggestion =this.renderSuggestion.bind(this)
    this.getSuggestionValue =this.getSuggestionValue.bind(this)
    this.onSuggestionsFetchRequested =this.onSuggestionsFetchRequested.bind(this)
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this)
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
  // When suggestion is clicked, Autosuggest needs to populate the input element
  // based on the clicked suggestion. Teach Autosuggest how to calculate the
  // input value for every given suggestion.

  getSuggestionValue(suggestion){
    this.handleSubmit();
    return suggestion;
  }
  handleChange(event, { newValue, method }){
    // console.log('event')
    // Teach Autosuggest how to calculate suggestions for any given input value.
      this.setState({value:newValue},()=>console.log('state value',this.state.value));
      console.log(method)
      if(event.key === 'Enter'){
        this.handleSubmit()
      }
  }
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
    var endpoint = '/s/'+this.state.value
    console.log(endpoint)
    axios.get(endpoint)
    .then(res=>{
      // console.log(JSON.parse(res))
      this.setState({searchData:res.data.results},()=>{
        console.log(this.state.searchData)
      })
    }).catch(err=>{
      console.log('error searching ',err)
    })
      console.log('got it');
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
  getSong(id){
    var song = this.state.searchData.filter(curr => {
      return curr.url ===id
    })
    console.log(song)
    song[0]["id"]= song[0].url
    return song

  }
  hitSubmit(event){
    event.preventDefault()
    this.handleSubmit(event)
  }
  render(){
    const { value, suggestions } = this.state;

    const inputProps = {
      placeholder: 'Type in artist/song',
      value,
      onChange: this.handleChange
    };

    // Finally, render it!
    return (
      <form onSubmit={this.hitSubmit}>
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={this.getSuggestionValue}
          renderSuggestion={this.renderSuggestion}
          inputProps={inputProps}
        />
        <Item.Group>
         {this.state.searchData ? this.state.searchData.map(curr=>{
             return (
               <SearchList  handleAdd={this.handleAdd} {...curr}/>
             )
           }):
             <Item>
               <Item.Image size='tiny' src={'/smallhat.png'} />
                 <Item.Content verticalAlign='middle'>
                   <Item.Header as='a'>No Results big fella</Item.Header>
                   <Item.Description> Ya dig </Item.Description>
                 </Item.Content>
             </Item>
         }
       </Item.Group>
     </form>
    );
  }

}

module.exports = Search
