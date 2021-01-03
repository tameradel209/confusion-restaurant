import React, { Component } from 'react';
import { FlatList, View, Text, Alert, ToastAndroid } from 'react-native';
import { ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import { Loading } from './LoadingComponent';
import {deleteFavorite} from '../Redux/ActionCreators'
import Swipeout from 'react-native-swipeout';
import * as Animatable from 'react-native-animatable';

class Favorites extends Component{
    
    static navigationOptions = {
        title: 'My Favorites'
    }

    renderMenuItem = ({ item, index }) => {
        const rightButton = [{
            text: 'DELETE',
            type: 'delete',
            onPress: ()=>{
                Alert.alert(
                    'Delete The Dish', 
                    'do you want to delete '+item.name+'dish ?',
                    [
                        {
                            text:'cancel',
                            onPress:() => ToastAndroid.showWithGravity('cancel deletion', ToastAndroid.SHORT, ToastAndroid.BOTTOM),
                            style:' cancel',
                        },
                        {
                            text:'ok',
                            onPress: () => this.props.deleteFavorite(item.id)
                        }
                    ]
                    )
                }
        }]
        return(
            <Animatable.View animation="fadeInRightBig" duration={2000}>
                <Swipeout right={rightButton} autoClose={true}>
                    <ListItem
                        key={index}
                        title={item.name}
                        subtitle={item.description}
                        onPress={() => this.props.navigation.navigate('Dishdetail', { dishId: item.id })}
                        leftAvatar={{ source: require('./images/vadonut.png') }}
                    />
                </Swipeout>
            </Animatable.View>
        )
    }

    render(){
        if(this.props.dishes.isLoading){
            return(<Loading />)
        }

        else if(this.props.dishes.errMess){
            return(
                <View>
                    <Text>{this.props.dishes.errMess}</Text>
                </View>
            )
        }

        return(
            <FlatList
                data={this.props.dishes.dishes.filter(dish => this.props.favorites.some( el => el===dish.id ) )}
                renderItem={this.renderMenuItem}
                keyExtractor={item => item.id.toString()}
                />
        )
    }
}

const mapStateToProps = state => ({
    dishes: state.dishes,
    favorites: state.favorites
})

const mapDispatchToProps = dispatch => ({
    deleteFavorite: (dishId) => dispatch(deleteFavorite(dishId))
})

export default connect(mapStateToProps, mapDispatchToProps)(Favorites);