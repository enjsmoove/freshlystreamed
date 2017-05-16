import React from 'react'
import { Item} from 'semantic-ui-react'

const SearchList = (props) => {
// console.log(props.url)
  return (
    <Item  onClick={props.handleAdd.bind(this,props.url)} >
    <Item.Image size='tiny' src={props.albumart || '/smallhat.png'} />
      <Item.Content verticalAlign='middle'>
        <Item.Header as='a'>{props.title}</Item.Header>
        <Item.Description> Artist: {props.artist}</Item.Description>
      </Item.Content>
    </Item>
  )
}

module.exports = SearchList
