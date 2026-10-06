let ServerURL = "https://journalui.ru";
// ServerURL = "http://127.0.0.1:4890";


const fetcher = async (url, method = 'GET', data = null, asText = false, headers = {}) => {
  const options = { method: method.toUpperCase(), headers: { ...headers } };

  if (data !== null && data !== undefined) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(data);
  }

  let response;
  try {
    response = await fetch(url, options);
  } catch (error) {
    return { ok: false, status: 0, data: null, error };
  }

  let body = null;
  if (response.status !== 204) {
    body = await (asText ? response.text() : response.json()).catch(() => null);
  }

  return { 
	ok: response.ok,
	status: response.status,
	data: body, error: null
  };
};


async function FetchFileToken() {
	return fetcher("https://omni.top-academy.ru/auth/file-token", "POST", null)
}

