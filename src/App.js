import React, {useState,useEffect,useRef} from 'react'
import { DragDropContext,Droppable,Draggable } from 'react-beautiful-dnd'
import {randString} from './utils'
import './App.css'
import 'antd/dist/antd.css'
import { Form, Icon, Input, Button, Row, Col, Typography,Dropdown,Modal,Popconfirm,Tooltip, } from 'antd'
import JoditEditor from "jodit-react"


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

function App() {
  const [board, setBoard] = useState([
                                      {
                                      	_id:'1',
                                        title:'drop1',
                                        content:[
                                          {_id:'3',title:'drag1',description:''},
                                          {_id:'4',title:'drag2',description:''},
                                        ]
                                      },
                                      {
                                      	_id:'2',
                                        title:'drop2',
                                        content:[
                                          {_id:'5',title:'drag3',description:''},
                                          {_id:'6',title:'drag4',description:''},
                                        ]
                                      },
                                      {
                                      	_id:'7',
                                        title:'drop3',
                                        content:[
                                          {_id:'8',title:'drag5',description:''},
                                          {_id:'9',title:'drag6',description:''},
                                        ]
                                      },
                                      {
                                      	_id:'10',
                                        title:'drop4',
                                        content:[
                                          {_id:'11',title:'drag7',description:''},
                                          {_id:'12',title:'drag8',description:''},
                                        ]
                                      },
                                      {
                                      	_id:'13',
                                        title:'drop5',
                                        content:[
                                          {_id:'14',title:'drag9',description:''},
                                          {_id:'15',title:'drag10',description:''},
                                        ]
                                      },
                                      {
                                      	_id:'16',
                                        title:'drop6',
                                        content:[
                                          {_id:'17',title:'drag11',description:''},
                                          {_id:'18',title:'drag12',description:''},
                                        ]
                                      },
                                      {
                                      	_id:'19',
                                        title:'drop7',
                                        content:[
                                          {_id:'20',title:'drag13',description:''},
                                          {_id:'21',title:'drag14',description:''},
                                        ]
                                      },
                                      {
                                      	_id:'22',
                                        title:'drop8',
                                        content:[
                                          {_id:'23',title:'drag15',description:''},
                                          {_id:'24',title:'drag16',description:''},
                                        ]
                                      },
                                    ])
  const [boards, setBoards] = useState([])
  const [modalEditCard, setModalEditCard] = useState(false)
  const [id, setId] = useState('')
  const [idContent, setIdContent] = useState('')
  const [title, setTitle] = useState('')
  const joditEditorRef = useRef(null)
  const [description, setDescription] = useState('')

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
	const search = (value) => {
		setBoards(board)
		if(value.length > 0){
			const newBoards = board.filter((e,i) => {
				if( e.title.toLowerCase().indexOf(value.toLowerCase()) !== -1){
					return e
				}
				/*const a = e.content.filter((ee,ii) => {
					console.log("aaa",ee,ii)
					if( (ee.description.toLowerCase().indexOf(value.toLowerCase()) !== -1) ){
						console.log("eee",e)
						return e
					}
				})
				console.log(a)*/
			})
			setBoards([...newBoards])
		}

	}
	const addBoard = () => {
	  const newBoard = {_id:randString(),title:'Board',content:[{_id:randString(),title:'Drag'}]}
	  localStorage.setItem('board',JSON.stringify([newBoard,...board]))
	  setBoard([newBoard,...board])
	  setBoards([newBoard,...boards])
	}
	const addCard = (i) => {
		const newCard = {_id:randString(),title:'Card',description:''}
		board[i].content.push(newCard)
	  localStorage.setItem('board',JSON.stringify(board))
	  setBoard([...board])
	  setBoards([...board])
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
	const updateBoard = (i,value) => {
		board[i].title = value
		setBoard([...board])
		setBoards([...board])
		localStorage.setItem('board',JSON.stringify(board))
	}
	const updateCard = (i,data,ii) => {
		setModalEditCard(true)
		setId(i)
		setIdContent(ii)
		setTitle(data.title)
		setDescription(data.description)
	}
	const saveCard = () => {
		setModalEditCard(false)
		board[id].content[idContent].title = title
		board[id].content[idContent].description = description
		setBoard([...board])
		setBoards([...board])
		localStorage.setItem('board',JSON.stringify(board))
	}
  return (
    <div className="App" style={{display:'block'}}>
    	<div style={{marginTop:40,padding:5}}>
    		<Input size="large" onChange={(e) => search(e.target.value) } placeholder={'Search'} />
    		<Button onClick={() => addBoard()}>Add <Icon type="plus" style={{ color: 'rgba(0,0,0,.25)' }} /></Button>
    	</div>
      <DragDropContext onDragEnd={onDragEnd}>
      	<Droppable droppableId={'boardDroppleable'} index={0} direction='horizontal' type='COLUMN' direction='horizontal'>
	      	{(provided, snapshot) =>
	      		<div {...provided.droppableProps} ref={provided.innerRef} style={getListStylex(snapshot.isDraggingOver,0)}>
			        {boards.map((e,i) =>
			          <Draggable key={e._id} draggableId={e._id} index={i}>
		    					{(provided, snapshot) => (
		    						<div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} >
			          			<Droppable key={e._id} droppableId={e._id} index={i}>
			                  {(provided, snapshot) => (
			                    <div {...provided.droppableProps} ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver,i)}>
			                    	<Input size="middle" value={e.title} onChange={(e) => updateBoard(i,e.target.value) } placeholder={'Board'} style={{width:'85%'}}/>
			                    	<Popconfirm
						                  title={'youSureDeleteUser'}
						                  onConfirm={() => deleteBoard(i,'')}
						                  cancelText={'cancel'}
						                  okText={'yes'}>
						                	<Tooltip placement="bottom" title={'delete'}>
                            		<Button  icon="close" type="danger" />
                            	</Tooltip>
                            </Popconfirm>
			                      {e.content.map((ee,ii) => {
			                        return <Draggable key={ee._id} draggableId={ee._id} index={ii}>
			                                  {(provided, snapshot) => (
			                                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} style={getItemStyle(snapshot.isDragging,provided.draggableProps.style)}>
			                                      <b onClick={() => updateCard(i,ee,ii)}>{ee.title}</b>
			                                      {/*<button onClick={() => deleteBoard(i,ii)}>
			                                      	<Icon type="close" style={{ color: 'rgba(0,0,0,.25)' }} />
			                                      </button>*/}
			                                      <Popconfirm
														                  title={'youSureDeleteUser'}
														                  onConfirm={() => deleteBoard(i,ii)}
														                  cancelText={'cancel'}
														                  okText={'yes'}>
														                	<Tooltip placement="bottom" title={'delete'}>
		                                        		<Button icon="close" type="danger" />
		                                        	</Tooltip>
		                                        </Popconfirm>
			                                      <div onClick={() => updateCard(i,ee,ii)}>
			                                      	{ee.description}
			                                      </div>
			                                    </div>
			                                  )}
			                               	</Draggable>
			                      })}
			                      <div style={{marginTop:10}}>
				                      <Button block onClick={() => addCard(i)}>
				                      	<Icon type="plus" style={{ color: 'rgba(0,0,0,.25)' }} />
				                      </Button>
			                      </div>
			                    </div>
			                  )}
			                </Droppable>
			              </div>
		              )}
		            </Draggable>
			        )}
		        </div>
	        }
        </Droppable>
      </DragDropContext>
      <Modal visible={modalEditCard} onOk={() => saveCard() } title={<Input size="large" value={title} onChange={(e) => setTitle(e.target.value) } style={{width:'95%'}} placeholder={'Title'} />} onCancel={()=> setModalEditCard(false)} width={'80%'} >
      	<Form onSubmit={(e) => console.log(e)}>
          <Form.Item>
          {/*<JoditEditor
            	ref={joditEditorRef}
                value={description}
                config={{readonly:false}}
								tabIndex={1} // tabIndex of textarea
								onBlur={newContent => setDescription(newContent)} // preferred to use only this option to update the content for performance reasons
                onChange={newContent => {}}
            />*/}
      			<Input.TextArea size="large" value={description} onChange={(e) => setDescription(e.target.value) } style={{height:300}} placeholder={'Description'} />
          </Form.Item>
      	</Form>
      </Modal>
    </div>
  );
}

export default App;
