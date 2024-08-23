import React, { useState } from "react";
import {
	View,
	TextInput,
	Button,
	Text,
	Alert,
	Image,
	StyleSheet,
	TouchableOpacity,
} from "react-native";
import { auth, db } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import img from "../assets/signup.jpg";
export default function LoginScreen({ navigation }) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);

	const handleLogin = async () => {
		if (!email || !password) {
			Alert.alert("Error", "Please enter both email and password");
			return;
		}

		setLoading(true);
		try {
			const userCredential = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);
			const user = userCredential.user;

			// Check if the user is a seller
			const userDoc = await getDoc(doc(db, "users", user.uid));
			if (userDoc.exists() && userDoc.data().role === "seller") {
				navigation.navigate("Seller");
			} else {
				navigation.navigate("Home");
			}
		} catch (error) {
			Alert.alert("Login Failed", error.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<View style={styles.container}>
			<Image
				source={img}
				style={styles.image}
			/>
			<View style={styles.card}>
				<Text style={styles.title}>Welcome Back</Text>
				<TextInput
					placeholder="Email"
					value={email}
					onChangeText={setEmail}
					autoCapitalize="none"
					keyboardType="email-address"
					style={styles.input}
					placeholderTextColor="#aaa"
				/>
				<TextInput
					placeholder="Password"
					value={password}
					onChangeText={setPassword}
					secureTextEntry
					style={styles.input}
					placeholderTextColor="#aaa"
				/>
				<TouchableOpacity
					style={styles.button}
					onPress={handleLogin}
					disabled={loading}
				>
					<Text style={styles.buttonText}>
						{loading ? "Logging in..." : "Login"}
					</Text>
				</TouchableOpacity>
				<View style={styles.signupContainer}>
					<Text style={styles.signupText}>Don't have an account?</Text>
					<TouchableOpacity onPress={() => navigation.navigate("Signup")}>
						<Text style={styles.signupLink}>Sign Up</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
		backgroundColor: "#e0e5ec",
	},
	image: {
		width: 150,
		height: 150,
		marginBottom: 30,
		borderRadius: 75,
	},
	card: {
		width: "100%",
		padding: 25,
		borderRadius: 20,
		backgroundColor: "rgba(255, 255, 255, 0.35)",
		borderColor: "rgba(255, 255, 255, 0.18)",
		borderWidth: 1,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 10 },
		shadowOpacity: 0.25,
		shadowRadius: 20,
		elevation: 5,
	},
	title: {
		fontSize: 28,
		fontWeight: "bold",
		color: "#333",
		textAlign: "center",
		marginBottom: 25,
	},
	input: {
		height: 50,
		borderWidth: 1,
		borderColor: "rgba(255, 255, 255, 0.4)",
		paddingHorizontal: 15,
		borderRadius: 10,
		marginBottom: 20,
		backgroundColor: "rgba(255, 255, 255, 0.2)",
		color: "#333",
		fontSize: 16,
	},
	button: {
		backgroundColor: "#4e9af1",
		paddingVertical: 15,
		borderRadius: 10,
		alignItems: "center",
		marginBottom: 15,
	},
	buttonText: {
		color: "#fff",
		fontSize: 18,
		fontWeight: "bold",
	},
	signupContainer: {
		flexDirection: "row",
		justifyContent: "center",
	},
	signupText: {
		color: "#333",
		fontSize: 16,
	},
	signupLink: {
		color: "#4e9af1",
		fontSize: 16,
		marginLeft: 5,
		fontWeight: "bold",
	},
});
