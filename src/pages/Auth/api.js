import api from "../../services/api";

export const loginAPI = (values) => api.post('api/admin/login', {
    email: values.email,
    password: values.password,
});