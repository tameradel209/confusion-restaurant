import React, { Component } from 'react';
import { FlatList, View } from 'react-native';
import { Tile } from 'react-native-elements';
import {connect} from 'react-redux'
import { Loading } from './LoadingComponent';
import * as Animatable from 'react-native-animatable';
import {fetchComments} from '../Redux/ActionCreators'

class Menu extends Component{

	handleNavigation = async (item) => {
			const res = await this.props.fetchComments(item.id)
			this.props.navigation.navigate('Dishdetail', { dishId: item })
	}
	renderMenuItem = ({ item, index }) => {
		return (
			<Animatable.View animation="fadeInRightBig" duration={2000}>
				<Tile
					key={index}
					title={item.name}
					caption={item.description}
					featured
					onPress={() => this.handleNavigation(item)}
					imageSrc={{uri:item.image}}
				/>
			</Animatable.View>
		);
	}

	static navigationOptions ={
		title: 'Menu'
	};

	render(){
		if(this.props.dishes.isLoading){
			return(<Loading />)
		}
		else if(this.props.dishes.errMess){
			return(<View><Text>{this.props.dishes}</Text></View>)
		}
		return(
			<FlatList
				data={this.props.dishes.dishes}
				renderItem={this.renderMenuItem}
				keyExtractor={item => item.id.toString()}
				/>
		);
	}
}

const mapStateToProps = state => ({
	dishes: state.dishes
})

const mapDispatchToProps = dispatch =>({
	fetchComments: (dishId) => dispatch(fetchComments(dishId))
})

export default connect(mapStateToProps, mapDispatchToProps)(Menu);