import React, { useState, useRef, useEffect } from "react";
import { useAPI } from "../context/contextApi";
import { useNavigate } from "react-router-dom";
import "./style.css";

const HeaderComp = () => {
  const navigate = useNavigate();
  const { postTodos, todos, isLoading, deleteTodos, putTodos, history } =
    useAPI();
  const [activity, setActivity] = useState("");
  const [ongoing, setOngoing] = useState(false);

  const handleLogOut = () => {
    navigate("/");
    localStorage.clear("token");
    window.location.reload();
  };
  const handleChange = (e) => {
    setActivity(e.target.value);
  };
  const handleClick = () => {
    const data = {
      activty: activity,
      status: "Pending",
      time_taken: "0:00",
      action: "Start",
    };
    postTodos(data);
    setActivity("");
  };
  const handleDelete = (id) => {
    deleteTodos(id);
  };

  const [timer, setTimer] = useState(0);
  const [start, setStart] = useState(false);
  const firstStart = useRef(true);
  const tick = useRef();

  useEffect(() => {
    if (firstStart.current) {
      firstStart.current = !firstStart.current;
      return;
    }
    if (start) {
      tick.current = setInterval(() => {
        setTimer((timer) => timer + 1);
      }, 1000);
    } else {
      clearInterval(tick.current);
    }

    return () => clearInterval(tick.current);
  }, [start]);

  const handleStart = (time, id) => {
    if (!ongoing) {
      setOngoing(true);
      setStart(true);
      const data = {
        status: "Ongoing",
        time_taken: dispSecondsAsMins(timer).toString(),
        action: "End",
      };
      putTodos(data, id);
      dispSecondsAsMins(timer);
    } else {
      window.alert("Already On Going");
    }
  };

  const dispSecondsAsMins = (seconds) => {
    console.log("seconds " + seconds);
    const mins = Math.floor(seconds / 60);
    const seconds_ = seconds % 60;
    return (
      mins.toString() + ":" + (seconds_ === 0 ? "00" : seconds_.toString())
    );
  };

  const endTimer = (id) => {
    setStart(false);
    setOngoing(false);
    const data = {
      status: "Complete",
      time_taken: dispSecondsAsMins(timer).toString(),
      action: "End",
    };
    putTodos(data, id);
    setTimer(0);
  };
  const handlePause = (id) => {
    let element;
    for (let i = 0; i < todos.length; i++) {
      if (todos[i]._id === id) {
        element = todos[i];
      }
    }
    if (element.status === "Ongoing") {
      const data = {
        status: "Paused",
        time_taken: dispSecondsAsMins(timer).toString(),
        action: "End",
      };
      putTodos(data, id);
      localStorage.setItem(id, timer);
      setOngoing(false);
      setTimer(0);
    } else {
      window.alert("Please First Start Before Pausing");
    }
  };
  const handleResume = (id) => {
    let element;
    for (let i = 0; i < todos.length; i++) {
      if (todos[i]._id === id) {
        element = todos[i];
      }
    }
    if (element.status === "Paused") {
      if (!ongoing) {
        setTimer(parseInt(localStorage.getItem(id)));
        setOngoing(true);
        setStart(true);
        const data = {
          status: "Ongoing",
          time_taken: dispSecondsAsMins(timer).toString(),
          action: "End",
        };
        putTodos(data, id);
        dispSecondsAsMins(timer);
      } else {
        window.alert("Already On Going");
      }
    } else {
      window.alert("Please First Paused Before Resuming");
    }
  };
  return (
    <>
      <div className="header">Welcome : {localStorage.getItem("username")}</div>
      <div className="body">
        <div className="sideBar">
          <h2>To Do List</h2>
          <h3>History</h3>
          <div className="historycontainer">
            {history.map((each) => {
              return <div>{each.activty}</div>;
            })}
          </div>
          <button className="btnLogOut button" onClick={handleLogOut}>Log Out</button>
        </div>
        <div className="main">
          <label>Add New Activity</label>
          <input type="text" value={activity} onChange={handleChange} />
          <button className="btnAdd button" onClick={handleClick}>Add</button>

          <div className="table">
            <table id="customers">
              <tr>
                <th>Activity</th>
                <th>Status</th>
                <th>Time Taken</th>
                <th>Action</th>
              </tr>
              {isLoading ? (
                <h2>Loading...</h2>
              ) : (
                todos.map((each, i) => {
                  return (
                    <tr key={i}>
                      <td>{each.activty}</td>
                      <td>{each.status}</td>
                      <td>{each.time_taken}</td>
                      <td>
                        {each.status !== "Complete" ? (
                          each.status === "Ongoing" ? (
                            <button className="btnEnd button" onClick={() => endTimer(each._id)}>
                              End
                            </button>
                          ) : (
                            <button
                            className="btnStart button"
                              onClick={() =>
                                handleStart(each.time_taken, each._id)
                              }
                            >
                              Start
                            </button>
                          )
                        ) : (
                          <></>
                        )}
                        <button className="btnDelete button" onClick={() => handleDelete(each._id)}>
                          Delete
                        </button>
                        <button className="btnPause button" onClick={() => handlePause(each._id)}>
                          Pause
                        </button>
                        <button className="btnResume button" onClick={() => handleResume(each._id)}>
                          Resume
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeaderComp;
