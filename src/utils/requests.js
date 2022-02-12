export default async function sendRequestAndGetPromise(url, data) {
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then(async function (response) {
      if (!response.ok) {
        return response.text();
      }
    })
    .catch((e) => {
      console.log("Invalid Request");
    });
}
