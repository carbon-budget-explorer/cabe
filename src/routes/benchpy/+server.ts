export const GET = async () => {
	const url = 'http://127.0.0.1:8000';
	console.time('effortSharings');
	const response = await fetch(url);
	const effortSharingData = await response.json();
	console.timeEnd('effortSharings');

	return new Response(String(JSON.stringify(effortSharingData)));
};
