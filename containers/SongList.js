import {ListGroupItem} from 'react-bootstrap'
import {Item, Image,Icon,Button} from 'semantic-ui-react'
import React from 'react'

const SongList = (props) => {

  return (
    <Item>
         <Item.Image src={props.albumart || '/smallhat.png'} />

         <Item.Content>
           <Item.Header as='a'>{props.title}</Item.Header>
           <Item.Meta>
             <span className='cinema'>{props.artist}</span>
           </Item.Meta>
           <Item.Description></Item.Description>
           <Item.Extra>
           <Button.Group>
           <Button onClick={props.handleDelete.bind(this,props.id)} positive>Cancel</Button>
           <Button.Or text='or' />
           <Button onClick={props.handleDownload.bind(this,props.id)} href={props.url} primary floated='right' download='freshly.mp3'>
           Download

                </Button>
                </Button.Group>
              </Item.Extra>
         </Item.Content>
       </Item>

  )
}



module.exports = SongList
