import type { NextPage } from "next";
import Meta from "../components/Meta";
import styles from "../styles/Home.module.scss";
import { Anchor } from "@mantine/core";

import Link from "next/link";

const Home: NextPage = () => {
	return (
		<div className={styles.container}>
			<Meta />

			<main className={styles.main}>
				<h1 className={styles.title}>Welcome to my website</h1>

				<p className={styles.description}>
					Still under construction, but leave me a message{" "}
					<Link passHref href='/guestbook'>
						<Anchor classNames={{root: styles.link}}>here &rarr;</Anchor>
					</Link>
				</p>
			</main>
		</div>
	);
};

export default Home;
