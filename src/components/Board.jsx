import React, {useState,useEffect,useRef} from 'react'
import { DragDropContext,Droppable,Draggable } from 'react-beautiful-dnd'
import { Form, Icon, Input, Button, Row, Col, Typography,Dropdown,Modal,Popconfirm,Tooltip, } from 'antd'
import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import {randString} from '../utils'

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding:10,
  height:100,
  //maxHeight:300

  // change background colour if dragging
  background: "#fff",
  overflow:'hidden',
  opacity:1,

  // styles we need to apply on draggables
  ...draggableStyle,
  marginTop:10,
  borderRadius:5
});

const getListStyle = (isDraggingOver,color) => ({
  background: "lightgrey",
  padding: 8,
  width: 250,
  minWidth:250,
  marginLeft:20,
  minHeight:250,
  borderRadius:5
});

const getListStylex = (isDraggingOver,color) => ({
  padding: 8,
  display:'flex',
});

const RENAME_BOARD = gql`
  mutation renameBoard($_id: String, $title: String!) {
    renameBoard(_id: $_id, title: $title) {
    	success
    }
  }
`

const REMOVE_BOARD = gql`
  mutation removeBoard($_id: String) {
    removeBoard(_id: $_id) {
    	success
    }
  }
`

const CREATE_CARD = gql`
  mutation createCard($_id: String, $idCard: String,$title: String!) {
    createCard(_id: $_id, idCard: $idCard, title: $title) {
    	success
    }
  }
`

export default function Board(props){
	const [board, setBoard] = useState([])
  const [boards, setBoards] = useState([])
  const [modalEditCard, setModalEditCard] = useState(false)
  const [id, setId] = useState('')
  const [idContent, setIdContent] = useState('')
  const [title, setTitle] = useState('')
  const joditEditorRef = useRef(null)
  const [description, setDescription] = useState('')
  const [renameBoard] = useMutation(RENAME_BOARD)
  const [createCard] = useMutation(CREATE_CARD)
  const [removeBoard] = useMutation(REMOVE_BOARD)

	useEffect(() => {
	  //localStorage.setItem('board',JSON.stringify(board))
	  //localStorage.removeItem('board')
	  let boardDB = localStorage.getItem('board')
	  if(boardDB != null){
	  	setBoard(JSON.parse(boardDB))
	  	setBoards(JSON.parse(boardDB))
	  }else{
	  	setBoard([])
	  	setBoards([])
	  }
	},[])
  const onDragEnd = (result) => {
		if (!result.destination) {
	    return;
	  }
	  let removed=null
	  if(result.destination.droppableId === "boardDroppleable"){
	  	if(result.source.droppableId !== "boardDroppleable"){
	  		board.map((e,i) => {
			  	if(e._id === result.source.droppableId){
			  		[removed] = board[i].content.splice(result.source.index,1)
			  		removed.content = [{_id:randString(),title:removed.title,description:removed.description}]
			  	}
			  	return e
			  })
	  	}else{
	  		[removed] = board.splice(result.source.index, 1);
	  	}
		  board.splice(result.destination.index, 0, removed);
	  }else if(result.source.droppableId !== "boardDroppleable"){
		  board.map((e,i) => {
		  	if(e._id === result.source.droppableId){
		  		[removed] = board[i].content.splice(result.source.index,1)
		  	}
		  	return e
		  })
		  board.map((e,i) => {
		  	if(e._id === result.destination.droppableId){
		  		board[i].content.splice(result.destination.index,0,removed)
		  	}
		  	return e
		  })
	  }
	  setBoard(board)
	  localStorage.setItem('board',JSON.stringify(board))
	  setBoards(board)
	}
	const deleteBoard = (i,ii='') => {
		if(ii === ''){
			board.splice(i,1)
		}else{
			//isCard
			board[i].content.splice(ii,1)
		}
		localStorage.setItem('board',JSON.stringify(board))
		setBoard([...board])
	  setBoards([...board])
	}
	/*const updateCard = (i,data,ii) => {
		console.log("updateCard")
		setModalEditCard(true)
		//setId(i)
		//setIdContent(ii)
		//setTitle(data.title)
		//setDescription(data.description)
	}*/
	const saveCard = () => {
		setModalEditCard(false)
		board[id].content[idContent].title = title
		board[id].content[idContent].description = description
		setBoard([...board])
		setBoards([...board])
		localStorage.setItem('board',JSON.stringify(board))
	}

	return (
		<Draggable key={props.board._id} draggableId={props.board._id} index={props.index}>
			{(provided, snapshot) => (
				<div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} >
    			<Droppable key={props.board._id} droppableId={props.board._id} index={props.index}>
            {(provided, snapshot) => (
              <div {...provided.droppableProps} ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver,props.index)}>
              	<Input size="middle" defaultValue={props.board.title} onBlur={(e) => renameBoard({ variables: {_id:props.board._id,title:e.target.value}}) } placeholder={'Board'} style={{width:'85%'}}/>
              	<Popconfirm
                  title={'youSureDeleteUser'}
                  onConfirm={() => removeBoard({ variables: {_id:props.board._id}})}
                  cancelText={'cancel'}
                  okText={'yes'}>
                	<Tooltip placement="bottom" title={'delete'}>
                		<Button  icon="close" type="danger" />
                	</Tooltip>
                </Popconfirm>
                {props.board.content && props.board.content.map((ee,ii) => {
                  return <Draggable key={ee._id} draggableId={ee._id} index={ii}>
                            {(provided, snapshot) => (
                              <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} style={getItemStyle(snapshot.isDragging,provided.draggableProps.style)}>
                                <b onClick={() => props.updateCard(props.board._id,ee)}>{ee.title}</b>
                                {/*<button onClick={() => deleteBoard(i,ii)}>
                                	<Icon type="close" style={{ color: 'rgba(0,0,0,.25)' }} />
                                </button>*/}
                                <Popconfirm
								                  title={'youSureDeleteUser'}
								                  onConfirm={() => deleteBoard(props.index,ii)}
								                  cancelText={'cancel'}
								                  okText={'yes'}>
								                	<Tooltip placement="bottom" title={'delete'}>
                                		<Button icon="close" type="danger" />
                                	</Tooltip>
                                </Popconfirm>
                                <div onClick={() => props.updateCard(props.board._id,ee)}>
                                	{ee.description}
                                </div>
                              </div>
                            )}
                         	</Draggable>
                })}
                <div style={{marginTop:10}}>
                  <Button block onClick={() => createCard({ variables: {_id:props.board._id,idCard:randString(),title:'Card'}})}>
                  	<Icon type="plus" style={{ color: 'rgba(0,0,0,.25)' }} />
                  </Button>
                </div>
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
	)
}