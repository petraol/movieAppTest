movieApp.controller('createaccountCtrl', function ($scope,Movie,$cookies,$location,$window,Upload) {
	$scope.usernameerror = false;
	$scope.infoenter = false;
	$scope.image = null;

	$scope.create = function(username, realname, password, snack, image) {
		console.log("Username: " + username);
		console.log("Realname: " + realname);
		console.log("Password: " + password);
		console.log("Snack: " + snack);
		console.log("Image: " + image);

		if (username && realname && password && snack && image) {

		Movie.setCurrentUser(username);

		firebase.database().ref('/users/').on('value', function(snapshot) {
			snapshot.forEach(function(childSnapshot) {
				for (value in childSnapshot.W.path.o) {

					if (childSnapshot.W.path.o[value] == "users") {}
					else if (childSnapshot.W.path.o[value] == "undefined") {}
					else {
						Movie.allUsers += childSnapshot.W.path.o[value];
						}
					}
				});

				allUsers = Movie.allUsers;
				Movie.allUsers = "";

				if (allUsers.includes(username)) {
					console.log("Nu stötte den på ett namn som redan finns i databasen")
					$scope.usernameerror = true;
					$scope.infoenter = false;
					return;
				}

				else {

				try {
					
				if (image.size > 1024000) {
		        	window.alert("The profile picture you tried to upload is too big (MAX 1 MB)! Try again.");
		        	return;
		        }

		        else {
					var ref = firebase.storage().ref('images/').child(image.name);
					ref.put(image);
				}


				firebase.database().ref('users/' + username).set({
					realname: realname,
				  	password: password,
				  	snack: snack,
				  	profile_picture: image.name
				  	});

				console.log("Nu har användaren skapats och vi byter view");
				$window.location.assign('#!/welcome');

				}
				catch(err) {
					console.log("Fel under skapandet i databasen")
				}
			}
			});
		}
	else {
		$scope.infoenter = true;
		$scope.usernameerror = false;
		return;
	}
	}
});
