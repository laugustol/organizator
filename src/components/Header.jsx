import React,{useState,useEffect} from 'react'
import { Icon, Input, Button } from 'antd'
export default function Header(props){
	return (
		<div style={{marginTop:40,padding:5}}>
  		<Input size="large" onChange={(e) => props.search(e.target.value) } placeholder={'Search'} />
  		<Button onClick={() => props.addBoard()}>Add <Icon type="plus" style={{ color: 'rgba(0,0,0,.25)' }} /></Button>
  	</div>
	)
}