function getMedia(url, opts) {
	return chrome.runtime.sendMessage({ type: "getMedia", url, opts });
}