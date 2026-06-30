import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "./firebase";

const provider = new GoogleAuthProvider();
provider.addScope(
  "https://www.googleapis.com/auth/calendar.readonly"
);

provider.setCustomParameters({
  prompt: "select_account"
});

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const credential =
      GoogleAuthProvider.credentialFromResult(result);

    const token = credential.accessToken;

    return {
      user: result.user,
      accessToken: token
    };
  } catch (error) {
    console.log(error);
  }
};