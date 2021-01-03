import * as firebase from 'firebase'
require("firebase/firestore")
require("firebase/firebase-storage")

const firebaseConfig = {
    apiKey: "AIzaSyAgoG-19hXm1tqcqw1a3DJcMo_YGMMrWTw",
    authDomain: "confusion-20fec.firebaseapp.com",
    projectId: "confusion-20fec",
    storageBucket: "confusion-20fec.appspot.com",
    messagingSenderId: "964070907847",
    appId: "1:964070907847:web:48bd70fb88f7a83e3103e2",
    measurementId: "G-8HZW2C10NF"
  }
  
export const initializeFirebase = () => {
  if(firebase.apps.length === 0){
      firebase.initializeApp(firebaseConfig)    
  } 
}

export const signup = async (email, password, data) =>{
    try{
        firebase.auth().createUserWithEmailAndPassword(email, password)
        const user = await firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).set(data)
        return user
    }catch(err){return err}

}

export const signin = async (email, password) =>{
    try{
        const res = await firebase.auth().signInWithEmailAndPassword(email, password)
        return res
    }catch(err){return err}
}

export const signout = () => firebase.auth().signOut()

export const currentUser = async () =>{
    try{
        const res = await firebase.auth().onAuthStateChanged(() => null)
        if(res){
            const user = await firebase.firestore().collection('users').doc(res.uid).get()
            const data = user.data()
            return data
        }
    }catch(err){return err}
}

export const  comments = async (dishId) => {
    try{
        const res = await firebase.firestore().collection('dishes').doc(dishId).collection('comments').get()
        const commentDocs = res.docs
        const comments = commentDocs.map(commentDoc =>{
            const comment = commentDoc.data()
            const date = new Date(comment.date.seconds*1000).toISOString()
            comment.id = commentDoc.id
            comment.date = date
            return comment
        })
        return comments
    }catch(err){return err}
}

export const dishes = async() =>{
    try{
        const res = await firebase.firestore().collection('dishes').get()
        const dishDocs = res.docs
        const dishes = dishDocs.map(dishDoc => {
            const dish = dishDoc.data()
            dish.id = dishDoc.id
            return dish
        })
        return dishes
    }catch(err){return err}
}

export const promos = async() =>{
    try{
        const res = await firebase.firestore().collection('promotions').get()
        const promoDocs = res.docs
        const promos = promoDocs.map(promoDoc => {
            const promo = promoDoc.data()
            promo.id = promoDoc.id
            return promo
        })
        return promos
    }catch(err){return err}
}

export const leaders = async() =>{
    try{
        const res = await firebase.firestore().collection('leaders').get()
        const leaderDocs = res.docs
        const leaders = leaderDocs.map(leaderDoc => {
            const leader = leaderDoc.data()
            leader.id = leaderDoc.id
            return leader
        })
        return leaders
    }catch(err){return err}
}