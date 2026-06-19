import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User,
  createUserWithEmailAndPassword
} from "firebase/auth";
import { auth } from "./config";

// Default admin credentials for out-of-the-box convenience
export const DEFAULT_ADMIN_EMAIL = "admin@drskydentistry.com";
export const DEFAULT_ADMIN_PASSWORD = "AdminPassword321!";

export const loginAdmin = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    // Self-healing: if the admin attempts to sign in with the default email and password,
    // and that user is not yet created in Free Auth, create it dynamically to bootstrap the app.
    if ((error.code === "auth/user-not-found" || error.code === "auth/invalid-credential") && email === DEFAULT_ADMIN_EMAIL) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return userCredential.user;
      } catch (createError) {
        console.error("Failed to self-seed admin account on failure:", createError);
        throw error;
      }
    }
    throw error;
  }
};

export const logoutAdmin = async (): Promise<void> => {
  await signOut(auth);
};

export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
