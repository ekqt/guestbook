import { Client } from "@notionhq/client";
import type { NextPage } from "next";
import Meta from "../../components/Meta";
import fetcher from "../../utils/fetcher";

import styles from "../../styles/Guestbook.module.scss";

import { initializeApp } from "firebase/app";
import {
	getAuth,
	GoogleAuthProvider,
	signInWithPopup,
	signOut,
	onAuthStateChanged,
} from "firebase/auth";

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

import Image from "next/image";

import { Alert, Button, Textarea, LoadingOverlay } from "@mantine/core";

import { Table, ActionIcon } from "@mantine/core";

import {
	AiOutlineInfoCircle,
	AiOutlineGoogle,
	AiOutlineSend,
	AiOutlineDelete,
} from "react-icons/ai";
import { BiMessageSquare } from "react-icons/bi";
import { FaQuoteLeft } from "react-icons/fa";

const firebaseConfig = {
	apiKey: "AIzaSyDB3a6IbflnLS9kR4aBaXhPSMoReT561zk",
	authDomain: "hector-sosa.firebaseapp.com",
	projectId: "hector-sosa",
	storageBucket: "hector-sosa.appspot.com",
	messagingSenderId: "1021871539855",
	appId: "1:1021871539855:web:073f2305042bf9e7e412fa",
};

const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
const auth = getAuth(app);

type UserType = {
	displayName?: string;
	guest?: string;
	comment?: string;
	email: string;
	photoURL: string;
	uid: string;
};

const Guestbook: NextPage = ({ database }: any) => {
	const [user, setUser] = useState<UserType | null>(null);
	const [entries, setEntries] = useState(database.results);
	const [comment, setComment] = useState("");
	const [loader, setLoader] = useState(false);

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			if (user) {
				const { displayName, email, photoURL, uid } = user;
				const userData = {
					displayName,
					email,
					photoURL,
					uid,
				} as UserType;
				setUser(userData);
			} else {
				setUser(null);
			}
		});
	}, []);

	const signInWithGoogle = async () => {
		try {
			await signInWithPopup(auth, provider);
		} catch (error) {
			console.log(error);
		}
	};

	const signOutWithGoogle = async () => {
		try {
			await signOut(auth);
		} catch (error) {
			console.log(error);
		}
	};

	const handleChange = (e: any) => {
		const {
			target: { name, value },
		} = e;
		setComment(value);
	};

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		if (user) {
			try {
				setLoader(true);

				const entry: UserType = {
					guest: user.displayName,
					uid: user.uid,
					photoURL: user.photoURL,
					email: user.email,
					comment,
				};

				const newEntry = await fetcher("/api/guestbook", {
					method: "POST",
					body: JSON.stringify(entry),
				});
				setEntries([newEntry].concat(entries));
				setLoader(false);
				setComment("");
			} catch (error) {
				console.log(error);
			}
		}
	};

	const handleDelete = async (pageID: string) => {
		try {
			await fetcher("/api/guestbook", {
				method: "DELETE",
				body: JSON.stringify(pageID),
			});
			setEntries(entries.filter((i: any) => i.id !== pageID));
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className={styles.container}>
			<Meta
				title={"Guestbook"}
				description={
					"Leave a comment below. It could be anything – appreciation, information, wisdom, or even humor. Surprise me!"
				}
				url={"/guestbook"}
				image={"./guestbook.png"}
			/>

			<main className={styles.main}>
				<section>
					<h1 className={styles.title}>Guestbook</h1>
					<p className={styles.description}>
						Leave a comment below. It could be anything –
						appreciation, information, wisdom, or even humor.
						Surprise me!
					</p>
					<div
						className={styles.form}
						style={{ position: "relative" }}
					>
						<LoadingOverlay
							visible={loader}
							loaderProps={{
								size: "md",
								color: "cyan",
								variant: "dots",
							}}
						/>
						{!user ? (
							<>
								<Alert
									classNames={{
										root: styles.alert,
										icon: styles["alert-icon"],
										title: styles["alert-title"],
									}}
									icon={<AiOutlineInfoCircle size={16} />}
									title="Sign in with Google first and don't worry! Your information is only used for
									your comment!"
									color='blue'
								>
									{""}
								</Alert>
								<Button
									onClick={signInWithGoogle}
									leftIcon={<AiOutlineGoogle />}
									classNames={{ root: styles.button }}
									size='md'
									variant='gradient'
									gradient={{ from: "teal", to: "blue" }}
								>
									Sign In with Google
								</Button>
							</>
						) : (
							<>
								<form>
									<Textarea
										name='comment'
										onChange={handleChange}
										value={comment}
										classNames={{
											wrapper: styles["textarea-message"],
										}}
										icon={<BiMessageSquare />}
										size='md'
										aria-label='Textarea for message'
										placeholder={`Hi, ${user?.displayName
											?.match(/.*\s/)
											?.toString()
											?.trim()}! Type your message here! ♥️`}
										required
										autosize
										minRows={1}
									/>
									<Button
										type='submit'
										onClick={handleSubmit}
										leftIcon={<AiOutlineSend />}
										classNames={{ root: styles.button }}
										size='md'
										variant='gradient'
										gradient={{ from: "blue", to: "green" }}
										disabled={comment.length < 2}
									>
										Submit
									</Button>
									<Button
										onClick={signOutWithGoogle}
										leftIcon={<AiOutlineGoogle />}
										classNames={{ root: styles.button }}
										size='md'
										variant='gradient'
										gradient={{
											from: "#ed6ea0",
											to: "#ec8c69",
											deg: 35,
										}}
									>
										Sign Out
									</Button>
								</form>
							</>
						)}
					</div>
				</section>
				<section>
					<Table
						className={styles.table}
						verticalSpacing='xs'
						highlightOnHover
					>
						<tbody>
							{entries.map((entry: any) => (
								<tr key={uuidv4()}>
									<td className={styles.entry}>
										<p className={styles.comment}>
											<FaQuoteLeft />
											{
												entry.properties.Comment
													.rich_text[0].plain_text
											}
										</p>
										<p className={styles.guest}>
											<>
												{entry.properties.photoURL
													.url && (
													<Image
														className={
															styles.avatar
														}
														src={
															entry.properties
																.photoURL.url
														}
														alt={
															entry.properties
																.Guest
																.rich_text[0]
																.plain_text
														}
														height={28}
														width={28}
													/>
												)}
											</>
											<span>
												–
												<span
													className={
														styles["guest-name"]
													}
												>
													{entry.properties.Guest.rich_text[0].plain_text
														.match(/.*\s/)
														.toString()
														.trim()}
												</span>
												{" / "}
												{Intl.DateTimeFormat("en-US", {
													year: "2-digit",
													month: "short",
													day: "numeric",
													hour: "numeric",
													minute: "numeric",
													second: "numeric",
													hour12: false,
												}).format(
													new Date(
														`${entry.created_time}`
													)
												)}
												{user?.uid ===
													entry.properties.uid
														.rich_text[0]
														.plain_text && (
													<ActionIcon
														color='red'
														radius='xl'
														onClick={() =>
															handleDelete(
																entry.id
															)
														}
													>
														<AiOutlineDelete />
													</ActionIcon>
												)}
											</span>
										</p>
									</td>
								</tr>
							))}
						</tbody>
					</Table>
				</section>
			</main>
		</div>
	);
};

export default Guestbook;

export const getStaticProps = async () => {
	const notion = new Client({ auth: `${process.env.NOTION_KEY}` });
	const databaseID = `${process.env.NOTION_GUESTBOOK_DATABASE_ID}`;
	const database = await notion.databases.query({
		database_id: databaseID,
	});

	return {
		props: {
			database,
		},
		revalidate: 60,
	};
};
