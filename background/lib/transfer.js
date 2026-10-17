export async function blobToDataURL(blob) {
	const bytes = new Uint8Array(await blob.arrayBuffer());
	let bin = "";
	const CH = 0x8000;
	for (let i = 0; i < bytes.length; i += CH) {
		bin += String.fromCharCode.apply(null, bytes.subarray(i, i + CH));
	}
	return `data:${blob.type};base64,${btoa(bin)}`;
}

export async function toTransferable(result) {
	return {
		...result,
		content: result.content ? await blobToDataURL(result.content) : null
	};
}