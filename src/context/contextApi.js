import React, { useState, useContext, createContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const APIContext = createContext();

export function APIContextProvder({ children }) {

  const baseUrl = "https://backend-todo-l32j.onrender.com";
  const navigate = useNavigate();
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [history, setHistory] = useState([]);
  const config = {
    headers: {
      token: localStorage.getItem("token"),
    },
  };
  //Fetch USER Data
  const getTodos = () => {
    axios
      .get(`${baseUrl}/todos`, config)
      .then((res) => {
        console.log(res);
        const data = res.data.message[0].todos;
        setTodos(data);
        const array = [];
        for (let i = 0; i < data.length; i++) {
          if (data[i].status === "Complete") {
            array.push(data[i]);
          }
        }
        setHistory(array);
        setIsLoading(false);
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    getTodos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const registerUser = (userData) => {
    console.log(userData);
    try {
      axios
        .post(`${baseUrl}/register`, userData)
        .then((res) => {
          console.log(res);
          navigate("/");
        })
        .catch((err) => {
          console.log(err);
          window.alert(`Registeration Failed`);
        });
    } catch (error) {
      window.alert(error.message);
    }
  };

  const loginUser = (loginData) => {
    console.log(loginData);
    try {
      axios
        .post(`${baseUrl}/login`, loginData)
        .then((res) => {
          console.log(res)
          const myToken = res.data.message;
          console.log(myToken);
          localStorage.setItem("token", myToken);
          localStorage.setItem("username", loginData.username);
          navigate("/headercomp");
          getTodos();
          document.location.reload();
          setUsername(loginData.username);
        })
        .catch((err) => {
          console.log(err);
          window.alert(`Login Failed`);
        });
    } catch (error) {
      window.alert(error.message);
    }
  };


  //Post CONTACTS
  const postTodos = async (todoData) => {
    console.log(todoData)
    await axios
      .post(`${baseUrl}/todos`, todoData, config)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
      getTodos();
  };

  const deleteTodos = (id) => {
    axios
      .delete(`${baseUrl}/todos/${id}`, config)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
      getTodos();
  };

  const putTodos = async (todoData, id) => {
    await axios
      .put(`${baseUrl}/todos/${id}`, todoData, config)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
      getTodos();
  };

  return (
    <APIContext.Provider
      value={{
        todos,
        isLoading,
        setIsLoading,
        username,
        registerUser,
        loginUser,
        getTodos,
        putTodos,
        postTodos,
        deleteTodos,
        history
      }}
    >
      {children}
    </APIContext.Provider>
  );
}

export function useAPI() {
    const context = useContext(APIContext);
    if (context === undefined) {
      throw new Error("Context must be used within a Provider");
    }
    return context;
  }
