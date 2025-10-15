import conf from '../conf/conf.js'
import { Client, Account, ID } from "appwrite";

export class AuthService {
    client = new Client();
    account;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);

        this.account = new Account(this.client);
    }

    async createAccount({ email, password, name }) {
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name);
            if (userAccount) {
                // call login function to log in the user after account creation
                return await this.login({ email, password });
            }
            else {
                return userAccount;
            }
        }
        catch (error) {
            console.log("Apprite Service :: createAccount :: error", error);
        }
    }

    async login({ email, password }) {
        try {
            return await this.account.createEmailPasswordSession(email, password);
        }
        catch (error) {
            console.log("Apprite Service :: login :: error", error);
            throw error; // rethrow the error to handle it in the component
        }
    }

    async getCurrentUser() {
        try {
            return await this.account.get();
        }
        catch (error) {
            console.log("Apprite Service :: getCurrentUser :: error", error);
        }

        return null;
    }

    async logout() {
        try {
            return await this.account.deleteSession("current");
        } catch (error) {
            console.log("Apprite Service :: logout :: error", error);
        }
    }

}

const authService = new AuthService();
export default authService;