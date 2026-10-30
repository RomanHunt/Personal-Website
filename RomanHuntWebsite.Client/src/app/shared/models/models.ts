/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

export interface AccountEmailReturn {
    responseMessage: string;
}


/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

export interface AccountEmailSubmit {
    email: string;
    forgotPassword: boolean;
    accountActivation: boolean;
}


/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

export interface ActivateAccountReturn {
    responseMessage: string;
}


/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

export interface ChangePasswordReturn {
    responseMessage: string;
}


/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

export interface ChangePasswordSubmit {
    token: string;
    password: string;
}


/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

export interface ChatFolderSummary {
    folderId: number;
    folderName: string;
}


/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

export interface ChatMessage {
    id: number;
    text: string;
    userName: string;
    lastUpdated: Date;
    userId: number;
}


/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

export interface ChatSummary {
    chatId: number;
    messageCount: number;
    lastUpdated: Date;
    chatName: string;
}


/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

export interface CreateChatFolderSubmit {
    chatName: string;
    parentFolderId: number;
    isPublic: boolean;
    allowedUserIds: number[];
    userId: number;
}


/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

export interface CreateChatMessageSubmit {
    userId: number;
    chatMessageId: number;
    chatMessageText: string;
    chatId: number;
    pageNumber: number;
}


/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

export interface CreateChatReturn {
    id: number;
    chatName: string;
}


/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

export interface CreateChatSubmit {
    chatName: string;
    parentFolderId: number;
    isPublic: boolean;
    allowedUserIds: number[];
    userId: number;
}


/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */


export interface GetChatFolderReturn {
    chatFolders: ChatFolderSummary[];
    chats: ChatSummary[];
    chatFolderName: string;
    chatFolderId: number;
    parentChatFolderId: number;
}


/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */


export interface GetChatFolderRoot {
    rootChatFolder: GetChatFolderReturn;
    userIds: UserSummary[];
}


/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

export interface GetChatFolderSubmit {
    chatFolderId: number;
    userId: number;
}


/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */


export interface GetChatReturn {
    id: number;
    messages: ChatMessage[];
    chatName: string;
    totalMessages: number;
}


/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

export interface GetChatSubmit {
    chatId: number;
    userId: number;
    pageNumber: number;
}


/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

export interface KeyValue {
    id: number;
    name: string;
}


/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

export interface LoginReturn {
    userId: string;
    userName: string;
    responseMessage: string;
    successful: boolean;
}


/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

export interface LoginSubmit {
    userName: string;
    password: string;
}


/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

export interface NewUserReturn {
    responseMessage: string;
    successful: boolean;
}


/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

export interface NewUserSubmit {
    userName: string;
    email: string;
    password: string;
}


/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

export interface SetAvatarReturn {
    responseMessage: string;
    successful: boolean;
}


/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */


export interface TestClass {
    objects: TestObj[];
}


/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

export interface TestObj {
    title: string;
    description: string;
}


/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

export interface UserSettingsSubmitResult {
    successful: boolean;
    errorMessage: string;
}


/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

export interface UserSettingsSubmit {
    userId: number;
    name: string;
}


/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

export interface UserSettings {
    userId: number;
    name: string;
    avatar: string;
}


/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

export interface UserSummary {
    userId: number;
    name: string;
    avatar: string;
}


