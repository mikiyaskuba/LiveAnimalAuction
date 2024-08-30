// import React, { useState } from "react";
// import {
// 	View,
// 	TextInput,
// 	Button,
// 	Text,
// 	Image,
// 	Alert,
// 	StyleSheet,
// 	ScrollView,
// } from "react-native";
// import { storage, db, auth } from "../firebaseConfig";
// import * as ImagePicker from "expo-image-picker";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { collection, addDoc } from "firebase/firestore";

// export default function SellerScreen({ navigation }) {
// 	const [cattleInfo, setCattleInfo] = useState({
// 		name: "",
// 		price: "",
// 		description: "",
// 	});
// 	const [imageUri, setImageUri] = useState(null);

// 	const currentUser = auth.currentUser;

// 	const pickImage = async () => {
// 		let result = await ImagePicker.launchImageLibraryAsync({
// 			mediaTypes: ImagePicker.MediaTypeOptions.Images,
// 			allowsEditing: true,
// 			aspect: [4, 3],
// 			quality: 1,
// 		});

// 		if (!result.canceled) {
// 			setImageUri(result.uri || result.assets[0].uri);
// 		}
// 	};

// 	const handleSubmit = async () => {
// 		if (!currentUser) {
// 			Alert.alert("Error", "You must be logged in to submit a post.");
// 			return;
// 		}

// 		try {
// 			if (imageUri) {
// 				const imageRef = ref(
// 					storage,
// 					`cattleImages/${new Date().toISOString()}`
// 				);
// 				const response = await fetch(imageUri);
// 				const blob = await response.blob();
// 				await uploadBytes(imageRef, blob);
// 				const imageUrl = await getDownloadURL(imageRef);

// 				const postDoc = await addDoc(collection(db, "cattle"), {
// 					...cattleInfo,
// 					sellerId: currentUser.uid,
// 					imageUrl,
// 					createdAt: new Date(),
// 				});

// 				const postId = postDoc.id;

// 				navigation.navigate("Message", {
// 					sellerId: currentUser.uid,
// 					postId: postId,
// 				});
// 			} else {
// 				Alert.alert("Error", "Please pick an image before submitting.");
// 			}
// 		} catch (error) {
// 			console.error("Error uploading file or saving data:", error);
// 			Alert.alert("Error", "An error occurred. Please try again.");
// 		}
// 	};

// 	return (
// 		<ScrollView contentContainerStyle={styles.container}>
// 			<Text style={styles.header}>Sell Your Cattle</Text>
// 			<TextInput
// 				style={styles.input}
// 				placeholder="Cattle Name"
// 				value={cattleInfo.name}
// 				onChangeText={(text) => setCattleInfo({ ...cattleInfo, name: text })}
// 			/>
// 			<TextInput
// 				style={styles.input}
// 				placeholder="Price"
// 				value={cattleInfo.price}
// 				onChangeText={(text) => setCattleInfo({ ...cattleInfo, price: text })}
// 				keyboardType="numeric"
// 			/>
// 			<TextInput
// 				style={[styles.input, styles.description]}
// 				placeholder="Description"
// 				value={cattleInfo.description}
// 				onChangeText={(text) =>
// 					setCattleInfo({ ...cattleInfo, description: text })
// 				}
// 				multiline
// 			/>
// 			<Button title="Pick Image" onPress={pickImage} color="#1e90ff" />
// 			{imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
// 			<Button title="Submit" onPress={handleSubmit} color="#1e90ff" />
// 			<Button
// 				title="Go to Home"
// 				onPress={() => navigation.navigate("Home")}
// 				color="#1e90ff"
// 			/>
// 		</ScrollView>
// 	);
// }

// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		padding: 16,
// 		backgroundColor: "#f5f5f5",
// 	},
// 	header: {
// 		fontSize: 24,
// 		fontWeight: "bold",
// 		marginBottom: 16,
// 		textAlign: "center",
// 	},
// 	input: {
// 		height: 40,
// 		borderColor: "#ddd",
// 		borderWidth: 1,
// 		borderRadius: 8,
// 		marginBottom: 12,
// 		paddingHorizontal: 8,
// 		backgroundColor: "#fff",
// 	},
// 	description: {
// 		height: 100,
// 	},
// 	image: {
// 		width: 200,
// 		height: 200,
// 		alignSelf: "center",
// 		marginVertical: 12,
// 		borderRadius: 8,
// 	},
// });
import React, { useState } from "react";
import {
	View,
	TextInput,
	Button,
	Text,
	Image,
	Alert,
	StyleSheet,
	ScrollView,
} from "react-native";
import { storage, db, auth } from "../firebaseConfig";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { Video } from "expo-av";

export default function SellerScreen({ navigation }) {
	const [cattleInfo, setCattleInfo] = useState({
		zoomLink: "",
		price: "",
		description: "",
	});
	const [imageUri, setImageUri] = useState(null);
	const [videoUri, setVideoUri] = useState(null);

	const currentUser = auth.currentUser;

	const pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			quality: 1,
		});

		if (!result.canceled) {
			setImageUri(result.uri || result.assets[0].uri);
		}
	};

	const pickVideo = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Videos,
			allowsEditing: true,
			quality: 1,
		});

		if (!result.canceled) {
			setVideoUri(result.uri || result.assets[0].uri);
		}
	};

	const handleSubmit = async () => {
		if (!currentUser) {
			Alert.alert("Error", "You must be logged in to submit a post.");
			return;
		}

		try {
			let imageUrl = null;
			let videoUrl = null;

			if (imageUri) {
				const imageRef = ref(
					storage,
					`cattleMedia/${new Date().toISOString()}_image`
				);
				const imageBlob = await fetch(imageUri).then((res) => res.blob());
				await uploadBytes(imageRef, imageBlob);
				imageUrl = await getDownloadURL(imageRef);
			}

			if (videoUri) {
				const videoRef = ref(
					storage,
					`cattleMedia/${new Date().toISOString()}_video`
				);
				const videoBlob = await fetch(videoUri).then((res) => res.blob());
				await uploadBytes(videoRef, videoBlob);
				videoUrl = await getDownloadURL(videoRef);
			}

			await addDoc(collection(db, "cattle"), {
				...cattleInfo,
				sellerId: currentUser.uid,
				imageUrl,
				videoUrl,
				createdAt: new Date(),
			});

			Alert.alert("Success", "Post uploaded successfully!");
			navigation.navigate("Home");
		} catch (error) {
			console.error("Error uploading file or saving data:", error);
			Alert.alert("Error", "An error occurred. Please try again.");
		}
	};

	return (
		<ScrollView contentContainerStyle={styles.scrollContainer}>
			<View style={styles.container}>
				<Text style={styles.header}>Post Your Cattle</Text>
				<TextInput
					style={styles.input}
					placeholder="Zoom Link for Live Slaughter"
					value={cattleInfo.zoomLink}
					onChangeText={(text) =>
						setCattleInfo({ ...cattleInfo, zoomLink: text })
					}
				/>
				<TextInput
					style={styles.input}
					placeholder="Price"
					value={cattleInfo.price}
					onChangeText={(text) => setCattleInfo({ ...cattleInfo, price: text })}
					keyboardType="numeric"
				/>
				<TextInput
					style={[styles.input, styles.description]}
					placeholder="Description"
					value={cattleInfo.description}
					onChangeText={(text) =>
						setCattleInfo({ ...cattleInfo, description: text })
					}
					multiline
				/>
				<Button title="Pick Image" onPress={pickImage} color="#1e90ff" />
				{imageUri && <Image source={{ uri: imageUri }} style={styles.media} />}
				<Button title="Pick Video" onPress={pickVideo} color="#1e90ff" />
				{videoUri && (
					<Video
						source={{ uri: videoUri }}
						style={styles.media}
						useNativeControls
						resizeMode="contain"
					/>
				)}
				<View style={styles.buttonContainer}>
					<Button title="Submit" onPress={handleSubmit} color="#1e90ff" />
					<Button
						title="Go to Home"
						onPress={() => navigation.navigate("Home")}
						color="#1e90ff"
					/>
				</View>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	scrollContainer: {
		flexGrow: 1,
		padding: 16,
		backgroundColor: "#f5f5f5",
	},
	container: {
		flex: 1,
	},
	header: {
		fontSize: 26,
		fontWeight: "bold",
		marginBottom: 20,
		textAlign: "center",
		color: "#333",
	},
	input: {
		height: 45,
		borderColor: "#ddd",
		borderWidth: 1,
		borderRadius: 10,
		marginBottom: 15,
		paddingHorizontal: 12,
		backgroundColor: "#fff",
		fontSize: 16,
	},
	description: {
		height: 120,
	},
	media: {
		width: "100%",
		height: 220,
		alignSelf: "center",
		marginVertical: 15,
		borderRadius: 10,
	},
	buttonContainer: {
		marginTop: 20,
	},
});



