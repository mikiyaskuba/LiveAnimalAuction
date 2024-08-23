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

export default function SellerScreen({ navigation }) {
	const [cattleInfo, setCattleInfo] = useState({
		name: "",
		price: "",
		description: "",
	});
	const [imageUri, setImageUri] = useState(null);

	const currentUser = auth.currentUser;

	const pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});

		if (!result.canceled) {
			setImageUri(result.uri || result.assets[0].uri);
		}
	};

	const handleSubmit = async () => {
		if (!currentUser) {
			Alert.alert("Error", "You must be logged in to submit a post.");
			return;
		}

		try {
			if (imageUri) {
				const imageRef = ref(
					storage,
					`cattleImages/${new Date().toISOString()}`
				);
				const response = await fetch(imageUri);
				const blob = await response.blob();
				await uploadBytes(imageRef, blob);
				const imageUrl = await getDownloadURL(imageRef);

				const postDoc = await addDoc(collection(db, "cattle"), {
					...cattleInfo,
					sellerId: currentUser.uid,
					imageUrl,
					createdAt: new Date(),
				});

				const postId = postDoc.id;

				navigation.navigate("Message", {
					sellerId: currentUser.uid,
					postId: postId,
				});
			} else {
				Alert.alert("Error", "Please pick an image before submitting.");
			}
		} catch (error) {
			console.error("Error uploading file or saving data:", error);
			Alert.alert("Error", "An error occurred. Please try again.");
		}
	};

	return (
		<ScrollView contentContainerStyle={styles.container}>
			<Text style={styles.header}>Sell Your Cattle</Text>
			<TextInput
				style={styles.input}
				placeholder="Cattle Name"
				value={cattleInfo.name}
				onChangeText={(text) => setCattleInfo({ ...cattleInfo, name: text })}
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
			{imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
			<Button title="Submit" onPress={handleSubmit} color="#1e90ff" />
			<Button
				title="Go to Home"
				onPress={() => navigation.navigate("Home")}
				color="#1e90ff"
			/>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		backgroundColor: "#f5f5f5",
	},
	header: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 16,
		textAlign: "center",
	},
	input: {
		height: 40,
		borderColor: "#ddd",
		borderWidth: 1,
		borderRadius: 8,
		marginBottom: 12,
		paddingHorizontal: 8,
		backgroundColor: "#fff",
	},
	description: {
		height: 100,
	},
	image: {
		width: 200,
		height: 200,
		alignSelf: "center",
		marginVertical: 12,
		borderRadius: 8,
	},
});
