
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBygGL8oXnY7NXMxCI1QUbysjDa3RB036o",
    authDomain: "chatapplication-6e455.firebaseapp.com",
    databaseURL: "https://chatapplication-6e455.firebaseio.com",
    projectId: "chatapplication-6e455",
    storageBucket: "chatapplication-6e455.appspot.com",
    messagingSenderId: "741706795981"
  };
  firebase.initializeApp(config);

    //var provider = new firebase.auth.GoogleAuthProvider();
    var provider = new firebase.auth.FacebookAuthProvider();

    var user = firebase.auth().currentUser;

        firebase.auth().signInWithPopup(provider).then(function (result) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            // ...
            console.log(result.user.email);
            document.getElementById("userName").innerText = user.displayName;
            firebase.database().ref('users').set({
                userName: result.user.email,
                name: user.displayName
            })
        }).catch(function (error) {
            console.log(error);
            // ...
        });


    function writeMessage() {
        if(document.getElementById("userName").innerText != "") {
            var userName = document.getElementById("userName").innerText;
            var userMessage = document.getElementById("userMessage").value;
            var currentTime = new Date;
            firebase.database().ref('messages/' + currentTime).set({
                userName: userName,
                userMessage: userMessage
            });
        }
    }

    var ref = firebase.database().ref('messages/');

    ref.on('value', function(snapshot) {
        var i =0;
        globalMessages = '';
        snapshot.forEach(function(msg) {
            var key = msg.key;
            var userNameSnapshot = msg.child("userName");
            var userMessageSnapshot = msg.child("userMessage");
            var userName = userNameSnapshot.val();
            var messageTime = new Date(key);
            var userMessage = userMessageSnapshot.val();
            var hours = messageTime.getHours();
            var mins = messageTime.getMinutes();
            var seconds = messageTime.getSeconds();
            if(hours< 10){
                var hours =  "0" + messageTime.getHours();
            }
            if(mins< 10){
                var mins=  "0" + messageTime.getHours();
            }
            if(seconds< 10){
                var seconds =  "0" + messageTime.getHours();
            }

            var mtime = hours + ":" + mins + ":" + seconds;
            console.log(userName + " - " + userMessage);
            if(i % 2) {
                globalMessages = '<li class="list-group-item list-group-item-primary text-dark"> <p>' + userName + " @ " + mtime + "</p>" + userMessage + '</li>' + globalMessages;
            }else{
                globalMessages = '<li class="list-group-item list-group-item-info text-dark text-right"> <p>' + userName + " @ " + mtime + "</p> " + userMessage + '</li>' + globalMessages;
            }
            i++;
        });

        document.getElementById('globalMessages').innerHTML = globalMessages;

    });