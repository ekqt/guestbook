import { Client } from "@notionhq/client";

export default async function handler(req: any, res: any) {
	if (req.method === "POST") {
		const data = JSON.parse(req.body);
		const entry = {
			parent: {
				database_id: `${process.env.NOTION_GUESTBOOK_DATABASE_ID}`,
			},
			properties: {
				Name: {
					title: [
						{
							text: {
								content: `Guestbook Entry`,
							},
						},
					],
				},
				Guest: {
					rich_text: [
						{
							text: {
								content: `${data.guest}`,
							},
						},
					],
				},
				uid: {
					rich_text: [
						{
							text: {
								content: `${data.uid}`,
							},
						},
					],
				},
				photoURL: {
					url: `${data.photoURL}`,
				},
				Email: {
					email: `${data.email}`,
				},
				Comment: {
					rich_text: [
						{
							text: {
								content: `${data.comment}`,
							},
						},
					],
				},
				Tags: {
					type: "select",
					select: {
						name: "Visible",
						color: "green",
					},
				},
				User: {
					type: "people",
					people: [
						{
							object: "user",
							id: `${process.env.NOTION_ADMIN_ID}`,
						},
					],
				},
			},
		};
		const notion = new Client({ auth: `${process.env.NOTION_KEY}` });
		const response = await notion.pages.create(entry);

		res.status(200).json(response);
	} else {
		res.status(200).json("Hello! This is a POST API route.");
	}
}
