const titleInput = document.getElementById("title");
const tagInput = document.getElementById("tag");
const tagColorInput = document.getElementById("tagColor");
const descInput = document.getElementById("desc");
const mediaInput = document.getElementById("media");
const dateInput = document.getElementById("postDate");
const preview = document.getElementById("preview");
const adminPosts = document.getElementById("adminPosts");

let editId = null;

/* Detect media type */
function getMediaType(url) {
  return url.match(/\.(mp4|webm|ogg)$/i) ? "video" : "image";
}

/* PREVIEW MEDIA */
mediaInput.addEventListener("input", () => {
  preview.innerHTML = "";
  mediaInput.value.split(",").forEach(url => {
    url = url.trim();
    if (!url) return;

    if (getMediaType(url) === "video") {
      const v = document.createElement("video");
      v.src = url;
      v.controls = true;
      v.width = 80;
      preview.appendChild(v);
    } else {
      const img = document.createElement("img");
      img.src = url;
      preview.appendChild(img);
    }
  });
});

/* PUBLISH / UPDATE */
function publishPost() {
  if (!dateInput.value) {
    alert("Please select date and time");
    return;
  }

  const urls = mediaInput.value.split(",").map(u => u.trim()).filter(Boolean);
  if (!titleInput.value || !descInput.value || urls.length === 0) {
    alert("Title, description and media URLs are required");
    return;
  }

  const media = urls.map(url => ({
    type: getMediaType(url),
    url
  }));

  const data = {
    title: titleInput.value,
    tag: tagInput.value,
    tagColor: tagColorInput.value,
    description: descInput.value,
    media,
    images: media.filter(m => m.type === "image").map(m => m.url),
    likes: 0,
    featured: false,

    // ✅ SINGLE EDITABLE DATE
    createdAt: new Date(dateInput.value)
  };

  if (editId) {
    db.collection("posts").doc(editId).update(data);
    editId = null;
  } else {
    db.collection("posts").add(data);
  }

  titleInput.value = "";
  tagInput.value = "";
  descInput.value = "";
  mediaInput.value = "";
  dateInput.value = "";
  preview.innerHTML = "";
}

/* LOAD POSTS */
db.collection("posts")
  .orderBy("createdAt", "desc")
  .onSnapshot(snapshot => {
    adminPosts.innerHTML = "";
    snapshot.forEach(doc => {
      const p = doc.data();
      const div = document.createElement("div");
      div.className = "admin-post";

      div.innerHTML = `
        <strong>${p.title}</strong><br>
        <button onclick="editPost('${doc.id}')">Edit</button>
        <button onclick="deletePost('${doc.id}')">Delete</button>
        <button onclick="toggleFeatured('${doc.id}', ${p.featured || false})">
          ${(p.featured ? "Unpin" : "Pin")} Featured
        </button>
      `;
      adminPosts.appendChild(div);
    });
  });

/* EDIT POST */
function editPost(id) {
  db.collection("posts").doc(id).get().then(doc => {
    const p = doc.data();
    editId = id;

    titleInput.value = p.title;
    tagInput.value = p.tag;
    tagColorInput.value = p.tagColor;
    descInput.value = p.description;

    if (p.createdAt?.toDate) {
      dateInput.value = p.createdAt.toDate().toISOString().slice(0,16);
    }

    const urls = p.media ? p.media.map(m => m.url) : [];
    mediaInput.value = urls.join(",");

    preview.innerHTML = "";
    urls.forEach(url => {
      const el = getMediaType(url) === "video"
        ? Object.assign(document.createElement("video"), { src: url, controls: true, width: 80 })
        : Object.assign(document.createElement("img"), { src: url });
      preview.appendChild(el);
    });
  });
}

/* DELETE */
function deletePost(id) {
  if (confirm("Delete this post?")) {
    db.collection("posts").doc(id).delete();
  }
}

/* FEATURED */
function toggleFeatured(id, current) {
  db.collection("posts").doc(id).update({ featured: !current });
}
