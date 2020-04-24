import React, {useState,useEffect,useRef,useCallback} from 'react'
import { DragDropContext,Droppable,Draggable } from 'react-beautiful-dnd'
import 'antd/dist/antd.css'
import { Form, Icon, Input, Button, Row, Col, Typography,Dropdown,Modal,Popconfirm,Tooltip,List,Card } from 'antd'
import JoditEditor from "jodit-react"
import { useMutation } from '@apollo/react-hooks'
import { Query } from '@apollo/react-components'
import gql from 'graphql-tag'
import {useDropzone} from 'react-dropzone'

import {randString} from '../utils'
import Header from '../components/Header'
import Board from '../components/Board'


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

const ALL_BOARDS = gql`
  query{
    allBoards{
      _id
      title
      content {
                _id
                title
                description
                images
              }
      status
    }
  }
`;

const NEW_BOARD_SUB = gql`
  subscription{
    newBoard{
      _id
      title
      content {
                _id
                title
                description
                images
              }
      status
    }
  }
`;

const CREATE_BOARD = gql`
  mutation createBoard($title: String!) {
    createBoard(title: $title) {
      _id
      title
      status
    }
  }
`

const UPDATE_CARD = gql`
  mutation updateCard($_id: String!, $idCard: String!, $title: String, $description: String) {
    updateCard(_id: $_id, idCard: $idCard, title: $title, description: $description) {
      success
    }
  }
`

const UPDATE_ORDER = gql`
  mutation updateOrder($result: String!) {
    updateOrder(result: $result) {
      success
    }
  }
`
const UPLOAD_FILES = gql`
  mutation uploadFiles($_id: String!, $idCard: String!, $files: [Upload]!) {
     uploadFiles(_id: $_id, idCard: $idCard, files: $files) {
       filename
     }
   }`;

let unsubscribe = null
function AppContainer() {
  const [board, setBoard] = useState([])
  const [boards, setBoards] = useState([])
  const [modalEditCard, setModalEditCard] = useState(false)
  const [id, setId] = useState('')
  const [idCard, setIdCard] = useState('')
  const [title, setTitle] = useState('')
  const joditEditorRef = useRef(null)
  const [description, setDescription] = useState('')
  const [images, setImages] = useState([])
  const [createBoard] = useMutation(CREATE_BOARD)
  const [updateCard] = useMutation(UPDATE_CARD)
  const [updateOrder] = useMutation(UPDATE_ORDER)
  const [uploadFiles] = useMutation(UPLOAD_FILES)

	useEffect(async () => {
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
    //const _result = JSON.stringify(result)
    updateOrder({ variables: {result:JSON.stringify(result)}})
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
    console.log("board",board)
	  //setBoard(board)
	  //localStorage.setItem('board',JSON.stringify(board))
	  //setBoards(board)
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
	const _updateCard = (_id,data) => {
		setModalEditCard(true)
		setId(_id)
		setIdCard(data._id)
		setTitle(data.title)
		setDescription(data.description)
    setImages(data.images)
	}
	const saveCard = () => {
		setModalEditCard(false)
    updateCard({ variables: {_id:id, idCard, title, description}})
		//board[id].content[idContent].title = title
		//board[id].content[idContent].description = description
		//setBoard([...board])
		//setBoards([...board])
		//localStorage.setItem('board',JSON.stringify(board))
	}
  const onDrop = useCallback(async acceptedFiles => {
    const {data} = await uploadFiles({variables:{_id:id, idCard,files:acceptedFiles}})
    data.uploadFiles.map(e => images.push(e.filename) )
    setImages([...images])
  }, [id,idCard,images])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <div style={{display:'block'}}>
    	<Header addBoard={() => createBoard({ variables: {title:'Board'}})} search={(e) => search(e )} />
      <DragDropContext onDragEnd={onDragEnd}>
      	<Droppable droppableId={'boardDroppleable'} index={0} direction='horizontal' type='COLUMN' direction='horizontal'>
	      	{(provided, snapshot) =>
	      		<div {...provided.droppableProps} ref={provided.innerRef} style={getListStylex(snapshot.isDraggingOver,0)}>
	      			<Query query={ALL_BOARDS}>
	      				{({loading,error, data, subscribeToMore}) => {
                    if(error) return <div>"error..."</div>
	      						if(loading) return <div>"Loading..."</div>
	      						if(!unsubscribe){
	      							unsubscribe = subscribeToMore({document:NEW_BOARD_SUB,updateQuery:(prev, {subscriptionData}) => {
	      								if(!subscriptionData.data) return prev
	      								const {newBoard} = subscriptionData.data
                        for(let i = 0; i<prev.allBoards.length ;i++){
                          if(prev.allBoards[i]._id == newBoard._id){
                            return { ...prev,allBoards: [...prev.allBoards] }
                          }
                        }
	      								return { ...prev,allBoards: [...prev.allBoards,newBoard] }
	      							}})
	      						}
                    setBoard(data.allBoards)
	      						return data.allBoards.map((e,i) => {
						          if(e.status){
                        return <Board board={e} index={i} updateCard={(_id,data) => _updateCard(_id,data)}/>
                      }
                    })
	      					}
	      				}
			        </Query>
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
          <Form.Item>
            <div {...getRootProps()}>
              <input {...getInputProps()} multiple />
              {
                isDragActive ?
                  <p>Drop the files here ...</p> :
                  <p>Drag 'n' drop some files here, or click to select files</p>
              }
              <List
                grid={{
                  gutter: 16,
                  xs: 1,
                  sm: 2,
                  md: 4,
                  lg: 4,
                  xl: 6,
                  xxl: 3,
                }}
                dataSource={images}
                renderItem={item => (
                  <List.Item>
                    <Card>
                      <img src={`${process.env.REACT_APP_URI_UPLOADS}${item}`} style={{width:'100%',height:'100%'}}/>
                    </Card>
                  </List.Item>
                )}
              />
            </div>
          </Form.Item>
      	</Form>
      </Modal>
    </div>
  );
}

export default AppContainer;
