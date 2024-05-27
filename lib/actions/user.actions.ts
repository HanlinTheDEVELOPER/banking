"use server";

import { cookies } from "next/headers";
import { ID } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { parseStringify } from "../utils";

export const signIn = async ({ email, password }: LoginUser) => {
	try {
		const { account } = await createAdminClient();
		const response = await account.createEmailPasswordSession(email, password);
		return parseStringify(response);
	} catch (error) {
		console.log(error);
	}
};

export const signUp = async (userData: SignUpParams) => {
	try {
		const { account } = await createAdminClient();
		const { email, password, firstName, lastName } = userData;
		const newUserAccount = await account.create(
			ID.unique(),
			email,
			password,
			`${firstName} ${lastName}`
		);
		const session = await account.createEmailPasswordSession(email, password);

		cookies().set("aw-session", session.secret, {
			path: "/",
			httpOnly: true,
			sameSite: "strict",
			secure: true,
		});

		return parseStringify(newUserAccount);
	} catch (error) {
		console.log(error);
	}
};

export async function getLoggedInUser() {
	try {
		const { account } = await createSessionClient();
		const data = await account.get();
		return parseStringify(data);
	} catch (error) {
		return null;
	}
}

export async function logoutAccount() {
	try {
		const { account } = await createSessionClient();
		cookies().delete("aw-session");
		const loggedOut = await account.deleteSession("current");
		return loggedOut;
	} catch (error) {
		console.log(error);
	}
}
