import axios from 'axios';

export async function uploadImage(image) {
  let imageId = null;
  await axios.postForm("/file/image/upload", {
    image: image
  }).then((response) => {
    imageId = response.data.id;
  }).catch((error) => {
    console.log(error);
  });
  return imageId;
}
