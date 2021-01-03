import { setWorldAlignment } from 'expo/build/AR'
import React, {Component, useState} from 'react'
import {View, Text, Button, TextInput, StyleSheet, ToastAndroid} from 'react-native'
import {Loading} from './LoadingComponent'
import firebase from 'firebase'
import Constants from 'expo-constants'
require('firebase/firestore')
require('firebase/firebase-storage')
import {uploadImage, addDish} from '../firebase'

export default function SaveImage ({navigation}) {

    const [name, setName] = useState('')
    const [category, setCategory] = useState('')
    const [label, setLabel] = useState('')
    const [price, setPrice] = useState('')
    const [featured, setFeatured] = useState('')
    const [description, setDescription] = useState('')
    const [width, setWidth] = useState(0)
    const [err, setErr] = useState(null)


    const uploadImage = async () =>{
        const uri = navigation.getParam('uri')
        const res = await fetch(uri)
        const blob = await res.blob()
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        //const upload =  firebase.storage().ref().child(`post/${uniqueSuffix}`).put(blob)
            const taskPregress = snapshot => {
                const percentage = Math.round((snapshot.bytesTransferred/blob.size)*100)
                setWidth(percentage)
            }

            const taskCompleted = async() => {
                setWidth(0)
                const url = await upload.snapshot.ref.getDownloadURL()
                postDish(url)
            }

            const taskError = snapshot => setErr(`Error: ${snapshot}`)

            uploadImage(uniqueSuffix, blob, taskPregress, taskError, taskCompleted)
    }

    const postDish = async (url) =>{
        try{
            addDish({
                name,
                category,
                image:url,
                label,
                price,
                featured,
                description,
            })
        }catch(err){setErr(err.message)}
    }

        return(
            <View style={{flex:1, margin: Constants.statusBarHeight}}>
                <Button title='upload photo' onPress={() => navigation.navigate('admin')} />
                <TextInput multiline={true} style={styles.input} placeholder='name' value={name} onChangeText={name => setName(name)} />
                <TextInput style={styles.input} placeholder='category' value={category} onChangeText={category => setCategory(category)} />
                <TextInput style={styles.input} placeholder='label' value={label} onChangeText={label => setLabel(label)} />
                <TextInput style={styles.input} placeholder='price' value={price} onChangeText={price => setPrice(price)} />
                <TextInput style={styles.input} placeholder='featured' value={featured} onChangeText={featured => setFeatured(featured)} />
                <TextInput style={styles.input} placeholder='description' value={description} onChangeText={description => setDescription(description)} />
                <Button title='submit' onPress={() => uploadImage()} />
                <Button title='go back' onPress={() => navigation.navigate('App')} />
                {width!==0 ? <View style={{flex:1, alignItems:'center'}}><View style={{width:`${width}%`, height:20, alignSelf:'flex-start', backgroundColor:'green'}} /><Text>loading {width}%</Text><Loading /></View>:null}
                {err ? <Text>{err}</Text>: null}
            </View>
        )
}

const styles = StyleSheet.create({
    input:{
        padding:5,
        margin:5,
        width:'100%',
        height:'5%',
        borderWidth:1,
        borderRadius:10,
        borderColor:'red',
    }
})