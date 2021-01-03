import React, {useState, useEffect} from 'react'
import {View, Text, Button, Image} from 'react-native'
import {logout} from '../Redux/ActionCreators'
import { connect } from 'react-redux'
import Constants from 'expo-constants'
import {signout} from '../firebase'

function Logout (props){

    const {firstname, lastname, email, imageUrl} = props.user.user
    const signOut= () =>{
        signout()
        props.logout()
        props.navigation.navigate('Auth')
    }
    const addDish = async() =>{
        props.navigation.navigate('save')
    }
    return(
        <View style={{flex:1, marginTop:Constants.statusBarHeight,  alignItems:'center', }}>
            {imageUrl ? <Image source={{uri:imageUrl}} style={{height:180, width:180, borderRadius:90}}/>: null}
            <Text>{firstname} {lastname}</Text>
            <Text>{email}</Text>
            {props.user.user.admin?<Button title='add dish' onPress={() => addDish()}/>:null}
            <Button title='logout' onPress={() => signOut()}/>
        </View>
    )
}

const mapStateToProps = store => ({
	user: store.user
})

const mapDispatchToProps = dispatch => ({
	logout: () => dispatch(logout()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Logout)