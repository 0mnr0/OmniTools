const MIME_EXT = {
	"image/jpeg": ".jpg", "image/png": ".png", "image/gif": ".gif",
	"image/webp": ".webp", "image/avif": ".avif", "image/svg+xml": ".svg",
	"video/mp4": ".mp4", "video/webm": ".webm", "video/ogg": ".ogv",
	"application/zip": ".zip", "application/pdf": ".pdf"
};

export function sniffMime(b) {
	const eq = (off, ...s) => s.every((v, i) => b[off + i] === v);
	if (eq(0, 0xFF, 0xD8, 0xFF)) return "image/jpeg";
	if (eq(0, 0x89, 0x50, 0x4E, 0x47)) return "image/png";
	if (eq(0, 0x47, 0x49, 0x46, 0x38)) return "image/gif";
	if (eq(0, 0x52, 0x49, 0x46, 0x46) && eq(8, 0x57, 0x45, 0x42, 0x50)) return "image/webp";
	if (eq(4, 0x66, 0x74, 0x79, 0x70)) return "video/mp4";
	if (eq(0, 0x1A, 0x45, 0xDF, 0xA3)) return "video/webm";
	if (eq(0, 0x50, 0x4B, 0x03, 0x04)) return "application/zip";
	if (eq(0, 0x25, 0x50, 0x44, 0x46)) return "application/pdf";
	return null;
}

export function parseFileName(cd) {
	if (!cd) return null;
	let m = /filename\*\s*=\s*utf-8''([^;]+)/i.exec(cd);
	if (m) { try { return decodeURIComponent(m[1].trim()); } catch {} }
	m = /filename\s*=\s*"?([^";]+)"?/i.exec(cd);
	return m ? m[1].trim() : null;
}

export function getExt(name) {
	const m = name && /\.[a-z0-9]{1,8}$/i.exec(name);
	return m ? m[0].toLowerCase() : null;
}

// Content-Disposition из заголовка или из query (?response-content-disposition=...)
function resolveFileName(res) {
	const fromHeader = parseFileName(res.headers.get("content-disposition"));
	if (fromHeader) return fromHeader;
	try {
		const cd = new URL(res.url).searchParams.get("response-content-disposition");
		return parseFileName(cd);
	} catch {
		return null;
	}
}

const EMPTY = { isMedia: false, ok: false, filetype: null, easytype: null, fileext: null, finalUrl: null, content: null };

/**
 * @param {string} url
 * @param {object} [opts]
 * @param {boolean} [opts.withContent=true]  качать тело для image
 * @param {boolean} [opts.downloadVideo=false]
 * @param {number}  [opts.maxBytes=25*1024*1024]
 * @param {RequestCredentials} [opts.credentials="include"]
 * @returns {Promise<{isMedia:boolean, ok:boolean, filetype:string|null, easytype:string|null,
 *                    fileext:string|null, finalUrl:string|null, content:Blob|null}>}
 */
export async function getMedia(url, opts = {}) {
	const {
		withContent = true,
		downloadVideo = false,
		maxBytes = 25 * 1024 * 1024,
		credentials = "omit"
	} = opts;
	
	console.log("Parsing:" +url);
	const ctrl = new AbortController();
	let res;
	try {
		res = await fetch(url, { signal: ctrl.signal, credentials });
	} catch {
		return { ...EMPTY };
	}
	if (!res.ok) {
		ctrl.abort();
		return { ...EMPTY, finalUrl: res.url };
	}

	let filetype = (res.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
	const reader = res.body.getReader();
	const chunks = [];
	let received = 0;

	const vague = !filetype || filetype === "application/octet-stream" || filetype === "text/plain";
	if (vague) {
		const { value } = await reader.read();
		if (value) { chunks.push(value); received += value.length; }
		filetype = (value && sniffMime(value)) || filetype || "application/octet-stream";
	}

	const isImage = filetype.startsWith("image/");
	const isVideo = filetype.startsWith("video/");
	const isMedia = isImage || isVideo;

	const fileName = resolveFileName(res);
	const result = {
		isMedia,
		ok: true,
		filetype,
		easytype: filetype.split("/")[1] ?? null,
		fileext: getExt(fileName) || getExt(new URL(res.url).pathname) || MIME_EXT[filetype] || null,
		finalUrl: res.url,
		content: null
	};

	const needBody = isMedia && withContent && (isImage || downloadVideo);
	if (!needBody) {
		await reader.cancel().catch(() => {});
		ctrl.abort();
		return result;
	}

	for (;;) {
		const { done, value } = await reader.read();
		if (done) break;
		received += value.length;
		if (received > maxBytes) {
			await reader.cancel().catch(() => {});
			ctrl.abort();
			return result;
		}
		chunks.push(value);
	}

	result.content = new Blob(chunks, { type: filetype });
	return result;
}