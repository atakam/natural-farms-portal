import Axios from 'axios';

const signin = ({email, password, isStaff}, callback) => {
    return Axios.post("/login", {
      email, password, isStaff
    });
};

const forgotPassword = ({email, isStaff}) => {
  return Axios.post("/forgotpw", {
    email, isStaff
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

const createOrder = (entries) => {
  return Axios.post("/orders/create", entries).then((response) => {
    console.log(response);
    return response;
  });
}

const insertOrderDetails = (entries) => {
  return Axios.post("/orders_details/create", entries).then((response) => {
    console.log(response);
    return response;
  });
}

const editOrder = (entries) => {
  return Axios.post("/orders/update/update/" + entries.form_id, entries).then((response) => {
    console.log(response);
    return response;
  });
}

const insertUpdatedOrderDetails = (entries) => {
  return Axios.delete("/orders_details/update/delete/" + entries.form_id).then((response) => {
    console.log({deleted: response});
    return Axios.post("/orders_details/update/create", entries).then((response2) => {
      console.log({updated: response2});
      return response2;
    });
  });
}

const setSalesRep = (entries) => {
  return Axios.post("/orders/staff/" + entries.form_id, entries).then((response) => {
    console.log(response);
    entries.callback && entries.callback();
    return response;
  });
}

const resetOrder = (entries) => {
  return Axios.post("/orders/reset/" + entries.formid).then((response) => {
    console.log(response);
    entries.callback && entries.callback();
    return response;
  });
}

const sendEmail = (entries) => {
  entries = {
    ...entries,
    hostname: location.hostname
  };
  return Axios.post("/email/" + entries.id, entries).then((response) => {
    console.log(response);
    entries.callback && entries.callback();
    return response;
  });
}

export {
  signin,
  forgotPassword,
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
  createOrder,
  insertOrderDetails,
  updateFormDeliveryDate,
  editOrder,
  insertUpdatedOrderDetails,
  setSalesRep,
  resetOrder,
  sendEmail
};