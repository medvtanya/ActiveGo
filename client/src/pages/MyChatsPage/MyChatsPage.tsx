import React from "react";
import "./MyChatsPage.css";

// Моковые данные для чатов
const mockChats = [
  {
    id: 1,
    sportClubName: "Фитнес-клуб 'Энергия'",
    photo: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
    participants: 24,
    lastMessage: "Завтра тренировка в 18:00",
    lastMessageTime: "14:30"
  },
  {
    id: 2,
    sportClubName: "Спортивный клуб 'Олимп'",
    photo: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=400&h=300&fit=crop",
    participants: 18,
    lastMessage: "Новая программа тренировок готова",
    lastMessageTime: "12:15"
  },
  {
    id: 3,
    sportClubName: "Тренажерный зал 'Сила'",
    photo: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop",
    participants: 32,
    lastMessage: "Кто идет на йогу сегодня?",
    lastMessageTime: "09:45"
  },
  {
    id: 4,
    sportClubName: "Спортклуб 'Атлет'",
    photo: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
    participants: 15,
    lastMessage: "Напоминаю о соревнованиях в субботу",
    lastMessageTime: "Вчера"
  },
  {
    id: 5,
    sportClubName: "Фитнес-центр 'Вита'",
    photo: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=400&h=300&fit=crop",
    participants: 28,
    lastMessage: "Новый тренер начинает работу с понедельника",
    lastMessageTime: "2 дня назад"
  },
  {
    id: 6,
    sportClubName: "Спортивный клуб 'Максимум'",
    photo: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop",
    participants: 21,
    lastMessage: "Обновлено расписание групповых занятий",
    lastMessageTime: "3 дня назад"
  }
];

const MyChatsPage: React.FC = () => {
  const handleChatClick = (chatId: number) => {
    // Здесь будет переход в конкретный чат
    console.log(`Переход в чат ${chatId}`);
  };

  return (
    <div className="my-chats-page">
      <div className="chats-container">
        <h2>Мои чаты</h2>
        
        {mockChats.length === 0 ? (
          <div className="no-chats">
            <p>У вас пока нет активных чатов</p>
            <p>Присоединитесь к спортивному клубу, чтобы начать общение</p>
          </div>
        ) : (
          <div className="chats-grid">
            {mockChats.map((chat) => (
              <div key={chat.id} className="chat-card" onClick={() => handleChatClick(chat.id)}>
                <div className="chat-title-container">
                  <h3 className="chat-title">{chat.sportClubName}</h3>
                </div>
                
                <div className="chat-content">
                  <div className="chat-photo">
                    <img src={chat.photo} alt={chat.sportClubName} />
                  </div>
                  
                  <div className="chat-info">
                    <div className="chat-details">
                      <span className="participants-count">
                        {chat.participants} участников
                      </span>
                    </div>
                    
                    <div className="chat-message">
                      <p>{chat.lastMessage}</p>
                    </div>
                    
                    <div className="chat-actions">
                      <button className="chat-button">
                        Открыть чат
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyChatsPage; 