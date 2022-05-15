// eslint-disable-next-line import/no-anonymous-default-export
export default async function (endpoint: any, config: any) {
	const res = await fetch(endpoint, config);
	return res.json();
}
