import axios from 'axios'
import { uploadImage } from './file.js';

let currentUser = null;

export async function getCurrentUser() {
  if (currentUser === null) {
    await axios.get('/user/current')
      .then(function (response) {
        currentUser = response.data;
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  return currentUser;
}

export async function login(username, password) {
  await axios.post('/user/login', {
    username: username,
    password: password
  }).then(function (response) {
    currentUser = response.data;
  }).catch(function (error) {
    console.log(error);
  });
  return currentUser;
}

export async function logout() {
  await axios.post('/user/logout')
    .then(function (response) {
      currentUser = null;
    })
    .catch(function (error) {
      console.log(error);
    });
  return currentUser;
}

export async function signup(email, username, password){
  let messages = [];
  await axios.post('/user/signup', {
    email: email,
    username: username,
    password: password
  }).then(function (response) {
    currentUser = response.data;
  }).catch(function (error) {
    console.log(error);
    messages = error.response.data.message;
  });
  return [currentUser, messages];
}

export async function getUser(userId) {
  let user = null;
  await axios.get('/user', {
    params: {
      id: userId
    }
  }).then(function (response) {
    user = response.data;
  }).catch(function (error) {
    console.log(error);
  });
  return user;
}

export async function getTrendingUsers() {
  let users = [];
  await axios.get('/user/trending')
    .then((response) => {
      users = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
  return users;
}

export async function isFollowing(follower, followee) {
  let result = false;
  await axios.get('/user/is-following', {
    params: {
      follower: follower.id,
      followee: followee.id
    }
  }).then((response) => {
    result = response.data.result;
  }).catch((error) => {
    console.log(error);
  });
  return result;
}

export async function follow(followee) {
  let result = false;
  await axios.post('/user/follow', {
    followee: followee.id
  }).then((response) => {
    result = true;
  }).catch((error) => {
    console.log(error);
  });
  return result;
}

export async function unfollow(followee) {
  let result = false;
  await axios.post('/user/unfollow', {
    followee: followee.id
  }).then((response) => {
    result = true;
  }).catch((error) => {
    console.log(error);
  });
  return result;
}

export async function updateProfile(nickname, bio, profileImage, bannerImage) {
  let params = {
    nickname: nickname,
    bio: bio
  };
  let updatedUser = null;
  if (!currentUser) {
    return null;
  } 

  if (profileImage) {
    let profileImageId = await uploadImage(profileImage);
    if (!profileImageId) {
      return null;
    }
    params.profile_image = profileImageId;
  } else {
    if (currentUser.profile_image) {
      params.profile_image = currentUser.profile_image.id;
    }
  }

  if (bannerImage) {
    let bannerImageId = await uploadImage(bannerImage);
    if (!bannerImageId) {
      return null;
    }
    params.banner_image = bannerImageId;
  } else {
    if (currentUser.banner_image) {
      params.banner_image = currentUser.banner_image.id;
    }
  }

  await axios.post('/user/profile/update', params)
    .then((response) => {
      updatedUser = response.data;
      currentUser = updatedUser;
    })
    .catch((error) => {
      console.log(error);
    });

  return updatedUser;
}
