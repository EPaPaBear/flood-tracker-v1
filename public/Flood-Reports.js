const firebaseConfig = {
    apiKey: "AIzaSyAv7mgwqdXjp0PuShQQbCw3zq7Fm486JCE",
    authDomain: "flood-tracker-cd993.firebaseapp.com",
    projectId: "flood-tracker-cd993",
    storageBucket: "flood-tracker-cd993.appspot.com",
    messagingSenderId: "84609017509",
    appId: "1:84609017509:web:48e043a5091d9221960f4c",
    measurementId: "G-XFXMH5J7P0"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();

// Firestore part
const db = firebase.firestore();
const floodreports = document.getElementById('floodreports');

let reportsRef;
let unsubscribe;
let timestamp_utc;

auth.onAuthStateChanged(user => {
    if(user){
        reportsRef = db.collection('flood-reports')

        unsubscribe = reportsRef
            .onSnapshot(querySnapShot => {
                const items = querySnapShot.docs.map(doc => {
                    timestamp_utc = doc.data().timestamp.toDate().toDateString();

                    return `<div class="u-container-style u-expanded-width-sm u-expanded-width-xs u-grey-5 u-group u-radius-30 u-shape-round u-group-1">
                                <div class="u-container-layout u-container-layout-1">
                                    <img class="u-image u-image-circle u-image-1" src="images/8964791c00a522042953f4ee1409a38c59c9730ec7d02edd3dee05dacd95240951c9a0ac6446f406b8cdc6968ebb33b7ddb27be3d6330af8c6c4d9_1280.png" alt="" data-image-width="1280" data-image-height="1280">
                                    <h5 class="u-text u-text-default u-text-1">${doc.data().name}</h5>
                                    <p class="u-small-text u-text u-text-default u-text-variant u-text-2">${timestamp_utc}</p>
                                    <p class="u-align-center-xs u-text u-text-3">
                                        ${doc.data().report}
                                    </p>
                                </div>
                            </div>`
                });
                floodreports.innerHTML = items.join('');
            });
    }
    else{
        unsubscribe && unsubscribe();
    }
});