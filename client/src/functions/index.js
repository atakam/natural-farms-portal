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

const updateUser = ({entries, id}) => {
  return Axios.post("/user/" + id, entries).then((response) => {
    console.log(response);
  });
}

const deleteForm = ({formid}) => {
  return Axios.delete("/orders/delete/" + formid).then((response) => {
    console.log(response);
  });
}

const updateOrder = ({entries, formid}) => {
  return Axios.post("/orders/update/" + formid, entries).then((response) => {
    console.log(response);
  });
}

const deleteUser = ({id}) => {
  return Axios.delete("/user/delete/" + id).then((response) => {
    console.log(response);
  });
}

const deleteStaff = ({id}) => {
  return Axios.delete("/staff/delete/" + id).then((response) => {
    console.log(response);
  });
}

const updateStaff = ({entries, id}) => {
  return Axios.post("/staff/" + id, entries).then((response) => {
    console.log(response);
  });
}

const registerStaff = (entries, callback) => {
  return Axios.post("/register/staff", entries).then((response) => {
    console.log(response);
    if (response.data.errno) {
      callback && callback(response.data.sqlMessage);
    } else {
      callback && callback('');
      return response;
    }
  });
};

export {
  signin,
  register,
  logout,
  updateUser,
  deleteForm,
  updateOrder,
  deleteUser,
  deleteStaff,
  updateStaff,
  registerStaff
};