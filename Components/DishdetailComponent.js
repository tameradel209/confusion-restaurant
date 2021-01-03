import React, { Component } from 'react';
import { Text, View, ScrollView, FlatList, Modal, Button, Alert, PanResponder, Share, ToastAndroid } from 'react-native';
import { Card, Icon, Rating, AirbnbRating, Input } from 'react-native-elements';
import { connect } from 'react-redux';
import {postComment, postFavorite} from '../Redux/ActionCreators'
import * as Animatable from 'react-native-animatable';


function RenderDish(props){

	const dish = props.dish;

	handelViewRef = (ref) => this.view=ref

	const recognizeDragRtoL = ({moveX, moveY, dx, dy}) => {
		if(dx < -200){
			return true
		}
		return false
	}

	const recognizeDragLtoR = ({ moveX, moveY, dx, dy }) => {
		if(dx > 200){
			return true
		}
		return false
	}

	const panResponder = PanResponder.create({
		onStartShouldSetPanResponder: (e, gestureState) => {return true},
		onPanResponderGrant: () => this.view.rubberBand(1000).then(endState => ToastAndroid.showWithGravity(endState.finished ? 'finished' : 'cancel gesture', ToastAndroid.SHORT, ToastAndroid.BOTTOM)),
		onPanResponderEnd: (e, gestureState) => {
			if(recognizeDragRtoL(gestureState)){
				Alert.alert(
					'Add Favorite',
					'Are you sure you wish add' + dish.name + 'to favorites ?',
					[
						{
							text: 'cancel',
						},
						{
							text:'ok',
							onPress: () => props.favorite ? ToastAndroid.showWithGravity('already favorite', ToastAndroid.SHORT, ToastAndroid.BOTTOM) : props.onPress()
						}
					],
					{cancelable: false}
				)
			}
			else if (recognizeDragLtoR(gestureState)){
				props.onPressComment()
			}
			return true
		}
	})

	const shareDish = (title, message, url) => {
		Share.share({
			title: title,
			message: title + ': ' + message + ' ' + url,
			url: url
		}, {
			dialogTitle: 'Share ' + title,
			subject: title
		})
	}

	if(dish != null){
		return(
			<Animatable.View animation={'fadeInDown'} duration={2000} delay={1000} ref={this.handelViewRef} {...panResponder.panHandlers}>
				<Card
				featuredTitle={dish.name}
				image={require('./images/buffet.png')}>
				<Text style={{margin:10}}>
					{dish.description}
				</Text>
					<View style={{flex:1,flexDirection:'row'}}>
						<Icon
							raised
							reverse
							name={ props.favorite ? 'heart' : 'heart-o' }
							type='font-awesome'
							color='#f50'
							onPress={() => props.favorite ? ToastAndroid.showWithGravity('already favorite', ToastAndroid.SHORT, ToastAndroid.BOTTOM) : props.onPress()}
							/>
							<Icon
								raised
								reverse
								name={'pencil'}
								type='font-awesome'
								color='#f50'
								onPress={() => props.onPressComment()}
							/>
						<Icon
							raised
							reverse
							name='share'
							type='font-awesome'
							color='#51D2A8'
							onPress={() => shareDish(dish.name, dish.description, 'http://facebook.com')} />
					</View>
				</Card>
			</Animatable.View>
			);
	}
	else {
		return(<View></View>);
	}
}

function RenderComments(props){
	const comments = props.comments;

	const renderCommentItem = ({ item, index })=> {
		return(
			<View key={index} style={{margin: 10}}>
				<Text style={{fontSize: 14}}>{item.comment}</Text>
				<View style={{flex:1,flexDirection:'row'}}>
					<AirbnbRating count={5} showRating={false} defaultRating={item.rating} size={10} />
					<Text style={{ fontSize: 12 }}>{item.rating} stars</Text>
				</View>
				<Text style={{fontSize: 12}}>{'-- ' + item.author + ', ' + item.date}</Text>
			</View>
		)
	}

	return(
		<Animatable.View animation={'fadeInUp'} duration={2000} delay={1000} >
			<Card title='comments' >
				<FlatList
					data={comments}
					renderItem={renderCommentItem}
					keyExtractor={item => item.id.toString()} 
					/>
			</Card>
		</Animatable.View>
	)
}

class Dishdetail extends Component {

	constructor(props){
		super(props);
		this.state = {
			showModal: false,
			rating: 3,
			comment:'',
			author: '',
			disabledComment: true,
		}
	}

	markFavorites(dishId){
		this.props.postFavorite(dishId)
	}

	static navigationOptions ={
		title: 'Dishdetail'
	}

	onComment = () => this.setState({showModal: true})

	ratingCompleted = (rating) => {
		this.setState({rating})
	}

	handelNewComment = (dishId) => {
		this.props.postComment(dishId, this.state.rating, this.state.comment, this.state.author)
		this.setState({showModal:false})
	}

	componentDidUpdate(prevProps, prevState){
		if (this.state.author !== prevState.author || this.state.comment !== prevState.comment){
			this.validComment()
		}	
	}

	validComment =() =>{
		if (this.state.author !== '' && this.state.comment !== ''){
			this.setState({ disabledComment: false })
		}else{
			this.setState({ disabledComment: true })
		}
	}

	render(){
		const dishId = this.props.navigation.getParam('dishId','')
		return(
			<ScrollView>
				<RenderDish dish={dishId}
					favorite={this.props.favorites.some(el => el===dishId.id)}
					onPress={() => this.markFavorites(dishId.id)}
					onPressComment={() => this.onComment()}
					/>
				<RenderComments 
					comments={this.props.comments.comments}
					/>
				<Modal
					animationType={"slide"}
					transparent={false}
					visible={this.state.showModal}
					onDismiss={this.toggleModal}
					onRequestClose={this.toggleModal}>
					<Rating
						showRating
						onFinishRating={this.ratingCompleted}
						style={{ paddingVertical: 10 }}
					/>
					<Input
						placeholder={'type the auther'}
						onChangeText={value => this.setState({ author: value })}
						leftIcon={<Icon name='user-o' type='font-awesome' />}
					/>
					<Input 
						placeholder={'type a comment'}
						onChangeText={value => this.setState({comment:value})}
						leftIcon={<Icon name='comment-o' type='font-awesome' />}
						/>
					<Button title={'Rate'} disabled={this.state.disabledComment} onPress={() => this.handelNewComment(dishId.id)} />
					<Button title={'cancel'} onPress={() => this.setState({showModal: false})} />
				</Modal>
			</ScrollView>
			)
	}
}

const mapStateToProps = state => ({
	dishes: state.dishes,
	comments: state.comments,
	favorites: state.favorites,
})

const mapDispatchToProps = dispatch => ({
	postComment: (dishId, rating, comment, auther) => dispatch(postComment(dishId, rating, comment, auther)),
	postFavorite: (favorite) => dispatch(postFavorite(favorite)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);