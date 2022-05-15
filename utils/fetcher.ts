// eslint-disable-next-line import/no-anonymous-default-export
export default async function (...args: any) {
	const res = await fetch(...args);
	return res.json();
}
