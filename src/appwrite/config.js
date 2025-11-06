import conf from '../conf/conf.js';
import { Client, Databases, Storage, ID, Query, Permission, Role } from "appwrite";

export class StorageService {
    client = new Client();
    databases;
    storage;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);

        this.databases = new Databases(this.client);
        this.storage = new Storage(this.client);
    }

    // async upsertPost(slug, { Title, Content, Image, Status, UserID }) {
    //     try {
    //         return await this.databases.upsertDocument(
    //             conf.appwriteDatabaseId,
    //             conf.appwriteCollectionId,
    //             slug,
    //             {
    //                 Title,
    //                 Content,
    //                 Image,
    //                 Status,
    //                 UserID
    //             }
    //         );
    //     } catch (error) {
    //         console.error("Appwrite Service :: createPost :: error", error);
    //     }

    // }

    // async upsertPost(slug, { Title, Content, Image, Status, UserID }) {
    //     try {
    //         let response;
    //         if (slug) {
    //             // update
    //             response = await this.databases.updateDocument(
    //                 conf.appwriteDatabaseId,
    //                 conf.appwriteCollectionId,
    //                 slug,
    //                 { Title, Content, Image, Status, UserID }
    //             );
    //         } else {
    //             // create
    //             response = await this.databases.createDocument(
    //                 conf.appwriteDatabaseId,
    //                 conf.appwriteCollectionId,
    //                 ID.unique(),
    //                 { Title, Content, Image, Status, UserID }
    //             );
    //         }
    //         console.log("Appwrite response:", response); // 👈 debug here
    //         return response;
    //     } catch (error) {
    //         console.error("Appwrite Service :: upsertPost :: error", error);
    //         return null; // important: return null if error
    //     }
    // }

    async createPost({ Title, slug, Content, Image, Status, UserID, AuthorName }) {
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    Title,
                    Content,
                    Image,
                    Status,
                    UserID,
                    AuthorName,
                }
            )
        } catch (error) {
            console.log("Appwrite serive :: createPost :: error", error);
        }
    }

    async updatePost(slug, { Title, Content, Image, Status }) {
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    Title,
                    Content,
                    Image,
                    Status,

                }
            )
        } catch (error) {
            console.log("Appwrite serive :: updatePost :: error", error);
        }
    }

    async deletePost(slug) {
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            );
            return true
        } catch (error) {
            console.error("Appwrite Service :: deletePost :: error", error);
            return false;
        }
    }

    async getPost(slug) {
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            );
        } catch (error) {
            console.error("Appwrite Service :: getPost :: error", error);
            return false;
        }
    }

    async listPosts(queries = [Query.equal('Status', 'active')]) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                queries,
            );
        } catch (error) {
            console.error("Appwrite Service :: listPosts :: error", error);
            return false;
        }
    }

    //file upload and management methods can be added here
    async uploadFile(file, UserID) {
        try {
            return await this.storage.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file,
                [
                    Permission.read(Role.any()),     // 👈 anyone can view
                    Permission.write(Role.any()), //For Temperory any but for production it must be only owner can edit/delete
                ]
            );
        } catch (error) {
            console.error("Appwrite Service :: uploadFile :: error", error);
        }
    }

    async deleteFile(fileId) {
        try {
            await this.storage.deleteFile(conf.appwriteBucketId, fileId);
            return true;
        } catch (error) {
            console.error("Appwrite Service :: deleteFile :: error", error);
            return false;
        }
    }

    getFilePreview(fileId) {
        if (!fileId) return "";
        if (typeof fileId === 'string' && /^https?:\/\//i.test(fileId)) {
            return fileId;
        }
        return this.storage.getFileView(conf.appwriteBucketId, fileId);
    }

    // async listFiles() {
    //     try {
    //         return await this.storage.listFiles(conf.appwriteBucketId);
    //     } catch (error) {
    //         console.error("Appwrite Service :: listFiles :: error", error);
    //     }
    // }
}

const Service = new StorageService()
export default Service