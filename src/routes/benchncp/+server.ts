import { interpreter } from 'node-calls-python'

const py = interpreter

// Edit ws.py to comment out ws stuff, for quickest import
const pymodule = await py.import('./ws.py')

export const GET = async () => {
	const effortSharingData = await py.call(pymodule, 'getEffortSharings');
    // console.log(effortSharingData);
	return new Response(String(JSON.stringify(effortSharingData)));
};
