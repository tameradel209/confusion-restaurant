import React, { Component } from 'react';
import { View, StyleSheet, Text, ScrollView, Image, ToastAndroid, KeyboardAvoidingView, Platform } from 'react-native';
import { Card, Icon, Input, CheckBox, Button } from 'react-native-elements';
import * as SecureStore from 'expo-secure-store';
import * as Permissions from 'expo-permissions'
import * as ImagePicker from 'expo-image-picker'
import { createBottomTabNavigator } from 'react-navigation'
import { connect } from 'react-redux';
import {login} from '../Redux/ActionCreators'
import {Loading} from './LoadingComponent'
import {signup, signin, currentUser} from '../firebase'

const showToastWithGravity = (message) => {
    ToastAndroid.showWithGravity(
      message,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM
    )
  }

export class RegisterTab extends Component {

    constructor(props) {
        super(props);

        this.state = {
            password: '',
            passwordAgain: '',
            firstname: '',
            lastname: '',
            email: '',
            remember: false,
            togglePassword: true,
            imageUrl: null,
            err: '',
            loading: false
        }
    }

    getImageFromCamera = async () => {
        const cameraPermission = await Permissions.askAsync(Permissions.CAMERA);
        const cameraRollPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);

        if (cameraPermission.status === 'granted' && cameraRollPermission.status === 'granted') {
            let capturedImage = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 3],
            });
            if (!capturedImage.cancelled) {
                this.setState({ imageUrl: capturedImage.uri });
            }
        }

    }

    static navigationOptions = {
        title: 'Register',
        tabBarIcon: ({ tintColor, focused }) => (
            <Icon
                name='user-plus'
                type='font-awesome'
                size={24}
                iconStyle={{ color: tintColor }}
            />
        )
    };

    async handleRegister() {
        this.setState({loading:true})
        const {email, password, passwordAgain, firstname, lastname, imageUrl} = this.state
        this.setState({err: ''})
        if(password !== passwordAgain){
            this.setState({loading:false})
            this.setState({err: 'confirm the password'})
        }
        else{
            try{
                const res = await signup(email, password, {firstname, lastname, email, imageUrl})
                this.props.navigation.navigate('Login')
                this.setState({loading:false})
            }catch(err){
                this.setState({err: err.message})
                this.setState({loading:false})       
            }
            if (this.state.remember)
                SecureStore.setItemAsync('userinfo', JSON.stringify({ email: this.state.email, password: this.state.password }))
                    .catch((err) => showToastWithGravity(err.message));            
        }
    }

    render() {
        return (
            <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding': 'height'}>
            <ScrollView>
                <View style={styles.container}>
                    <View style={styles.imageContainer}>
                    {this.state.imageUrl ?
                        <Image 
                            source={{uri:this.state.imageUrl}}                             loadingIndicatorSource={require('./images/logo.png')}
                            loadingIndicatorSource={require('./images/logo.png')}
                            style={styles.image}
                            />: null
                            }
                        <Button
                            title="Camera"
                            onPress={this.getImageFromCamera}
                        />
                    </View>
                    {this.state.err !== '' ? <Text style={{color:'red'}}>{this.state.err}</Text> :null}
                    <Input
                        placeholder="Email"
                        leftIcon={{ type: 'font-awesome', name: 'envelope-o' }}
                        onChangeText={(email) => this.setState({ email })}
                        value={this.state.email}
                        containerStyle={styles.formInput}
                    />
                    <Input
                        placeholder="Password"
                        secureTextEntry ={this.state.togglePassword}
                        leftIcon={{ type: 'font-awesome', name: 'key' }}
                        rightIcon={<Icon name={this.state.togglePassword ?'eye-slash':'eye'} type='font-awesome' onPress = {() => this.setState({togglePassword:!this.state.togglePassword})} />}
                        onChangeText={(password) => this.setState({ password })}
                        value={this.state.password}
                        containerStyle={styles.formInput}
                    />
                    <Input
                        placeholder="enter password again"
                        secureTextEntry ={this.state.togglePassword}
                        leftIcon={{ type: 'font-awesome', name: 'key' }}
                        rightIcon={<Icon name={this.state.togglePassword ?'eye-slash':'eye'}  type='font-awesome' onPress = {() => this.setState({togglePassword:!this.state.togglePassword})} />}
                        onChangeText={(passwordAgain) => this.setState({ passwordAgain })}
                        value={this.state.passwordAgain}
                        containerStyle={styles.formInput}
                    />
                    <Input
                        placeholder="First Name"
                        leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                        onChangeText={(firstname) => this.setState({ firstname })}
                        value={this.state.firstname}
                        containerStyle={styles.formInput}
                    />
                    <Input
                        placeholder="Last Name"
                        leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                        onChangeText={(lastname) => this.setState({ lastname })}
                        value={this.state.lastname}
                        containerStyle={styles.formInput}
                    />
                    <CheckBox title="Remember Me"
                        center
                        checked={this.state.remember}
                        onPress={() => this.setState({ remember: !this.state.remember })}
                        containerStyle={styles.formCheckbox}
                    />
                    <View style={styles.formButton}>
                        {this.state.loading ? <Loading/> :
                        <Button
                            onPress={() => this.handleRegister()}
                            title="Register"
                            icon={
                                <Icon
                                    name='user-plus'
                                    type='font-awesome'
                                    size={24}
                                    color='white'
                                />
                            }
                            buttonStyle={{
                                backgroundColor: "#512DA8"
                            }}
                        />
                        }
                    </View>
                </View>
            </ScrollView>
            </KeyboardAvoidingView>
        );
    }
}

class LoginTab extends Component {

    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            remember: false,
            err:'',
            loading: false
        }
    }

    componentDidMount() {
        SecureStore.getItemAsync('userinfo')
            .then((userdata) => {
                let userinfo = JSON.parse(userdata);
                if (userinfo) {
                    this.setState({ email: userinfo.email });
                    this.setState({ password: userinfo.password });
                    this.setState({ remember: true })
                }
            })
    }

    static navigationOptions = {
        title: 'Login',
        tabBarIcon: ({ tintColor }) => (
            <Icon
                name='sign-in'
                type='font-awesome'
                size={24}
                iconStyle={{ color: tintColor }}
            />
        )
    };

    async handleLogin() {
        this.setState({loading:true})
        const {email, password} = this.state
        signin(email, password)
        .then(res => {
            currentUser()
            .then(user => {
                this.props.login(user)
            })
        }).catch(err =>{
            this.setState({loading:false})
            this.setState({err:err.message})
        })
        this.props.navigation.navigate('App')
        this.setState({loading:false})
        if (this.state.remember)
            SecureStore.setItemAsync('userinfo', JSON.stringify({ email: this.state.email, password: this.state.password }))
                .catch((err) => showToastWithGravity(err.message));
        else
            SecureStore.deleteItemAsync('userinfo')
                .catch((err) => showToastWithGravity(err.message));
    }

    render() {
        return (
            <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding': 'height'}>
            <View style={styles.container}>
                {this.state.err !== ''?<Text style={{color:'red'}}>{this.state.err}</Text>:null}
                <Input
                    placeholder="email"
                    leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                    onChangeText={(email) => this.setState({ email })}
                    value={this.state.email}
                    containerStyle={styles.formInput}
                />
                <Input
                    placeholder="Password"
                    leftIcon={{ type: 'font-awesome', name: 'key' }}
                    onChangeText={(password) => this.setState({ password })}
                    value={this.state.password}
                    containerStyle={styles.formInput}
                />
                <CheckBox title="Remember Me"
                    center
                    checked={this.state.remember}
                    onPress={() => this.setState({ remember: !this.state.remember })}
                    containerStyle={styles.formCheckbox}
                />
                <View style={styles.formButton}>
                {this.state.loading ? <Loading/> :
                    <Button
                        onPress={() => this.handleLogin()}
                        title="Login"
                        icon={
                            <Icon
                                name='sign-in'
                                type='font-awesome'
                                size={24}
                                color='white'
                            />
                        }
                        buttonStyle={{
                            backgroundColor: "#512DA8"
                        }}
                    />
                    }
                </View>
                <View style={styles.formButton}>
                    <Button
                        onPress={() => this.props.navigation.navigate('Register')}
                        title="Register"
                        clear
                        icon={
                            <Icon
                                name='user-plus'
                                type='font-awesome'
                                size={24}
                                color='blue'
                            />
                        }
                        titleStyle={{
                            color: "blue"
                        }}
                    />
                </View>
            </View>
            </KeyboardAvoidingView>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        margin: 20,
    },
    imageContainer: {
        flex: 1,
        flexDirection: 'row',
        margin: 20
    },
    image: {
        margin: 10,
        width: 80,
        height: 60
    },
    formInput: {
        margin: 20
    },
    formCheckbox: {
        margin: 20,
        backgroundColor: null
    },
    formButton: {
        margin: 60
    }
});

const mapSTateToProps = store =>({
    user: store.user
})

const mapDispatchToProps = dispatch => ({
	login: (user) => dispatch(login(user)),
})

export default connect(mapSTateToProps, mapDispatchToProps)(LoginTab);