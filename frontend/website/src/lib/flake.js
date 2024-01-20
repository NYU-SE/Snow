import axios from 'axios';
import { uploadImage } from './file.js';

export async function getFeeds(offset, limit) {
  let feeds = [];
  await axios.get('/flake/feeds', {
    params: {
      offset: offset,
      limit: limit,
    }
  }).then(function (response) {
    feeds = response.data;
  }).catch(function (error) {
    console.log(error);
  });
  return feeds;
}

export async function listFlakes(user, offset, limit) {
  let flakes = [];
  await axios.get("/flake/list", {
    params: {
      user: user.id,
      offset: offset,
      limit: limit
    }
  }).then(function (response) {
    flakes = response.data;
  }).catch(function (error) {
    console.log(error);
  });
  return flakes;
}

export async function getFlake(flakeId) {
  let flake = null;
  await axios.get("/flake", {
    params: {
      id: flakeId
    }
  }).then((response) => {
    flake = response.data;
  }).catch((error) => {
    console.log(error);
  });
  return flake;
}

export async function getComments(flake, offset, limit) {
  let comments = [];
  await axios.get("/flake/comments", {
    params: {
      id: flake.id,
      offset: offset,
      limit: limit
    }
  }).then((response) => {
    comments = response.data;
  }).catch((error) => {
    console.log(error);
  });
  return comments;
}

export async function post(content, image = null, replyTo = null) {
  let flake = null;
  let imageId = null;
  let params = { content: content };
  if (replyTo) {
    params.reply_to = replyTo.id;
  }

  if (image) {
    const imageId = await uploadImage(image);
    if (imageId) {
      params.image = imageId;
    } else {
      return null;
    }
  }

  await axios.post("/flake/post", params)
    .then((response) => {
      flake = response.data;
    })
    .catch((error) => {
      console.log(error);
    });

  return flake;
}

export async function _delete(flake) {
  let result = false;
  await axios.post("/flake/delete", {
    id: flake.id
  }).then((response) => {
      result = true;
  }).catch((error) => {
      console.log(error);
      result = false;
  });
  return result;
}

export async function like(flake) {
  let newFlake = null;
  await axios.post("/flake/like", {
    id: flake.id
  }).then((response) => {
    newFlake = response.data;
  }).catch((error) => {
    console.log(error);
  });
  return newFlake;
}
