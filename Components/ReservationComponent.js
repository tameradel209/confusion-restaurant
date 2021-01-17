import React, { Component } from 'react';
import { Text, View, ScrollView, StyleSheet, Picker, Switch, Button, Modal, Alert, ToastAndroid } from 'react-native';
import DatePicker from 'react-native-datepicker'
import * as Animatable from 'react-native-animatable'
import { Notifications } from 'expo'
import * as Permissions from 'expo-permissions'
import * as Calendar from 'expo-calendar'

class Reservation extends Component {

    constructor(props) {
        super(props);

        this.state = {
            guests: 1,
            smoking: false,
            date: '',
            showModal: false,
            btnDisable: true,
        }
    }

    static navigationOptions = {
        title: 'Reserve Table',
    };

    async obtainNotificationPermission() {
        let permission = await Permissions.getAsync(Permissions.USER_FACING_NOTIFICATIONS);
        if (permission.status !== 'granted') {
            permission = await Permissions.askAsync(Permissions.USER_FACING_NOTIFICATIONS);
            if (permission.status !== 'granted') {
                Alert.alert('Permission not granted to show notifications');
            }
        }
        return permission;
    }

    async presentLocalNotification(date) {
        await this.obtainNotificationPermission();
        Notifications.presentLocalNotificationAsync({
            title: 'Your Reservation',
            body: 'Reservation for ' + date + ' requested',
            ios: {
                sound: true
            },
            android: {
                sound: true,
                vibrate: true,
                color: '#512DA8'
            }
        });
    }

    obtainCalenderPermission = async () => {
        let permission = await Permissions.getAsync(Permissions.CALENDAR)

        if ( permission.status !== 'granted' ){
            permission = await Permissions.askAsync(Permissions.CALENDAR)
            if ( permission.status !== 'granted' ){
                Alert.alert("Permission not granted")
            }
        }
        return permission
    }

    getDefaultCalendarSource = async () => {
        const calendars = await Calendar.getCalendarsAsync()
        const defaultCalendars = calendars.filter(each => each.source.name === 'Default')
        return defaultCalendars[0].source
    }
    handleReservationToCalendar = async ( date ) => {
        await this.obtainCalenderPermission()

        const defaultCalendarSource = Platform.OS === 'ios' ?
            await this.getDefaultCalendarSource()
            : { isLocalAccount: true, name: 'Expo Calendar' };

        const tempDate = Date.parse(date)
        const startDate = new Date(tempDate)
        const endDate = new Date(tempDate + 2 * 60 * 60 * 1000)

        const calendarID = await Calendar.createCalendarAsync({
            title: 'Expo Calendar',
            color: 'blue',
            entityType: Calendar.EntityTypes.EVENT,
            sourceId: defaultCalendarSource.id,
            source: defaultCalendarSource,
            name: 'internalCalendarName',
            ownerAccount: 'personal',
            accessLevel: Calendar.CalendarAccessLevel.OWNER,
        })

        await Calendar.createEventAsync(calendarID, {
            title: 'Con Fusion Table Reservation',
            startDate: startDate,
            endDate: endDate,
            timeZone: 'Asia/Hong_Kong',
            location: '121, Clear Water Bay Road, Clear Water Bay, Kowloon, Hong Kong'
        })
    }

    toggleModal() {
        this.setState({ showModal: !this.state.showModal });
    }

    handleReservation() {
        Alert.alert(
            'Confirm reservation :',
            `number of geusts: ${this.state.guests}\nsmoking: ${this.state.smoking ? 'yes' : 'no'}\ndate: ${this.state.date}`,
            [
                {
                    text:'cancel',
                    onPress: () => ToastAndroid.showWithGravity('cancel reservation', ToastAndroid.SHORT, ToastAndroid.BOTTOM),
                    style:' cancel'
                },
                {
                    text:'ok',
                    onPress: () =>{
                        this.presentLocalNotification(this.state.guests)
                        this.handleReservationToCalendar( this.state.date )
                    }
                }
            ],
            {cancelable: false}
        )
        this.resetForm()
        //this.toggleModal();
    }

    resetForm() {
        this.setState({
            guests: 1,
            smoking: false,
            date: '',
            showModal: false,
            btnDisable: true
        });
    }
    
    componentDidUpdate(prevProps, prevState){
        if(this.state.date!==prevState.date){
            this.validForm()
        }
    }

    validForm = () =>{
        if(this.state.date!==''){
            this.setState({ btnDisable: false })
        }
    }

    render() {
        return (
            <ScrollView>
                <Animatable.View animation={'zoomIn'} duration={2000} delay={1000}>
                    <Modal 
                        animationType={"slide"} 
                        transparent={false}
                        visible={this.state.showModal}
                        onDismiss={this.toggleModal}
                        onRequestClose={this.toggleModal}>
                        <View style={styles.modal}>
                            <Text style={styles.modalTitle}>Your Reservation</Text>
                            <Text style={styles.modalText}>Number of Guests: {this.state.guests}</Text>
                            <Text style={styles.modalText}>Smoking?: {this.state.smoking ? 'Yes' : 'No'}</Text>
                            <Text style={styles.modalText}>Date and Time: {this.state.date}</Text>

                            <Button
                                onPress={() => { this.toggleModal(); this.resetForm(); }}
                                color="#512DA8"
                                title="Close"
                            />
                        </View>
                    </Modal>
                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}>Number of Guests</Text>
                        <Picker
                            style={styles.formItem}
                            selectedValue={this.state.guests}
                            onValueChange={(itemValue, itemIndex) => this.setState({ guests: itemValue })}>
                            <Picker.Item label="1" value="1" />
                            <Picker.Item label="2" value="2" />
                            <Picker.Item label="3" value="3" />
                            <Picker.Item label="4" value="4" />
                            <Picker.Item label="5" value="5" />
                            <Picker.Item label="6" value="6" />
                        </Picker>
                    </View>
                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}>Smoking/Non-Smoking?</Text>
                        <Switch
                            style={styles.formItem}
                            value={this.state.smoking}
                            trackColor={{ false: "#767577", true: "#81b0ff" }}
                            onValueChange={(value) => this.setState({ smoking: value })}>
                        </Switch>
                    </View>
                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}>Date and Time</Text>
                        <DatePicker
                            style={{ flex: 2, marginRight: 20 }}
                            date={this.state.date}
                            format=''
                            mode="datetime"
                            placeholder="select date and Time"
                            minDate="2017-01-01"
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            customStyles={{
                                dateIcon: {
                                    position: 'absolute',
                                    left: 0,
                                    top: 4,
                                    marginLeft: 0
                                },
                                dateInput: {
                                    marginLeft: 36
                                }
                                // ... You can check the source to find the other keys. 
                            }}
                            onDateChange={(date) => { this.setState({ date: date }) }}
                        />
                    </View>
                    <View style={styles.formRow}>
                        <Button
                            onPress={() => this.handleReservation()}
                            title="Reserve"
                            color="#512DA8"
                            accessibilityLabel="Learn more about this purple button"
                            disabled={this.state.btnDisable}
                        />
                    </View>
                </Animatable.View>
            </ScrollView>
        );
    }

};

const styles = StyleSheet.create({
    formRow: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 20
    },
    formLabel: {
        fontSize: 18,
        flex: 2
    },
    formItem: {
        flex: 1
    },
    modal: {
        justifyContent: 'center',
        margin: 20
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        backgroundColor: '#512DA8',
        textAlign: 'center',
        color: 'white',
        marginBottom: 20
    },
    modalText: {
        fontSize: 18,
        margin: 10
    }
});

export default Reservation;