// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//     apiKey: "AIzaSyAv7mgwqdXjp0PuShQQbCw3zq7Fm486JCE",
//     authDomain: "flood-tracker-cd993.firebaseapp.com",
//     projectId: "flood-tracker-cd993",
//     storageBucket: "flood-tracker-cd993.appspot.com",
//     messagingSenderId: "84609017509",
//     appId: "1:84609017509:web:48e043a5091d9221960f4c",
//     measurementId: "G-XFXMH5J7P0"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// //const analytics = getAnalytics(app);

// const auth = auth();

const signInBtn = document.getElementById('signInBtn');
const signOutBtn = document.getElementById('signoutBtn');

const provider = new auth.GoogleAuthProvider();

signInBtn.onclick = () => auth.signInWithPopup(provider);
//signOutBtn.onclick = () => auth.signOut();

auth.onAuthStateChanged(user => {
    if(user){
        // signed in
        location.replace("Weather.html")
    }
    /*else{
        // not signed in
        //location.replace("index.html")
    }*/
});