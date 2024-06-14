import { createLinkToken } from "@/lib/actions/user.actions";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import {
	PlaidLinkOnSuccess,
	PlaidLinkOptions,
	usePlaidLink,
} from "react-plaid-link";
import { Button } from "./ui/button";

const PlaidLink = ({ user, variant }: PlaidLinkProps) => {
	const router = useRouter();
	const [token, setToken] = useState("");

	useEffect(() => {
		(async () => {
			const token = await createLinkToken(user);
			setToken(token);
		})();
	}, [user]);

	const onSuccess = useCallback<PlaidLinkOnSuccess>(
		async (token: string) => {
			// await exchangePublicToken({
			//     public_token: token,
			//     user
			// })
			router.push("/");
		},
		[user]
	);
	const config: PlaidLinkOptions = {
		token,
		onSuccess,
	};

	const { open, ready } = usePlaidLink(config);
	return (
		<>
			{variant === "primary" ? (
				<Button
					className="plaidlink-primary"
					onClick={() => open()}
					disabled={!ready}
				>
					{" "}
					Connect Bank
				</Button>
			) : variant === "ghost" ? (
				<Button>Connect Bank</Button>
			) : (
				<Button>Connect Bank</Button>
			)}
		</>
	);
};

export default PlaidLink;
