function getMedia(url, opts) {
	return BrowserContext.runtime.sendMessage({ type: "getMedia", url, opts });
}