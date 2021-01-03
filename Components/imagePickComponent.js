import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Button, Image } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker'

export function ImageView({navigation}){
  const uri = navigation.getParam('uri')
  return( uri && 
            <View style={{flex:1}}>
              <Image source={{uri}} style={{flex:1}} />
              <Button title='save image' onPress={() => navigation.navigate('save', {uri})} />
              <Button title='cancel' onPress={() => navigation.navigate('Image')} />
            </View>
  )
}

export default function AddDish({navigation}) {
  const [CPermission, setCPermission] = useState(null);
  const [CRPermission, setCRPermission] = useState(null)
  const [camera, setCamera] = useState(null)
  const [uri, setUri] = useState(null)
  const [type, setType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    (async () => {
      const cPermission = await Camera.requestPermissionsAsync();
      setCPermission(cPermission.status === 'granted');

      const crPermission = await ImagePicker.requestMediaLibraryPermissionsAsync()
      setCRPermission(crPermission.status === 'granted');
    })();
  }, []);

  const pickImage = async () => {
    let photo = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })
    if(!photo.cancelled){
      setUri(photo.uri)
      navigation.navigate('ImageView', {uri: photo.uri})      
    }

  }

  const takePhoto = async () =>{
    if(camera){
      const photo = await camera.takePictureAsync(null)
      setUri(photo.uri)
      navigation.navigate('ImageView', {uri: photo.uri})
    }
  }

  if (CPermission === null) {
    return <View />;
  }
  if (CPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={{flex: 1}}>
        <View style={{flex:1, flexDirection:'row'}}>
            <Camera style={{flex:1, aspectRatio:1}} ratio='1:1' ref={ref => setCamera(ref)} type={type} />
        </View>
        <Button
        title='Flip'
            style={{flex:1}}
            onPress={() => {
                setType(
                type === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back
                );
        }} />
        <Button
        title='take photo'
            style={{flex:1}}
            onPress={() => takePhoto()} />
        <Button
        title='select photo from gallary'
            style={{flex:1}}
            onPress={() => pickImage()} />
        <Button
        title='cancel'
            style={{flex:1}}
            onPress={() => navigation.navigate('save')} />
    </View>
  );
}
const styles = StyleSheet.create({}); 

