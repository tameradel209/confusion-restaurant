import React , { Component } from 'react';
import Combination from './AboutComponent';
import Contact from './ContactComponent';
import Home from './HomeComponent';
import Menu from './MenuComponent';
import Dishdetail from './DishdetailComponent';
import { View, Platform, Image, StyleSheet, ScrollView, Text, ToastAndroid } from 'react-native';
import { createStackNavigator, createDrawerNavigator, createBottomTabNavigator, DrawerItems, SafeAreaView, createSwitchNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import { fetchDishes, fetchComments, fetchPromos, fetchLeaders, userstate } from '../Redux/ActionCreators';
import Reservation from './ReservationComponent'
import Favorites from './FavoriteComponent'
import LoginTab, {RegisterTab} from './LoginComponent'
import Logout from './LogoutComponent'
import ImagePick, {ImageView} from './imagePickComponent'
import SaveImage from './saveImageComponent'
import firebase from 'firebase'
//import NetInfo from '@react-native-community/netinfo'
//import * as NetInfo from 'react-native-netinfo'


class Main extends Component{

	Login = createBottomTabNavigator({
		Login: LoginTab,
		Register: RegisterTab
	}, {
		tabBarOptions: {
			activeBackgroundColor: '#9575CD',
			inactiveBackgroundColor: '#D1C4E9',
			activeTintColor: '#ffffff',
			inactiveTintColor: 'gray'
		}
	})

	LoginNavigator = createStackNavigator({
		Login: this.Login}, {
			navigationOptions: ({ navigation }) => ({
				headerStyle:{backgroundColor:'#512DA8'},
				headerTitleStyle:{color: '#fff'},
				headerTinitColor: '#fff',
				headerLeft: <Icon
					name='menu'
					size={24}
					color='white'
					onPress={() => navigation.toggleDrawer()} />
			})
	})

	FavoriteNavigator = createStackNavigator({
		Favorites: {
			screen: Favorites,
			navigationOptions: ({ navigation }) => ({
				headerLeft: <Icon
					name='menu'
					size={24}
					color='white'
					onPress={() => navigation.toggleDrawer()} />
			})
		},
		Dishdetail: { screen: Dishdetail }
	}, {
		initialRooteName: 'Favorites',
		navigationOptions: {
			headerStyle: { backgroundColor: '#512DA8' }
		},
		headerTinitColor: '#fff',
		headerTitleStyle: { color: '#fff' }
	});
	
	ReservatioNavigator = createStackNavigator({
		Reservation :{screen: Reservation}
	},{
		navigationOptions: ({navigation}) =>({
			headerStyle: {backgroundColor: '#512DA8'},
			headerTitleStyle:{color: '#fff'},
			headerTinitColor: '#fff',
			headerLeft: <Icon 
							name={'menu'}
							size={24}
							iconStyle={{color: 'white'}}
							onPress={() => navigation.toggleDrawer()}
							/>
		})
	})
	
	MenuNavigator = createStackNavigator({
		Menu: {screen: Menu,
			navigationOptions:({navigation})=>({
				headerLeft: <Icon 
						name='menu' 
						size={24}
						color = 'white'
						onPress={() => navigation.toggleDrawer()} />
			})
		},
		Dishdetail: {screen: Dishdetail}
	},{
		initialRooteName: 'Menu',
		navigationOptions: {
			headerStyle: {backgroundColor: '#512DA8'}
		},
		headerTinitColor: '#fff',
		headerTitleStyle: {color: '#fff'}
	});
	
	HomeNavigator = createStackNavigator({
		Home: {screen: Home},
	},{
		navigationOptions: ({navigation})=>({
			headerStyle: {backgroundColor: '#512DA8'},
			headerLeft: <Icon 
				name='menu' size={24}
				color = 'white'
				onPress={() => navigation.toggleDrawer()} />
		}),
		headerTinitColor: '#fff',
		headerTitleStyle: {color: '#fff'}
	});
	
	ContactNavigator = createStackNavigator({
		Contact: {screen: Contact},
	},{
		navigationOptions: ({navigation})=>({
			headerStyle: {backgroundColor: '#512DA8'},
			headerTitle: 'Contact Us',
			headerLeft: <Icon 
				name='menu' size={24}
				color = 'white'
				onPress={() => navigation.toggleDrawer()} />
		}),
		headerTinitColor: '#fff',
		headerTitleStyle: {color: '#fff'}
	});
	
	LeaderNavigator = createStackNavigator({
		Combination: {screen: Combination},
	},{
		navigationOptions: ({navigation})=>({
			headerStyle: {backgroundColor: '#512DA8'},
			headerTitle: 'About Us',
			headerLeft: <Icon 
				name='menu' size={24}
				color = 'white'
				onPress={() => navigation.toggleDrawer()} />
		}),
		headerTinitColor: '#fff',
		headerTitleStyle: {color: '#fff'}
	});

	ImageNavigator = createStackNavigator({
		Image: {screen: ImagePick},
		ImageView: {screen: ImageView},
	},{
		navigationOptions: ({navigation})=>({
			headerStyle: {backgroundColor: '#512DA8'},
			headerTitle: 'photo'
		}),
		headerTinitColor: '#fff',
		headerTitleStyle: {color: '#fff'}
	});
	
	CustomDrawerContentComponent =(props)=>(
		<ScrollView>
			<SafeAreaView style={{flex:1}} 
				forceInset={{ top:'always', horizontal:'never' }}>
				<View style={styles.drawerHeader}>
					<View style={{flex:1}}>
						<Image source={require('./images/logo.png')}
							style={styles.drawerImage} />
					</View>
					<View style={{flex:2}}>
						<Text style={styles.drawerHeaderText}>
							Ristorant con Confusion
						</Text>
					</View>
				</View>
				<DrawerItems {...props} />
			</SafeAreaView>
		</ScrollView>
		)

	MainNavigator = createDrawerNavigator({

		Profile:{
			screen: Logout,
			navigationOptions:{
				title: 'profile',
				drawerLable: 'Your Profile',
				drawerIcon: ({tintColor, focused}) =>(
					<Icon 
						name={'user'}
						type={'font-awesome'}
						size={24}
						iconStyle={{color: tintColor}}
						/>
				)
			}
		},
		Home: {screen: this.HomeNavigator,
			navigationOptions:{
				title: 'Home',
				drawerLable: 'Home',
				drawerIcon : ({tintColor}) => (
					<Icon
						name='home'
						type='font-awesome'
						size={24}
						color={tintColor}
						/>
					)
			}
		},
	
		Combination: {screen: this.LeaderNavigator,
			navigationOptions:{
				title: 'About Us',
				drawerLable: 'About Us',
				drawerIcon : ({tintColor}) => (
					<Icon
						name='info-circle'
						type='font-awesome'
						size={24}
						color={tintColor}
						/>
					)
			}
		},
	
		Menu: {screen: this.MenuNavigator,
			navigationOptions:{
				title: 'Menu',
				drawerLable: 'Menu',
				drawerIcon : ({tintColor}) => (
					<Icon
						name='list'
						type='font-awesome'
						size={24}
						color={tintColor}
						/>
					)
			}
		},
	
		Favorites: {
			screen: this.FavoriteNavigator,
			navigationOptions: {
				title: 'My Favorites',
				drawerLable: 'My Favorites',
				drawerIcon: ({ tintColor }) => (
					<Icon
						name='heart'
						type='font-awesome'
						size={24}
						color={tintColor}
					/>
				)
			}
		},
	
		Contact: {screen: this.ContactNavigator,
			navigationOptions:{
				title: 'Contact Us',
				drawerLable: 'Contact Us',
				drawerIcon : ({tintColor}) => (
					<Icon
						name='address-card'
						type='font-awesome'
						size={24}
						color={tintColor}
						/>
					)
			}
		},
		Reservation:{
			screen: this.ReservatioNavigator,
			navigationOptions:{
				title: 'reserve table',
				drawerLable: 'Reserve Table',
				drawerIcon: ({tintColor, focused}) =>(
					<Icon 
						name={'cutlery'}
						type={'font-awesome'}
						size={24}
						iconStyle={{color: tintColor}}
						/>
				)
			}
		}
	},{
		initialRouteName: 'Home',
		drawerBackgroundColor: '#D1C4E9',
		drawerPosition: 'left',
		contentComponent: this.CustomDrawerContentComponent
	})
	
	AuthNavigator = createDrawerNavigator({
	
		Login: {
			screen: this.LoginNavigator ,
			navigationOptions: {
				title:this.user ? 'Logout':'login',
				drawerLable:this.user ? 'Logout':'Login',
				drawerIcon: ({ tintColor, focused }) => (
					<Icon
						name='sign-in'
						type='font-awesome'
						size={24}
						iconStyle={{color: tintColor}}
					/>
				)
			}
		},
	
		Home: {screen: this.HomeNavigator,
			navigationOptions:{
				title: 'Home',
				drawerLable: 'Home',
				drawerIcon : ({tintColor}) => (
					<Icon
						name='home'
						type='font-awesome'
						size={24}
						color={tintColor}
						/>
					)
			}
		},
	
		Combination: {screen: this.LeaderNavigator,
			navigationOptions:{
				title: 'About Us',
				drawerLable: 'About Us',
				drawerIcon : ({tintColor}) => (
					<Icon
						name='info-circle'
						type='font-awesome'
						size={24}
						color={tintColor}
						/>
					)
			}
		},
	
		Menu: {screen: this.MenuNavigator,
			navigationOptions:{
				title: 'Menu',
				drawerLable: 'Menu',
				drawerIcon : ({tintColor}) => (
					<Icon
						name='list'
						type='font-awesome'
						size={24}
						color={tintColor}
						/>
					)
			}
		},
	
		Contact: {screen: this.ContactNavigator,
			navigationOptions:{
				title: 'Contact Us',
				drawerLable: 'Contact Us',
				drawerIcon : ({tintColor}) => (
					<Icon
						name='address-card'
						type='font-awesome'
						size={24}
						color={tintColor}
						/>
					)
			}
		}
	},{
		initialRouteName: 'Home',
		drawerBackgroundColor: '#D1C4E9',
		drawerPosition: 'left',
		contentComponent: this.CustomDrawerContentComponent
	})

	SwitchNavigator = createSwitchNavigator({
		App: this.MainNavigator,
		Auth: this.AuthNavigator,
		admin: this.ImageNavigator,
		save: SaveImage
	}, {
		initialRouteName: this.props.user.user ? 'App':'Auth'
	})

	componentDidMount() {
		this.props.fetchDishes();
		this.props.fetchPromos();
		this.props.fetchLeaders();

		//NetInfo.getConnectionInfo().then(connectionInfo => ToastAndroid.show('initial network connectivity type: '+ connectionInfo.type + ', effective type: ' + connectionInfo.effectiveType + ToastAndroid.LONG))
		//NetInfo.addEventListener('connectionChange', this.handleConnection)
	}
	/*
	componentWillUnmount(){
		NetInfo.removeEventListener('connectionChange', this.handleConnection)
	}
	*/

	handleConnection = (ConnectionInfo) => {
		switch (ConnectionInfo){
			case 'none':
				ToastAndroid('you are offline', ToastAndroid.LONG)
				break
			case 'wifi':
				ToastAndroid('you are connected to wifi', ToastAndroid.LONG)
				break
			case 'cellular':
				ToastAndroid('you are connected to a cellular', ToastAndroid.LONG)
				break
			case 'unknown':
				ToastAndroid('you are connected to unknown', ToastAndroid.LONG)
				break
			default:
				break
		}
	}

	render(){
		return(
			<View style={{flex: 1, paddingTop: Platform.OS === 'ios' ? 0 : Expo.Constants.statusBarHeight }}>
				<this.SwitchNavigator />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	drawerHeader:{
		backgroundColor: '#512DA8',
		height: 140,
		alignItems: 'center',
		justifyContent: 'center',
		flex: 1,
		flexDirection: 'row'
	},
	drawerHeaderText:{
		color: 'white',
		fontSize: 24,
		fontWeight: 'bold'
	},
	drawerImage:{
		margin: 10,
		width : 80,
		height: 60
	}
})

const mapStateToProps = state => ({
	dishes: state.dishes,
	comments: state.comments,
	promotions: state.promotions,
	leaders: state.leaders,
	user: state.user
})

const mapDispatchToProps = dispatch => ({
	fetchDishes: () => dispatch(fetchDishes()),
	fetchComments: () => dispatch(fetchComments()),
	fetchPromos: () => dispatch(fetchPromos()),
	fetchLeaders: () => dispatch(fetchLeaders()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Main);