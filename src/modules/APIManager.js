const remoteURL = "http://localhost:5002";

export default {
  get(route) {
    return fetch(`${remoteURL}/${route}`).then(result => result.json());
  },

  delete(route) {
    return fetch(`${remoteURL}/${route}`, {
      method: "DELETE"
    }).then(result => result.json());
  },

  post(route, newItem) {
    return fetch(`${remoteURL}/${route}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newItem)
    }).then(data => data.json());
  },

  update(route, editedItem) {
    return fetch(`${remoteURL}/${route}/${editedItem.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(editedItem)
    }).then(data => data.json());
  }
}