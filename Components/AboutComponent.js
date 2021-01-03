import React, { Component } from 'react';
import { Card } from 'react-native-elements';
import { ScrollView, Text, FlatList } from 'react-native';
import { ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import {Loading} from './LoadingComponent'
import * as Animatable from 'react-native-animatable'

function History() {
	return(
		<Card
			title = {'Our History'}
			>
			<Text>Started in 2010, Ristorante con Fusion quickly established itself as a culinary icon par excellence in Hong Kong. With its unique brand of world fusion cuisine that can be found nowhere else, it enjoys patronage from the A-list clientele in Hong Kong.  Featuring four of the best three-star Michelin chefs in the world, you never know what will arrive on your plate the next time you visit us.</Text>
			<Text></Text>
			<Text>The restaurant traces its humble beginnings to The Frying Pan, a successful chain started by our CEO, Mr. Peter Pan, that featured for the first time the world's best cuisines in a pan.</Text>
		</Card>
		);
}

class Leaders extends Component{

	render(){
	const renderLeaders = ({item, index}) => {
		return(
			<ListItem
				key={index}
				title={item.name}
				subtitle={item.description}
				hideChevron={true}
				leftAvatar={ {source: require('./images/alberto.png')}}
				/>
		);
	}

	return(
		<FlatList
			data={this.props.leaders}
			renderItem={renderLeaders}
			keyExtractor={item => item.id.toString()}
			/>
	);
	}
}

class Combination extends Component {

render(){
	if (this.props.leaders.isLoading) {
		return (
			<ScrollView>
				<Animatable.View animation={'fadeInDown'} duration={2000} delay={1000} >
					<History />
					<Card title={'Corporate Leadership'}>
						<Loading />
					</Card>
				</Animatable.View>
			</ScrollView>
		);
	}
	else if (this.props.leaders.errMess){
		return (
			<ScrollView>
				<Animatable.View animation={'fadeInDown'} duration={2000} delay={1000} >
					<History />
					<Card title={'Corporate Leadership'}>
						<Text>{this.props.leaders.errMess}</Text>
					</Card>
				</Animatable.View>
			</ScrollView>
		);
	}
	return(
		<ScrollView>
			<Animatable.View animation={'fadeInDown'} duration={2000} delay={1000} >
				<History />
				<Card title={'Corporate Leadership'}>
					<Leaders leaders={this.props.leaders.leaders} />
				</Card>
			</Animatable.View>
		</ScrollView>
	)
	}
}

const mapStateToProps = state => ({
	leaders: state.leaders
})

export default connect(mapStateToProps)(Combination);