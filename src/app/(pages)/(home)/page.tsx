"use client";

import React, { useState, useEffect } from "react";
import {
  FiUpload,
  FiMessageSquare,
  FiHeart,
  FiChevronLeft,
  FiChevronRight,
  FiShare2,
  FiX,
} from "react-icons/fi";
import { motion } from "framer-motion";

const users = [
  {
    id: 1,
    name: "Usuário 1",
    avatar: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
  },
  {
    id: 2,
    name: "Usuário 2",
    avatar: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
  },
  {
    id: 3,
    name: "Usuário 3",
    avatar:
      "https://s3.us-east-1.wasabisys.com/instax/74/instax/2023/09/legenda-para-fotos-de-viagem-1694459867-1024x683.jpeg",
  },
  {
    id: 4,
    name: "Usuário 4",
    avatar:
      "https://assets.babycenter.com/ims/2017/07/iStock-523497638_4x3.jpg",
  },
];

const initialPosts = [
  {
    id: 1,
    userId: 1,
    content: "Adorando o dia ensolarado!",
    likes: 20,
    comments: [
      { userId: 1, text: "Linda foto!" },
      { userId: 3, text: "Amo dias assim!" },
    ],
    media: [
      "https://images.unsplash.com/photo-1521747116042-5a810fda9664",
      "https://revistasagarana.com.br/wp-content/uploads/2022/02/revistasagarana-fotografia-pexels-david-bartus-610294-1.jpg",
    ],
  },
  {
    id: 3,
    userId: 3,
    content: "Um belo vídeo!",
    likes: 5,
    comments: [
      { userId: 4, text: "lindo!" },
      { userId: 1, text: "kkkkkkk fofo!" },
    ],
    media: ["https://www.w3schools.com/html/mov_bbb.mp4"],
  },
  {
    id: 2,
    userId: 2,
    content: "Explorando novas trilhas na natureza.",
    likes: 15,
    comments: [
      { userId: 2, text: "Que lugar lindo!" },
      { userId: 4, text: "Preciso visitar!" },
    ],
    media: [
      "https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/WhatsApp%20Image%202021-01-27%20at%201.35.04%20PM.jpeg?noresize&width=344&height=450&name=WhatsApp%20Image%202021-01-27%20at%201.35.04%20PM.jpeg",
      "https://blog.emania.com.br/wp-content/uploads/2015/09/papers.co-ma57-rainy-city-nature-22-wallpaper.jpg",
      "https://www.meupositivo.com.br/doseujeito/wp-content/uploads/2022/09/8-dicas-para-tirar-boas-fotos-com-o-celular.jpg",
    ],
  },
];

const Home = () => {
  const [posts, setPosts] = useState(initialPosts);
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostMedia, setNewPostMedia] = useState<File[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState<{
    [key: number]: number;
  }>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPostId, setCurrentPostId] = useState<number | null>(null);
  const [autoPlay, setAutoPlay] = useState(true);

  const addPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPostContent.trim() || newPostMedia.length) {
      const newPost = {
        id: Date.now(),
        userId: 1,
        content: newPostContent,
        likes: 0,
        comments: [],
        media: newPostMedia.map((file) => URL.createObjectURL(file)),
      };
      setPosts([newPost, ...posts]);
      setNewPostContent("");
      setNewPostMedia([]);
    }
  };

  const handleLike = (id: number) => {
    setPosts(
      posts.map((post) =>
        post.id === id ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  const handleComment = (id: number, comment: string) => {
    if (comment.trim()) {
      setPosts(
        posts.map((post) =>
          post.id === id
            ? {
                ...post,
                comments: [...post.comments, { userId: 1, text: comment }],
              }
            : post
        )
      );
    }
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewPostMedia(Array.from(e.target.files));
    }
  };

  const openModal = (postId: number) => {
    setCurrentPostId(postId);
    setCurrentImageIndex({ [postId]: 0 });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentPostId(null);
    setCurrentImageIndex({});
    setAutoPlay(false);
  };

  const nextImage = (postId: number) => {
    const post = posts.find((p) => p.id === postId);
    if (post) {
      setCurrentImageIndex((prev) => ({
        ...prev,
        [postId]: Math.min((prev[postId] ?? 0) + 1, post.media.length - 1),
      }));
    }
  };

  const prevImage = (postId: number) => {
    const post = posts.find((p) => p.id === postId);
    if (post) {
      setCurrentImageIndex((prev) => ({
        ...prev,
        [postId]: Math.max((prev[postId] ?? 0) - 1, 0),
      }));
    }
  };

  const sharePost = (id: number) => {
    const post = posts.find((p) => p.id === id);
    if (!post) return;

    const postMediaUrl = post.media[currentImageIndex[post.id] ?? 0];
    const postContent = post.content;

    if (navigator.share) {
      navigator
        .share({
          title: "Confira este post!",
          text: postContent,
          url: postMediaUrl,
        })
        .then(() => console.log("Compartilhamento bem-sucedido"))
        .catch((error) => console.error("Erro ao compartilhar:", error));
    } else {
      alert("Desculpe, o compartilhamento não é suportado neste navegador.");
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (modalOpen && autoPlay) {
      interval = setInterval(() => {
        nextImage(currentPostId!);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [modalOpen, autoPlay, currentPostId]);

  return (
    <main className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Meu Blog</h1>

      <form onSubmit={addPost} className="mb-4 flex flex-col">
        <textarea
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          className="w-full p-2 dark:bg-black border dark:border-white/20 rounded mb-2"
          placeholder="O que você está pensando?"
        />
        <label className="flex items-center mb-2 cursor-pointer">
          <FiUpload className="mr-2" />
          <input
            type="file"
            multiple
            onChange={handleMediaChange}
            className="hidden"
            accept="image/*"
          />
          <span>Adicionar Imagem</span>
        </label>
        {newPostMedia.length > 0 && (
          <div className="flex space-x-2 mb-2">
            {newPostMedia.map((file, index) => (
              <img
                key={index}
                src={URL.createObjectURL(file)}
                alt={`Pré-visualização ${index + 1}`}
                className="w-96  object-cover"
              />
            ))}
          </div>
        )}
        {(newPostContent.trim() || newPostMedia.length > 0) && (
          <button
            type="submit"
            className="mt-2 bg-blue-500 text-white p-2 rounded"
          >
            Publicar
          </button>
        )}
      </form>

      {posts.map((post) => (
        <div
          key={post.id}
          className="border dark:border-white/20 mb-4 rounded dark:shadow-xl"
        >
          <div className="flex items-center p-4">
            <img
              src={users.find((user) => user.id === post.userId)?.avatar}
              alt={`${
                users.find((user) => user.id === post.userId)?.name
              }'s avatar`}
              className="w-10 h-10 rounded-full mr-2"
            />
            <div>
              <p className="font-bold">
                {users.find((user) => user.id === post.userId)?.name}
              </p>
              <p>{post.content}</p>
            </div>
          </div>

          {post.media.length > 0 && (
            <div className="relative">
              {post.media[0].endsWith(".mp4") ? (
                <video
                  src={post.media[currentImageIndex[post.id] ?? 0]}
                  alt={`Post Media`}
                  className="w-full h-auto max-h-80 object-cover cursor-pointer"
                  
                  autoPlay
                  loop
                  muted
                />
              ) : (
                <img
                  src={post.media[currentImageIndex[post.id] ?? 0]}
                  alt={`Post Media`}
                  className="w-full h-auto max-h-80 object-cover cursor-pointer"
                  onClick={() => openModal(post.id)}
                />
              )}
              <div className="absolute inset-0 flex justify-between items-center">
                <button
                  onClick={() => prevImage(post.id)}
                  className="bg-gray-800 text-white p-2 rounded-l"
                  disabled={currentImageIndex[post.id] === 0}
                >
                  <FiChevronLeft />
                </button>
                <button
                  onClick={() => nextImage(post.id)}
                  className="bg-gray-800 text-white p-2 rounded-r"
                  disabled={
                    currentImageIndex[post.id] === post.media.length - 1
                  }
                >
                  <FiChevronRight />
                </button>
              </div>
            </div>
          )}

          <div className="p-4 flex justify-between items-center">
            <div className="flex items-center">
              <button
                onClick={() => handleLike(post.id)}
                className="flex items-center"
              >
                <FiHeart
                  className={`mr-1 ${post.likes > 0 ? "text-red-500" : ""}`}
                />{" "}
                {post.likes}
              </button>
              <button
                onClick={() => openModal(post.id)}
                className="flex items-center ml-4"
              >
                <FiMessageSquare className="mr-1" /> {post.comments.length}
              </button>
              <button
                onClick={() => sharePost(post.id)}
                className="flex items-center ml-4"
              >
                <FiShare2 className="mr-1" /> Compartilhar
              </button>
            </div>
          </div>
        </div>
      ))}

      {modalOpen && currentPostId !== null && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50"
          onClick={closeModal}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute top-2 right-2 md:right-4 md:top-10 ">
            <FiX className=" size-8 hover:cursor-pointer  md:size-12 shadow-2xl text-white" />
          </div>
          <div
            className="bg-white dark:bg-black border border-white/30 flex flex-col md:flex-row rounded-lg shadow-lg w-11/12 md:w-5/6 lg:w-10/12 "
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full md:w-4/5 p-4 relative">
              <motion.img
                src={
                  posts.find((post) => post.id === currentPostId)?.media[
                    currentImageIndex[currentPostId] ?? 0
                  ]
                }
                className="w-full h-auto max-h-96 object-cover"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                transition={{ duration: 0.3 }}
                style={{ objectFit: "cover" }}
              />
              {posts
                .find((post) => post.id === currentPostId)
                ?.media[0].endsWith(".mp4") && (
                <video
                  src={
                    posts.find((post) => post.id === currentPostId)?.media[
                      currentImageIndex[currentPostId] ?? 0
                    ]
                  }
                  className="w-full h-auto max-h-96 object-cover"
                  autoPlay
                  loop
                  muted
                />
              )}
              <div className="absolute inset-0 flex justify-between items-center">
                <button
                  onClick={() => prevImage(currentPostId!)}
                  className="bg-gray-800 text-white p-2 rounded-l"
                  disabled={currentImageIndex[currentPostId!] === 0}
                >
                  <FiChevronLeft />
                </button>
                <button
                  onClick={() => nextImage(currentPostId!)}
                  className="bg-gray-800 text-white p-2 rounded-r"
                  disabled={
                    currentImageIndex[currentPostId!] ===
                    posts.find((post) => post.id === currentPostId)?.media
                      .length -
                      1
                  }
                >
                  <FiChevronRight />
                </button>
              </div>
            </div>

            <div className="w-full md:w-2/5 p-4 h-96 overflow-y-auto">
              <h2 className="font-extrabold text-black/50 dark:text-white/80 mb-2">
                Comentários:
              </h2>
              <ul className="mb-4">
                {posts
                  .find((post) => post.id === currentPostId)
                  ?.comments.map((c, index) => (
                    <li
                      key={index}
                      className="flex items-start text-gray-700 dark:text-gray-200 mb-2"
                    >
                      <img
                        src={users.find((user) => user.id === c.userId)?.avatar}
                        alt={`${
                          users.find((user) => user.id === c.userId)?.name
                        }'s avatar`}
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <div>
                        <strong>
                          {users.find((user) => user.id === c.userId)?.name}:
                        </strong>{" "}
                        {c.text}
                      </div>
                    </li>
                  ))}
              </ul>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const commentInput = (e.target as any).commentInput;
                  handleComment(currentPostId!, commentInput.value);
                  commentInput.value = "";
                }}
              >
                <input
                  type="text"
                  name="commentInput"
                  className="w-full text-black/80 dark:bg-black dark:text-white border p-2 rounded mb-2"
                  placeholder="Adicionar um comentário..."
                />
                <div className="flex mt-8 justify-center">
                  <button
                    type="submit"
                    className="bg-blue-700 hover:bg-blue-800 text-white p-2 rounded"
                  >
                    Comentar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      )}
    </main>
  );
};

export default Home;
