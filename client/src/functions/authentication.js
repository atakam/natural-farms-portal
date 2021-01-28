import Axios from 'axios';

const signin = ({email, password}, callback) => {
    return Axios.post("/login", {
      email, password,
    });
};

const logout = () => {
  return Axios.get("/logout");
};

const register = (entries, role, callback) => {
    entries = {
      ...entries,
        role: role
    };
    return Axios.post("/register", entries).then((response) => {
      console.log(response);
      if (response.data.errno) {
        callback && callback(response.data.sqlMessage);
      } else {
        callback && callback('');
        return signin(entries);
      }
    });
};

export { signin, register, logout };