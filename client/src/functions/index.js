import Axios from 'axios';

const signin = ({email, password, isStaff}, callback) => {
    return Axios.post("/login", {
      email, password, isStaff
    });
};

const logout = () => {
  return Axios.get("/logout")
  .then(() => {
    window.location.replace('/');
  });
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
    return response;
  });
}

const deleteForm = ({formid}) => {
  return Axios.delete("/orders/delete/" + formid).then((response) => {
    console.log(response);
    return response;
  });
}

const updateOrder = ({entries, formid}) => {
  return Axios.post("/orders/update/" + formid, entries).then((response) => {
    console.log(response);
    return response;
  });
}

const deleteUser = ({id}) => {
  return Axios.delete("/user/delete/" + id).then((response) => {
    console.log(response);
    return response;
  });
}

const deleteStaff = ({id}) => {
  return Axios.delete("/staff/delete/" + id).then((response) => {
    console.log(response);
    return response;
  });
}

const updateStaff = ({entries, id}) => {
  return Axios.post("/staff/" + id, entries).then((response) => {
    console.log(response);
    return response;
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

const updateEmailTemplate = ({entries, id}) => {
  return Axios.post("/templates/email/" + id, entries).then((response) => {
    console.log(response);
    return response;
  });
}

const deleteProduct = ({id}) => {
  return Axios.delete("/product/delete/" + id).then((response) => {
    console.log(response);
    return response;
  });
}

const updateProduct = ({entries, id}) => {
  return Axios.post("/products/" + id, entries).then((response) => {
    console.log(response);
    return response;
  });
}

const createProduct = (entries, id) => {
  return Axios.put("/products/" + id, entries).then((response) => {
    console.log(response);
    return response;
  });
};

const deleteCategory = ({id}) => {
  return Axios.delete("/category/delete/" + id).then((response) => {
    console.log(response);
    return response;
  });
}

const updateCategory = ({entries, id}) => {
  return Axios.post("/categories/" + id, entries).then((response) => {
    console.log(response);
    return response;
  });
}

const createCategory = (entries, id) => {
  return Axios.put("/categories/" + id, entries).then((response) => {
    console.log(response);
    return response;
  });
};

const updateFormDeliveryDate = ({formid, delivery, date}) => {
  const num = delivery === 2 ? 'second' : (delivery === 3 ? 'third': 'first');
  delivery = 'conditions_' + num + 'deliverydate';
  const entries = {
    [delivery] : date
  }
  return Axios.post("/orders/delivery/update/" + formid, entries).then((response) => {
    console.log(response);
    return response;
  });
}

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
  registerStaff,
  updateEmailTemplate,
  deleteProduct,
  updateProduct,
  createProduct,
  deleteCategory,
  updateCategory,
  createCategory,
  updateFormDeliveryDate
};