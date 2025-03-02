import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5000/factories"; // Адрес API

function App() {
  const [factories, setFactories] = useState([]);
  const [comment, setComment] = useState("");

  // Получение данных с сервера при первом рендере
  useEffect(() => {
    fetchFactories();
  }, []);

  // Функция для получения данных с сервера
  const fetchFactories = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setFactories(data);
    } catch (error) {
      console.error("Ошибка при получении данных:", error);
    }
  };

  // Добавление новой записи
  const addFactory = async () => {
    if (!comment) {
      alert("Введите комментарий!");
      return;
    }

    try {
      await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment }),
      });
      setComment("");
      fetchFactories(); // Перезагружаем данные после добавления
    } catch (error) {
      console.error("Ошибка при добавлении данных:", error);
    }
  };

  // Удаление записи
  const deleteFactory = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      fetchFactories(); // Перезагружаем данные после удаления
    } catch (error) {
      console.error("Ошибка при удалении данных:", error);
    }
  };

  // Редактирование записи
  const updateFactory = async (id, newComment) => {
    if (!newComment.trim()) {
      alert("Комментарий не может быть пустым");
      return;
    }

    try {
      await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment: newComment }),
      });
      fetchFactories(); // Перезагружаем данные после обновления
    } catch (error) {
      console.error("Ошибка при обновлении данных:", error);
    }
  };

  return (
    <div className="container">
      <h1>Factories</h1>
      <input
        type="text"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Введите комментарий"
      />
      <button onClick={addFactory}>Добавить</button>

      <ul>
        {factories.map((factory) => (
          <li key={factory.id}>
            {factory.comment}
            <div>
              <button onClick={() => deleteFactory(factory.id)}>Удалить</button>
              <button
                onClick={() => {
                  const newComment = prompt(
                    "Введите новый комментарий:",
                    factory.comment
                  );
                  if (newComment !== null) {
                    updateFactory(factory.id, newComment);
                  }
                }}
              >
                Редактировать
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
