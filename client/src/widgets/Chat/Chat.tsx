import React, { useEffect, useRef, useState, useMemo } from "react";
import { useAppSelector } from "@/shared/hooks/reduxHooks";
import { io, Socket } from "socket.io-client";
import { useSearchParams, useNavigate } from "react-router-dom";
import EmojiPicker from "emoji-picker-react";
import type { RootState } from "@/app/store/store";
import { getAllSportClubMembersThunk } from "@/entities/sportClubMemberes/api/sportClubMemberesApi";
import { getAllSportClubsThunk } from "@/entities/sportClub/api/sportClubApi";
import { useAppDispatch } from "@/shared/hooks/reduxHooks";
import { POPULAR_EMOJIS } from "./PopularEmoji";
import ButtonAdd from "./ButtonAdd";
import "./Chat.css";
import type { ChatMessage } from "@/shared/types/message";

import type { SportClubType } from "@/entities/sportClub/model";
import type { SportClubMemberType } from "@/entities/sportClubMemberes/model";
import { accessToken } from "@/shared/lib/axiosInstance";

function Chat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [visibleWindow, setVisibleWindow] = useState(false);
  const [visibleWindowUsersChat, setVisibleWindowUsersChat] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [currentSportClubId, setCurrentSportClubId] = useState<number | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [emojiSearchQuery, setEmojiSearchQuery] = useState("");
  const [showEmojiSuggestions, setShowEmojiSuggestions] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [editingMessageText, setEditingMessageText] = useState("");
  const [openMessageMenuId, setOpenMessageMenuId] = useState<number | null>(
    null
  );
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [usersChat, setUsersChat] = useState<SportClubMemberType[]>([]);
  const inputWrapperRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const openUsersHandler = () => {
    setVisibleWindowUsersChat(!visibleWindowUsersChat);
  };

  const [searchParams] = useSearchParams();
  const clubId = searchParams.get("clubId");

  const user = useAppSelector((state: RootState) => state.user.user);
  const sportClubMembers = useAppSelector(
    (state: RootState) => state.sportClubMember.sportClubMembers
  );
  const dispatch = useAppDispatch();

  const sportClubs = useAppSelector(
    (state: RootState) => state.sportClub.sportClubs
  );
  const curentSportClub: SportClubType | undefined = sportClubs.find(
    (el) => el.id === Number(clubId)
  );

  // Отладочная информация
  console.log("clubId:", clubId);
  console.log("sportClubs:", sportClubs);
  console.log("curentSportClub:", curentSportClub);
  console.log("curentSportClub?.photo:", curentSportClub?.photo);

  // Загружаем данные спортивных клубов если они не загружены
  useEffect(() => {
    if (sportClubs.length === 0) {
      console.log("Загружаем данные спортивных клубов...");
      // Здесь можно добавить dispatch для загрузки данных
    }
  }, [sportClubs.length]);

  // Предзагрузка изображения клуба
  useEffect(() => {
    if (curentSportClub?.photo) {
      const clubPhotoUrl = `${import.meta.env.VITE_API_URL}${curentSportClub.photo}`;
      console.log("Предзагружаем фото клуба:", clubPhotoUrl);
      
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        console.log("Фото клуба предзагружено успешно");
      };
      img.onerror = () => {
        console.log("Ошибка предзагрузки фото клуба:", clubPhotoUrl);
      };
      img.src = clubPhotoUrl;
    }
  }, [curentSportClub?.photo]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (user?.telegram_photo) {
      const avatarUrl = `${import.meta.env.VITE_API_URL}${user.telegram_photo}`;

      // Проверяем, есть ли аватар в кэше
      const cachedAvatar = localStorage.getItem(`avatar_${user.id}`);
      if (cachedAvatar === avatarUrl) {
        // Аватар уже в кэше, загружаем мгновенно
        return;
      }

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        // Сохраняем в кэш при успешной загрузке
        localStorage.setItem(`avatar_${user.id}`, avatarUrl);
      };
      img.src = avatarUrl;

      // Также предзагружаем дефолтный аватар
      const defaultImg = new Image();
      defaultImg.src = "/personProfile.svg";
    }
  }, [user?.telegram_photo, user?.id]);

  // Предзагрузка аватаров всех участников чата
  useEffect(() => {
    if (sportClubMembers.length > 0 && currentSportClubId) {
      const clubMembers = sportClubMembers.filter(
        (member) => member.sportClub_id === currentSportClubId
      );

      clubMembers.forEach((member) => {
        if (member.user?.telegram_photo) {
          const avatarUrl = `${import.meta.env.VITE_API_URL}${
            member.user.telegram_photo
          }`;
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.src = avatarUrl;
        }
      });
    }
  }, [sportClubMembers, currentSportClubId]);

  // Обновление списка пользователей в чате
  useEffect(() => {
    if (sportClubMembers.length > 0 && clubId) {
      const clubMembers = sportClubMembers.filter(
        (el) => el.sportClub_id === Number(clubId)
      );
      console.log("Club members:", clubMembers);
      console.log(
        "Club members with user data:",
        clubMembers.map((member) => member.user)
      );
      setUsersChat(clubMembers);
    }
  }, [sportClubMembers, clubId]);

  // Обработчик кликов вне области подсказок эмоджи

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputWrapperRef.current &&
        !inputWrapperRef.current.contains(event.target as Node)
      ) {
        setShowEmojiSuggestions(false);
        setEmojiSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!clubId) {
      setLoading(false);
      return;
    }

    const checkMembershipAndSetClub = async () => {
      try {
        if (sportClubMembers.length === 0) {
          await dispatch(getAllSportClubMembersThunk());
        }

        // Загружаем данные о спорт-клубах, если их нет в Redux
        if (sportClubs.length === 0) {
          await dispatch(getAllSportClubsThunk());
        }

        setCurrentSportClubId(Number(clubId));
        setLoading(false);
      } catch (error) {
        console.error("Ошибка при загрузке данных о членах клуба:", error);
        setCurrentSportClubId(null);
        setLoading(false);
      }
    };

    if (user?.id && clubId) {
      checkMembershipAndSetClub();
    } else {
      setLoading(false);
    }
  }, [
    searchParams,
    user?.id,
    dispatch,
    sportClubMembers.length,
    sportClubs.length,
  ]);

  const isClubMember = useMemo(() => {
    if (!sportClubMembers.length || !user?.id || !currentSportClubId)
      return false;

    return sportClubMembers.some(
      (member) =>
        member.sportClub_id === currentSportClubId &&
        member.user_id === user?.id
    );
  }, [sportClubMembers, user?.id, currentSportClubId]);

  useEffect(() => {
    if (currentSportClubId) {
      fetchMessages();
    }
  }, [currentSportClubId]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/chat/messages?sportClubId=${currentSportClubId}&count=50`
      );
      if (response.ok) {
        const data = await response.json();
        setMessages(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const connectSocket = () => {
    if (socketRef.current?.connected) {
      return;
    }

    const token = accessToken;

    if (!token) {
      console.error("Токен не найден, невозможно подключиться к WebSocket");
      return;
    }

    // Подключаемся к socket.io серверу
    socketRef.current = io(
      import.meta.env.VITE_API_URL || "http://localhost:3000",
      {
        auth: {
          token: token,
        },
        transports: ["websocket", "polling"],
      }
    );

    socketRef.current.on("connect", () => {
      console.log("Подключен к WebSocket серверу");
      setIsConnected(true);
      reconnectAttempts.current = 0;

      if (clubId) {
        socketRef.current?.emit("join-chat-room", Number(clubId));
        console.log(
          `Автоматически присоединились к чату спорт-клуба ${currentSportClubId}`
        );
      }
    });

    socketRef.current.on("disconnect", () => {
      console.log("Отключен от WebSocket сервера");
      setIsConnected(false);

      if (reconnectAttempts.current < maxReconnectAttempts) {
        reconnectAttempts.current++;
        reconnectTimeoutRef.current = setTimeout(() => {
          connectSocket();
        }, 1000 * reconnectAttempts.current);
      }
    });

    socketRef.current.on("connect_error", (error) => {
      console.error("Ошибка подключения к WebSocket:", error);
      setIsConnected(false);
    });

    socketRef.current.on("NEW_MESSAGE", (message) => {
      setMessages((prevMessages) => {
        const existingTempIndex = prevMessages.findIndex(
          (msg) =>
            msg.isTemp &&
            msg.message === message.message &&
            msg.userId === message.userId
        );

        if (existingTempIndex !== -1) {
          const newMessages = [...prevMessages];
          const tempMessage = newMessages[existingTempIndex];
          newMessages[existingTempIndex] = {
            ...message,
            isTemp: false,
            user: tempMessage.user || message.user, // Сохраняем данные пользователя из временного сообщения
          };
          return newMessages;
        } else {
          // Добавляем новое сообщение от другого пользователя
          // Если данных пользователя нет, пытаемся найти их в участниках клуба
          const enrichedMessage = { ...message, isTemp: false };
          if (!message.user && message.userId) {
            const clubMember = sportClubMembers.find(
              (member) =>
                member.user_id === message.userId &&
                member.sportClub_id === currentSportClubId
            );
            if (clubMember?.user) {
              enrichedMessage.user = clubMember.user;
            }
          }
          return [...prevMessages, enrichedMessage];
        }
      });
    });

    socketRef.current.on("UPDATE_MESSAGE", (message) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === message.id ? { ...message, isTemp: false } : msg
        )
      );
    });

    socketRef.current.on("DELETE_MESSAGE", (data) => {
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== data.id)
      );
    });

    socketRef.current.on("user-joined-chat", (userInfo) => {
      console.log(`Пользователь ${userInfo.userName} присоединился к чату`);
    });

    socketRef.current.on("user-left-chat", (userInfo) => {
      console.log(`Пользователь ${userInfo.userName} покинул чат`);
    });

    socketRef.current.on("chat-room-users", (users) => {
      console.log("Пользователи в чате:", users);
    });

    socketRef.current.on("error", (error) => {
      console.error("WebSocket error:", error);
      alert(error.message);
    });

    socketRef.current.on("club-deleted", (data) => {
      console.log("Клуб был удален:", data);
      alert(
        "Клуб был удален создателем. Вы будете перенаправлены на главную страницу."
      );
      navigate("/");
    });
  };

  useEffect(() => {
    connectSocket();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (socketRef.current?.connected && currentSportClubId) {
      socketRef.current.emit("join-chat-room", currentSportClubId);
    }
  }, [currentSportClubId]);

  const sendMessage = () => {
    if (
      inputMessage.trim() === "" ||
      !socketRef.current?.connected ||
      !currentSportClubId ||
      !user?.id ||
      !user?.userName
    ) {
      return;
    }

    const tempMessage: ChatMessage = {
      id: Date.now(),
      message: inputMessage,
      userId: user.id,
      userName: user.userName,
      createdAt: new Date(),
      isTemp: true,

      user: user,
    };

    setMessages((prev) => [...prev, tempMessage]);

    socketRef.current.emit("NEW_MESSAGE", {
      message: inputMessage,
      sportClubId: clubId,
    });

    setInputMessage("");
    setVisibleWindow(false);
  };

  const handleFileSelect = async (file: File) => {
    if (
      !socketRef.current?.connected ||
      !currentSportClubId ||
      !user?.id ||
      !user?.userName
    ) {
      return;
    }

    // Создаем FormData для отправки файла
    const formData = new FormData();
    formData.append("image", file);
    formData.append("sportClubId", currentSportClubId.toString());
    formData.append("userId", user.id.toString());

    try {
      // Отправляем файл на сервер
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/chat/upload-image`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        const imageUrl = data.data.imageUrl;

        // Создаем временное сообщение с изображением
        const tempMessage: ChatMessage = {
          id: Date.now(),
          message: `[IMAGE]${imageUrl}`,
          userId: user.id,
          userName: user.userName,
          createdAt: new Date(),
          isTemp: true,
          user: user,
        };

        // Добавляем временное сообщение
        setMessages((prev) => [...prev, tempMessage]);

        // Отправляем сообщение с изображением через WebSocket
        socketRef.current.emit("NEW_MESSAGE", {
          message: `[IMAGE]${imageUrl}`,
          sportClubId: clubId,
        });
      } else {
        console.error("Ошибка загрузки изображения");
        alert("Ошибка загрузки изображения");
      }
    } catch (error) {
      console.error("Ошибка при отправке файла:", error);
      alert("Ошибка при отправке файла");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }

    if (e.key === "Escape") {
      setShowEmojiSuggestions(false);
      setEmojiSearchQuery("");
    }
  };

  const handleEditKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      saveEditedMessage();
    } else if (e.key === "Escape") {
      e.preventDefault();
      cancelEdit();
    }
  };

  const updateMessage = (id: number) => {
    const message = messages.find((m) => m.id === id);
    if (message) {
      setEditingMessageId(id);
      setEditingMessageText(
        message.message.startsWith("[IMAGE]") ? "" : message.message
      );
      setOpenMessageMenuId(null);
    }
  };

  const saveEditedMessage = () => {
    if (
      editingMessageId &&
      editingMessageText.trim() &&
      socketRef.current?.connected
    ) {
      socketRef.current.emit("UPDATE_MESSAGE", {
        id: editingMessageId,
        message: editingMessageText.trim(),
      });
      setEditingMessageId(null);
      setEditingMessageText("");
    }
  };

  const cancelEdit = () => {
    setEditingMessageId(null);
    setEditingMessageText("");
  };

  const deleteMessage = (id: number) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("DELETE_MESSAGE", { id });
      setOpenMessageMenuId(null);
    }
  };

  const toggleMessageMenu = (
    messageId: number,
    event?: React.MouseEvent | React.TouchEvent
  ) => {
    // Предотвращаем всплытие события, чтобы не закрывать меню сразу
    event?.preventDefault();
    event?.stopPropagation();

    if (openMessageMenuId === messageId) {
      setOpenMessageMenuId(null);
    } else {
      setOpenMessageMenuId(messageId);
    }
  };

  const handleMenuClick = (
    action: () => void,
    event?: React.MouseEvent | React.TouchEvent
  ) => {
    // Предотвращаем всплытие события
    event?.preventDefault();
    event?.stopPropagation();

    action();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY !== null) {
      const touchEndY = e.changedTouches[0].clientY;
      const diff = touchStartY - touchEndY;

      // Если свайп вверх больше 50px, закрываем меню
      if (diff > 50 && openMessageMenuId) {
        setOpenMessageMenuId(null);
      }

      setTouchStartY(null);
    }
  };

  const toggleUsersDisplay = () => {
    setShowAllUsers(!showAllUsers);
  };

  const getDisplayedUsers = () => {
    if (showAllUsers) {
      return usersChat;
    }
    return usersChat.slice(0, 5);
  };

  const getChatImages = () => {
    return messages
      .filter((message) => message.message.startsWith("[IMAGE]"))
      .map((message) => ({
        id: message.id,
        url: message.message.replace("[IMAGE]", ""),
        userName: message.user?.userName || message.userName,
        createdAt: message.createdAt,
      }));
  };

  const onEmojiClick = (emojiData: { emoji: string }) => {
    setInputMessage((prev) => prev + emojiData.emoji);
  };

  const toggleEmojiWindow = () => {
    setVisibleWindow(!visibleWindow);
  };

  const searchEmojis = (query: string) => {
    if (!query.trim()) return [];

    const searchTerm = query.toLowerCase();

    return POPULAR_EMOJIS.filter(
      (emoji) => emoji.name.toLowerCase() === searchTerm
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInputMessage(value);

    const words = value.split(" ");
    const lastWord = words[words.length - 1];

    if (lastWord && lastWord.trim()) {
      const suggestions = searchEmojis(lastWord);

      if (suggestions.length > 0) {
        setEmojiSearchQuery(lastWord);
        setShowEmojiSuggestions(true);
      } else {
        setShowEmojiSuggestions(false);
      }
    } else {
      setShowEmojiSuggestions(false);
    }
  };

  const insertEmoji = (emoji: string) => {
    const words = inputMessage.split(" ");

    words.pop();

    const newMessage = words.join(" ") + (words.length > 0 ? " " : "") + emoji;
    setInputMessage(newMessage);
    setShowEmojiSuggestions(false);
    setEmojiSearchQuery("");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        visibleWindowUsersChat &&
        !(event.target as Element).closest(".users-chat-window")
      ) {
        setVisibleWindowUsersChat(false);
      }
      // Закрываем меню сообщений при клике вне его
      if (
        openMessageMenuId &&
        !(event.target as Element).closest(".message-actions") &&
        !(event.target as Element).closest(".message-menu")
      ) {
        setOpenMessageMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [visibleWindowUsersChat, openMessageMenuId]);

  if (loading || !currentSportClubId) {
    return (
      <div className="chat-container">
        <div className="chat-header">
          <h2>Чат</h2>
        </div>
        <div className="loading-container">
          <img
            src={
              curentSportClub?.photo
                ? `${import.meta.env.VITE_API_URL}${curentSportClub.photo}`
                : "/personProfile.svg"
            }
            alt="Фото клуба"
            className="club-photo"
            onError={(e) => {
              console.log("Ошибка загрузки фото клуба при загрузке:", e.currentTarget.src);
              e.currentTarget.src = "/personProfile.svg";
            }}
            onLoad={(e) => {
              console.log("Фото клуба успешно загружено при загрузке:", e.currentTarget.src);
            }}
          />
          <p>Загрузка...</p>
        </div>
      </div>
    );
  }


  if (!isClubMember) {
    return (
      <div className="chat-container">
        <div className="chat-header">
          <h2>Чат спорт-клуба</h2>
        </div>

        <div className="loading-container">
          <p>Вы не являетесь участником этого спорт-клуба.</p>
          <p>Присоединитесь к клубу, чтобы участвовать в чате.</p>
        </div>
      </div>
    );
  }

  if (visibleWindowUsersChat) {
    return (
      <div className="users-chat-window">
        <div>
          <img
            src={
              curentSportClub?.photo
                ? `${import.meta.env.VITE_API_URL}${curentSportClub.photo}`
                : "/personProfile.svg"
            }
            alt="Фото клуба"
            className="club-photo"
            onError={(e) => {
              console.log("Ошибка загрузки фото клуба:", e.currentTarget.src);
              e.currentTarget.src = "/personProfile.svg";
            }}
            onLoad={(e) => {
              console.log("Фото клуба успешно загружено:", e.currentTarget.src);
            }}
          />
          <h2>{curentSportClub?.title || "Чат"}</h2>
          <span className="h-users-value">
            {usersChat.length} из {usersChat.length} участников онлайн
          </span>
        </div>
        <div className="users-list">
          {getDisplayedUsers().map((el) => {
            const imageUrl = el.user.telegram_photo
              ? `${import.meta.env.VITE_API_URL}${el.user.telegram_photo}`
              : "/personProfile.svg";
            return (
              <div key={el.id}>
                <div className="user-item">
                  <img
                    src={imageUrl}
                    alt="фото"
                    className="user-avatar-small"
                    onError={(e) => {
                      console.log(
                        "Ошибка загрузки аватара пользователя:",
                        e.currentTarget.src
                      );
                      e.currentTarget.src = "/personProfile.svg";
                    }}
                    onLoad={(e) => {
                      console.log(
                        "Аватар успешно загружен:",
                        e.currentTarget.src
                      );
                    }}
                  />

                  <span className="user-name">{el.user.userName}</span>
                  <span className="connection-status">

                    {isConnected ? (
                      <span className="connection-status-ok">●</span>
                    ) : (
                      <span className="connection-status-false">●</span>
                    )}
                  </span>
                </div>
              </div>
            );
          })}
          {usersChat.length > 4 && (
            <div className="show-more-users">
              <button className="toggle-users-btn" onClick={toggleUsersDisplay}>
                {showAllUsers
                  ? "△ Скрыть"
                  : `▽ Показать всех (${usersChat.length})`}
              </button>
            </div>
          )}

          {/* Галерея фотографий */}
          <div className="chat-gallery-section">
            <span className="chat-gallery-section-h">Галерея</span>
            <div className="chat-gallery">
              {getChatImages().length > 0 ? (
                getChatImages().map((image) => (
                  <div key={image.id} className="gallery-item">
                    <img
                      src={`${import.meta.env.VITE_API_URL}${image.url}`}
                      alt="Фото из чата"
                      className="gallery-image"
                      onError={(e) => {
                        console.log(
                          "Ошибка загрузки изображения галереи:",
                          e.currentTarget.src
                        );
                        e.currentTarget.src = "/placeholder-image.jpg";
                      }}
                    />
                    <div className="gallery-item-info">
                      <span className="gallery-user-name">
                        {image.userName}
                      </span>
                      <span className="gallery-date">
                        {new Date(image.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-images-message">
                  В чате пока нет фотографий
                </div>
              )}
            </div>
          </div>
        </div>
        <button onClick={openUsersHandler} className="close-users-btn">
          Закрыть
        </button>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="header-top-row">
          <button className="h-button" onClick={openUsersHandler}>
            <h2>{curentSportClub?.title || "Чат"}</h2>
          </button>
          <span className="connection-status">
            {isConnected ? (
              <span className="connection-status-ok">●</span>
            ) : (
              <span className="connection-status-false">●</span>
            )}
          </span>
        </div>
        <div className="h-users-value">
          {usersChat.length} {usersChat.length > 4 ? "участников" : "участника"}
        </div>
      </div>

      <div className="messages-container">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${
              message.userId === user?.id ? "own-message" : "other-message"
            } ${openMessageMenuId === message.id ? "menu-open" : ""}`}
            data-message-id={message.id}
          >
            <div className="message-avatar">
              <img
                src={
                  message.user?.telegram_photo
                    ? `${import.meta.env.VITE_API_URL}${
                        message.user.telegram_photo
                      }`
                    : "/personProfile.svg"
                }
                alt="A"
                className={`user-avatar ${
                  message.user?.telegram_photo
                    ? "user-avatar-with-transition"
                    : ""
                }`}
                loading="eager"
                onError={(e) => {
                  console.log("Ошибка загрузки аватара:", e.currentTarget.src);
                  e.currentTarget.src = "/personProfile.svg";
                }}
                onLoad={(e) => {
                  if (message.user?.telegram_photo) {
                    e.currentTarget.classList.add("loaded");
                  }
                }}
              />
            </div>
            <div className="message-content-wrapper">
              <div className="message-header">
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "4px",
                    lineHeight: "1",
                  }}
                >
                  <button
                    className="message-user-name-button"
                    onClick={() =>
                      message.user?.id && navigate(`/user/${message.user.id}`)
                    }
                    title="Посмотреть профиль"
                    disabled={!message.user?.id}
                  >
                    {message.user?.userName || "Неизвестный"}
                  </button>

                  {message.userId === user?.id && (
                    <button
                      className="message-menu-btn"
                      onClick={(e) => toggleMessageMenu(message.id, e)}
                      onTouchStart={handleTouchStart}
                      onTouchEnd={handleTouchEnd}
                      title="Действия с сообщением"
                    >
                     ⋮ 
                    </button>
                  )}

                </div>
                <span>{new Date(message.createdAt).toLocaleTimeString()}</span>
              </div>
              <div className="message-content">
                {editingMessageId === message.id ? (
                  <div className="edit-message-container">
                    <textarea
                      value={editingMessageText}
                      onChange={(e) => setEditingMessageText(e.target.value)}
                      className="edit-message-input"
                      autoFocus
                      onKeyPress={handleEditKeyPress}
                    />
                    <div className="edit-message-actions">
                      <button
                        onClick={saveEditedMessage}
                        className="save-edit-btn"
                      >
                        ✅
                      </button>
                      <button onClick={cancelEdit} className="cancel-edit-btn">
                        ❌
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {message.message.startsWith("[IMAGE]") ? (
                      <img
                        src={`${
                          import.meta.env.VITE_API_URL
                        }${message.message.replace("[IMAGE]", "")}`}
                        alt="Изображение в чате"
                        className="chat-image"
                      />
                    ) : (
                      message.message
                    )}
                    {message.isTemp && (
                      <span className="temp-indicator">...</span>
                    )}
                  </>
                )}
              </div>
              {message.userId === user?.id &&
                editingMessageId !== message.id && (
                  <div className="message-actions">
                    <button
                      className="message-menu-btn"
                      onClick={(e) => toggleMessageMenu(message.id, e)}
                      onTouchStart={handleTouchStart}
                      onTouchEnd={handleTouchEnd}
                      title="Действия с сообщением"
                    >
                      ⋮
                    </button>
                    {openMessageMenuId === message.id && (
                      <div className="message-menu">
                        <button
                          onClick={() =>
                            handleMenuClick(() => updateMessage(message.id))
                          }
                          className="menu-item"
                        >
                          ✏️ Редактировать
                        </button>
                        <button
                          onClick={() =>
                            handleMenuClick(() => deleteMessage(message.id))
                          }
                          className="menu-item delete"
                        >
                          ❌ Удалить
                        </button>
                      </div>
                    )}
                  </div>
                )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-container">
        <div className="emoji-container">
          <ButtonAdd onFileSelect={handleFileSelect} />

          <button className="emoji-button" onClick={toggleEmojiWindow}>
            😊
          </button>
          {visibleWindow && (
            <div className="emoji-picker-container">
              <EmojiPicker onEmojiClick={onEmojiClick} />
            </div>
          )}
        </div>

        <div className="input-wrapper" ref={inputWrapperRef}>
          <textarea
            value={inputMessage}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Сообщение"
            className="message-input"
            disabled={!isConnected || !currentSportClubId}
          />

          {showEmojiSuggestions && (
            <div className="emoji-suggestions">
              <div className="emoji-suggestions-header">
                "{emojiSearchQuery}"
              </div>
              <div className="emoji-suggestions-list">
                {searchEmojis(emojiSearchQuery).map((emojiData, index) => (
                  <button
                    key={index}
                    className="emoji-suggestion-item"
                    onClick={() => insertEmoji(emojiData.emoji)}
                    title={emojiData.name}
                  >
                    <span className="emoji-suggestion-emoji">
                      {emojiData.emoji}
                    </span>
                    <span className="emoji-suggestion-name">
                      {emojiData.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={sendMessage}
          className="send-button"
          disabled={!isConnected || !currentSportClubId}
        ></button>
      </div>
    </div>
  );
}

export default Chat;
